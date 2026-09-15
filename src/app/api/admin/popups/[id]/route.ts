import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"
import { deleteUploadedImage } from "@/lib/uploads"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)
  const existing = await db.popup.findUnique({ where: { id } })
  if (!existing) return fail("Popup not found", 404)
  if (typeof body.name === "string" && !body.name.trim()) {
    return fail("name cannot be empty", 400)
  }
  if (typeof body.messageFr === "string" && !body.messageFr.trim()) {
    return fail("messageFr cannot be empty", 400)
  }
  try {
    const data: Prisma.PopupUpdateInput = {
      name: body.name,
      photo: safeUrl(body.photo),
      messageFr: body.messageFr,
      messageEn: body.messageEn ?? null,
      ctaUrl: safeUrl(body.ctaUrl),
      isActive: body.isActive,
      displayOrder: typeof body.displayOrder === "number" ? body.displayOrder : undefined,
    }
    const popup = await db.popup.update({ where: { id }, data })

    // A new photo replaced the old one — remove the orphaned file/record.
    if (data.photo !== undefined && existing.photo && existing.photo !== data.photo) {
      await deleteUploadedImage(existing.photo)
    }

    return ok(popup)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Update failed", 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  try {
    const popup = await db.popup.delete({ where: { id } })
    await deleteUploadedImage(popup.photo)
    return ok({ success: true })
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Delete failed", 500)
  }
}
