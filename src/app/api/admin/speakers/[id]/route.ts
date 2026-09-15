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
    const photo = safeUrl(body.photo)
    const data: Prisma.SpeakerUpdateInput = {
      slug: body.slug,
      firstName: body.firstName,
      lastName: body.lastName,
      photo,
      positionFr: body.positionFr ?? null,
      positionEn: body.positionEn ?? null,
      company: body.company ?? null,
      biographyFr: body.biographyFr ?? null,
      biographyEn: body.biographyEn ?? null,
      country: body.country ?? null,
      linkedinUrl: safeUrl(body.linkedinUrl),
      websiteUrl: safeUrl(body.websiteUrl),
      twitterUrl: safeUrl(body.twitterUrl),
      isFeatured: body.isFeatured,
      isActive: body.isActive,
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
