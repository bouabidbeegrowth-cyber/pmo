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
  const existing = await db.organizer.findUnique({ where: { id } })
  if (!existing) return fail("Organizer not found", 404)
  if (typeof body.name === "string" && !body.name.trim()) {
    return fail("name cannot be empty", 400)
  }
  try {
    const data: Prisma.OrganizerUpdateInput = {
      name: body.name,
      logo: safeUrl(body.logo),
      descriptionFr: body.descriptionFr ?? null,
      descriptionEn: body.descriptionEn ?? null,
      websiteUrl: safeUrl(body.websiteUrl),
      linkedinUrl: safeUrl(body.linkedinUrl),
      facebookUrl: safeUrl(body.facebookUrl),
      instagramUrl: safeUrl(body.instagramUrl),
      founderName: body.founderName ?? null,
      founderTitle: body.founderTitle ?? null,
      founderPhoto: safeUrl(body.founderPhoto),
      founderCredentials: body.founderCredentials ?? null,
      isActive: body.isActive,
      displayOrder: typeof body.displayOrder === "number" ? body.displayOrder : undefined,
    }
    const org = await db.organizer.update({ where: { id }, data })

    // A new logo/photo replaced the old one — remove the orphaned file/record.
    if (data.logo !== undefined && existing.logo && existing.logo !== data.logo) {
      await deleteUploadedImage(existing.logo)
    }
    if (
      data.founderPhoto !== undefined &&
      existing.founderPhoto &&
      existing.founderPhoto !== data.founderPhoto
    ) {
      await deleteUploadedImage(existing.founderPhoto)
    }

    return ok(org)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Update failed", 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  try {
    const org = await db.organizer.delete({ where: { id } })
    await deleteUploadedImage(org.logo)
    await deleteUploadedImage(org.founderPhoto)
    return ok({ success: true })
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Delete failed", 500)
  }
}
