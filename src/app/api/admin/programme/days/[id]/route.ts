import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail } from "@/lib/api"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

// PUT — update a day
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)

  const existing = await db.programmeDay.findUnique({ where: { id } })
  if (!existing) return fail("Day not found", 404)

  try {
    const data: Prisma.ProgrammeDayUpdateInput = {
      nameFr: body.nameFr,
      nameEn: body.nameEn ?? null,
      date: body.date ? new Date(body.date) : undefined,
      isActive: body.isActive,
      displayOrder: typeof body.displayOrder === "number" ? body.displayOrder : undefined,
    }
    const day = await db.programmeDay.update({ where: { id }, data })
    return ok(day)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Update failed", 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  try {
    await db.programmeDay.delete({ where: { id } })
    return ok({ success: true })
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Delete failed", 500)
  }
}
