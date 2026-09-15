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

async function countOtherActiveSuperAdmins(excludeId: string) {
  return db.adminUser.count({
    where: { role: "SUPER_ADMIN", isActive: true, id: { not: excludeId } },
  })
}

// PUT /api/admin/users/[id] — update a user's profile, role, status or password (super admin only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSuperAdmin()
  if (error) return error
  const { id } = await params

  const target = await db.adminUser.findUnique({ where: { id } })
  if (!target) return fail("User not found", 404)

  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)

  const isSelf = target.id === session.user.id
  if (isSelf && body.isActive === false) {
    return fail("You cannot deactivate your own account", 400)
  }

  const demotingFromSuperAdmin =
    target.role === "SUPER_ADMIN" && typeof body.role === "string" && body.role !== "SUPER_ADMIN"
  const deactivatingSuperAdmin = target.role === "SUPER_ADMIN" && body.isActive === false
  if (demotingFromSuperAdmin || deactivatingSuperAdmin) {
    const others = await countOtherActiveSuperAdmins(target.id)
    if (others === 0) {
      return fail("Cannot remove the last active super admin", 400)
    }
  }

  const data: Record<string, unknown> = {}
  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim()
  if (typeof body.email === "string" && body.email.trim()) {
    const email = body.email.toLowerCase().trim()
    if (email !== target.email) {
      const existing = await db.adminUser.findUnique({ where: { email } })
      if (existing) return fail("An account with this email already exists", 409)
    }
    data.email = email
  }
  if (body.role === "ADMIN" || body.role === "SUPER_ADMIN") data.role = body.role
  if (typeof body.isActive === "boolean") data.isActive = body.isActive
  if (typeof body.newPassword === "string" && body.newPassword.length > 0) {
    if (!isStrongPassword(body.newPassword)) {
      return fail(
        "New password is too weak. Use at least 8 characters mixing uppercase, lowercase, numbers or symbols.",
        400,
      )
    }
    data.passwordHash = await hashPassword(body.newPassword)
  }

  const updated = await db.adminUser.update({ where: { id }, data, select: SAFE_SELECT })
  return ok(updated)
}

// DELETE /api/admin/users/[id] — remove an admin account (super admin only)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireSuperAdmin()
  if (error) return error
  const { id } = await params

  if (id === session.user.id) {
    return fail("You cannot delete your own account", 400)
  }

  const target = await db.adminUser.findUnique({ where: { id } })
  if (!target) return fail("User not found", 404)

  if (target.role === "SUPER_ADMIN") {
    const others = await countOtherActiveSuperAdmins(id)
    if (others === 0) {
      return fail("Cannot delete the last active super admin", 400)
    }
  }

  await db.adminUser.delete({ where: { id } })
  return ok({ success: true })
}
