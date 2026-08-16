import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

/**
 * NextAuth options. Kept in lib (not the route file) so that server actions,
 * API handlers and middleware can all import the same config.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@pmomastery.tn" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const email = credentials.email.toLowerCase().trim()
        const user = await db.adminUser.findUnique({ where: { email } })
        if (!user || !user.isActive) return null
        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!valid) return null
        await db.adminUser.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role ?? "ADMIN"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as { id?: string }).id = token.id as string
        ;(session.user as { role?: string }).role = (token.role as string) ?? "ADMIN"
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

/** Hash a plaintext password using bcrypt (10 rounds). */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10)
}

/** Verify a plaintext password against a stored hash. */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

/** Seed the default admin user if none exists. */
export async function ensureAdminUser() {
  const count = await db.adminUser.count()
  if (count > 0) return null
  const email = (process.env.ADMIN_SEED_EMAIL ?? "admin@pmomastery.tn").toLowerCase().trim()
  const password = process.env.ADMIN_SEED_PASSWORD ?? "ChangeMe123!"
  const passwordHash = await hashPassword(password)
  return db.adminUser.create({
    data: {
      email,
      name: "PMO Mastery Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  })
}
