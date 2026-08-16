import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"
import { authOptions, hashPassword, verifyPassword } from "@/lib/auth"
import { ok, fail } from "@/lib/api"

export const dynamic = "force-dynamic"

// PUT — change the current admin's password
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return fail("Unauthorized", 401)

  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)

  const { currentPassword, newPassword } = body
  if (!currentPassword || !newPassword) {
    return fail("currentPassword and newPassword are required", 400)
  }
  if (newPassword.length < 8) {
    return fail("New password must be at least 8 characters", 400)
  }

  const user = await db.adminUser.findUnique({
    where: { email: session.user.email.toLowerCase() },
  })
  if (!user) return fail("User not found", 404)

  const valid = await verifyPassword(currentPassword, user.passwordHash)
  if (!valid) return fail("Current password is incorrect", 400)

  const passwordHash = await hashPassword(newPassword)
  await db.adminUser.update({
    where: { id: user.id },
    data: { passwordHash },
  })

  return ok({ success: true })
}
