import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"
import { deleteUploadedImage } from "@/lib/uploads"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

// GET — all CMS sections + contact info for the active event
export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  const active = await db.event.findFirst({
    where: { isActive: true },
    include: {
      websiteSections: { include: { benefits: { orderBy: { displayOrder: "asc" } } } },
      contactInfo: true,
    },
  })
  if (!active) return ok({ sections: [], contactInfo: null })

  return ok({
    sections: active.websiteSections,
    contactInfo: active.contactInfo,
    eventId: active.id,
  })
}

// POST — upsert a section (create if missing, update if exists) + its benefits
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)
  if (!body.sectionKey) return fail("sectionKey is required", 400)

  let eventId = body.eventId
  if (!eventId) {
    const active = await db.event.findFirst({ where: { isActive: true } })
    if (!active) return fail("No active event.", 400)
    eventId = active.id
  }

  try {
    const existing = await db.websiteSection.findUnique({
      where: { eventId_sectionKey: { eventId, sectionKey: body.sectionKey } },
    })

    const payload: Prisma.WebsiteSectionUncheckedCreateInput = {
      eventId,
      sectionKey: body.sectionKey,
      titleFr: body.titleFr ?? null,
      titleEn: body.titleEn ?? null,
      subtitleFr: body.subtitleFr ?? null,
      subtitleEn: body.subtitleEn ?? null,
      descriptionFr: body.descriptionFr ?? null,
      descriptionEn: body.descriptionEn ?? null,
      ctaTextFr: body.ctaTextFr ?? null,
      ctaTextEn: body.ctaTextEn ?? null,
      ctaUrl: safeUrl(body.ctaUrl),
      backgroundImage: safeUrl(body.backgroundImage),
      isActive: body.isActive ?? true,
    }

    let section
    if (existing) {
      section = await db.websiteSection.update({
        where: { id: existing.id },
        data: payload,
      })
      // A new background image replaced the old one — remove the orphan.
      if (existing.backgroundImage && existing.backgroundImage !== payload.backgroundImage) {
        await deleteUploadedImage(existing.backgroundImage)
      }
    } else {
      section = await db.websiteSection.create({ data: payload })
    }

    // Replace benefits if provided
    if (Array.isArray(body.benefits)) {
      await db.benefit.deleteMany({ where: { websiteSectionId: section.id } })
      if (body.benefits.length > 0) {
        await db.benefit.createMany({
          data: body.benefits.map(
            (b: { icon?: string; titleFr: string; titleEn?: string; descriptionFr?: string; descriptionEn?: string; displayOrder?: number; isActive?: boolean }, i: number) => ({
              websiteSectionId: section.id,
              icon: b.icon ?? null,
              titleFr: b.titleFr,
              titleEn: b.titleEn ?? null,
              descriptionFr: b.descriptionFr ?? null,
              descriptionEn: b.descriptionEn ?? null,
              displayOrder: b.displayOrder ?? i,
              isActive: b.isActive ?? true,
            }),
          ),
        })
      }
    }

    const refreshed = await db.websiteSection.findUnique({
      where: { id: section.id },
      include: { benefits: { orderBy: { displayOrder: "asc" } } },
    })
    return ok(refreshed)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Save failed", 500)
  }
}
