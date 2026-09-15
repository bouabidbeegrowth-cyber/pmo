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
  const existing = await db.partner.findUnique({ where: { id } })
  if (!existing) return fail("Partner not found", 404)
  if (typeof body.name === "string" && !body.name.trim()) {
    return fail("name cannot be empty", 400)
  }
  try {
    const data: Prisma.PartnerUpdateInput = {
      name: body.name,
      logo: safeUrl(body.logo),
      category: body.category,
      websiteUrl: safeUrl(body.websiteUrl),
      descriptionFr: body.descriptionFr ?? null,
      descriptionEn: body.descriptionEn ?? null,
      isActive: body.isActive,
      displayOrder: typeof body.displayOrder === "number" ? body.displayOrder : undefined,
    }
    const partner = await db.partner.update({ where: { id }, data })

    // A new logo replaced the old one — remove the orphaned file/record.
    if (data.logo !== undefined && existing.logo && existing.logo !== data.logo) {
      await deleteUploadedImage(existing.logo)
    }

    return ok(partner)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Update failed", 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  try {
    const partner = await db.partner.delete({ where: { id } })
    await deleteUploadedImage(partner.logo)
    return ok({ success: true })
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Delete failed", 500)
  }
}
