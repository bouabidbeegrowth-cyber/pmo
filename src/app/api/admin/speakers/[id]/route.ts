import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"
import { deleteUploadedImage } from "@/lib/uploads"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  const speaker = await db.speaker.findUnique({ where: { id } })
  if (!speaker) return fail("Speaker not found", 404)
  return ok(speaker)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)

  const existing = await db.speaker.findUnique({ where: { id } })
  if (!existing) return fail("Speaker not found", 404)

  if (typeof body.firstName === "string" && !body.firstName.trim()) {
    return fail("firstName cannot be empty", 400)
  }
  if (typeof body.lastName === "string" && !body.lastName.trim()) {
    return fail("lastName cannot be empty", 400)
  }

  try {
    const photo = body.photo !== undefined ? safeUrl(body.photo) : existing.photo
    const data: Prisma.SpeakerUpdateInput = {
      slug: body.slug ?? existing.slug,
      firstName: body.firstName ?? existing.firstName,
      lastName: body.lastName ?? existing.lastName,
      photo,
      positionFr: body.positionFr !== undefined ? body.positionFr : existing.positionFr,
      positionEn: body.positionEn !== undefined ? body.positionEn : existing.positionEn,
      company: body.company !== undefined ? body.company : existing.company,
      biographyFr: body.biographyFr !== undefined ? body.biographyFr : existing.biographyFr,
      biographyEn: body.biographyEn !== undefined ? body.biographyEn : existing.biographyEn,
      country: body.country !== undefined ? body.country : existing.country,
      linkedinUrl: body.linkedinUrl !== undefined ? safeUrl(body.linkedinUrl) : existing.linkedinUrl,
      websiteUrl: body.websiteUrl !== undefined ? safeUrl(body.websiteUrl) : existing.websiteUrl,
      twitterUrl: body.twitterUrl !== undefined ? safeUrl(body.twitterUrl) : existing.twitterUrl,
      isFeatured: body.isFeatured !== undefined ? body.isFeatured : existing.isFeatured,
      isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
      displayOrder: typeof body.displayOrder === "number" ? body.displayOrder : undefined,
    }
    const speaker = await db.speaker.update({ where: { id }, data })

    // A new photo replaced the old one — remove the orphaned file/record.
    if (existing.photo && existing.photo !== photo) {
      await deleteUploadedImage(existing.photo)
    }

    return ok(speaker)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Update failed", 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  try {
    const speaker = await db.speaker.delete({ where: { id } })
    await deleteUploadedImage(speaker.photo)
    return ok({ success: true })
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Delete failed", 500)
  }
}
