import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireSuperAdmin, ok, fail } from "@/lib/api"
import { hashPassword } from "@/lib/auth"
import { isStrongPassword } from "@/lib/password"

export const dynamic = "force-dynamic"

const SAFE_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
} as const

// GET /api/admin/users — list all admin accounts (super admin only)
export async function GET() {
  const { error } = await requireSuperAdmin()
  if (error) return error

  const users = await db.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: SAFE_SELECT,
  })
  return ok(users)
}

// POST /api/admin/users — create a new admin account (super admin only)
export async function POST(req: NextRequest) {
  const { error } = await requireSuperAdmin()
  if (error) return error

  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)

  const email = (body.email ?? "").toLowerCase().trim()
  const name = (body.name ?? "").trim()
  const password = body.password ?? ""
  const role = body.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN"

  if (!email || !name) return fail("Name and email are required", 400)
  if (!isStrongPassword(password)) {
    return fail(
      "Password is too weak. Use at least 8 characters mixing uppercase, lowercase, numbers or symbols.",
      400,
    )
  }

  const existing = await db.adminUser.findUnique({ where: { email } })
  if (existing) return fail("An account with this email already exists", 409)

  const passwordHash = await hashPassword(password)
  const user = await db.adminUser.create({
    data: { email, name, passwordHash, role, isActive: true },
    select: SAFE_SELECT,
  })
  return ok(user, 201)
}
