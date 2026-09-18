import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"
import { deleteUploadedImage } from "@/lib/uploads"
import { extractCoordsFromMapsUrl } from "@/lib/maps"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON body", 400)

  const existing = await db.event.findUnique({ where: { id } })
  if (!existing) return fail("Event not found", 404)

  const required = ["slug", "editionName", "titleFr", "titleEn", "startDate"]
  for (const f of required) {
    if (!body[f]) return fail(`Missing field: ${f}`, 400)
  }

  try {
    const newMapUrl = safeUrl(body.mapUrl)
    let latitude = typeof body.latitude === "number" ? body.latitude : null
    let longitude = typeof body.longitude === "number" ? body.longitude : null

    // The map link changed — re-derive the pin from it so the embedded map
    // and the "open in maps" button always agree, instead of silently
    // drifting apart whenever only one of the two gets updated.
    if (newMapUrl && newMapUrl !== existing.mapUrl) {
      const coords = await extractCoordsFromMapsUrl(newMapUrl)
      if (coords) {
        latitude = coords.lat
        longitude = coords.lng
      }
    }

    const data: Prisma.EventUpdateInput = {
      slug: body.slug,
      editionName: body.editionName,
      titleFr: body.titleFr,
      titleEn: body.titleEn,
      subtitleFr: body.subtitleFr ?? null,
      subtitleEn: body.subtitleEn ?? null,
      themeTaglineFr: body.themeTaglineFr ?? null,
      themeTaglineEn: body.themeTaglineEn ?? null,
      descriptionFr: body.descriptionFr ?? null,
      descriptionEn: body.descriptionEn ?? null,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : null,
      startTime: body.startTime ?? null,
      endTime: body.endTime ?? null,
      timezone: body.timezone,
      countdownTarget: body.countdownTarget ? new Date(body.countdownTarget) : null,
      venue: body.venue ?? null,
      address: body.address ?? null,
      city: body.city ?? null,
      country: body.country ?? null,
      latitude,
      longitude,
      mapUrl: newMapUrl,
      heroImageDesktop: safeUrl(body.heroImageDesktop),
      heroImageMobile: safeUrl(body.heroImageMobile),
      heroLogo: safeUrl(body.heroLogo),
      ogImage: safeUrl(body.ogImage),
      registrationEnabled: body.registrationEnabled,
      status: body.status,
      isActive: body.isActive,
    }

    if (body.isActive) {
      await db.event.updateMany({
        where: { isActive: true, NOT: { id } },
        data: { isActive: false },
      })
    }

    const event = await db.event.update({ where: { id }, data })

    // Any image replaced by a new one — remove the orphaned file/record.
    const imageFields = ["heroImageDesktop", "heroImageMobile", "heroLogo", "ogImage"] as const
    for (const field of imageFields) {
      const oldValue = existing[field]
      const newValue = data[field]
      if (newValue !== undefined && oldValue && oldValue !== newValue) {
        await deleteUploadedImage(oldValue)
      }
    }

    return ok(event)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return fail("Ce slug est déjà utilisé par une autre édition.", 400)
    }
    return fail(e instanceof Error ? e.message : "Update failed", 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  try {
    // Cascade-deleting the event also cascade-deletes every speaker,
    // organizer, partner and popup under it — gather their image URLs
    // before deletion so those files don't get orphaned on disk.
    const existing = await db.event.findUnique({
      where: { id },
      include: {
        speakers: { select: { photo: true } },
        organizers: { select: { logo: true, founderPhoto: true } },
        partners: { select: { logo: true } },
        popups: { select: { photo: true } },
        websiteSections: { select: { backgroundImage: true } },
      },
    })
    if (!existing) return fail("Event not found", 404)

    const childImages = [
      ...existing.speakers.map((s) => s.photo),
      ...existing.organizers.flatMap((o) => [o.logo, o.founderPhoto]),
      ...existing.partners.map((p) => p.logo),
      ...existing.popups.map((p) => p.photo),
      ...existing.websiteSections.map((s) => s.backgroundImage),
    ]

    await db.event.delete({ where: { id } })

    await Promise.all(
      [
        existing.heroImageDesktop,
        existing.heroImageMobile,
        existing.heroLogo,
        existing.ogImage,
        ...childImages,
      ].map((url) => deleteUploadedImage(url)),
    )

    return ok({ success: true })
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Delete failed", 500)
  }
}
