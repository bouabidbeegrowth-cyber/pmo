import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"
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

  try {
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
      latitude: typeof body.latitude === "number" ? body.latitude : null,
      longitude: typeof body.longitude === "number" ? body.longitude : null,
      mapUrl: safeUrl(body.mapUrl),
      heroImageDesktop: safeUrl(body.heroImageDesktop) ?? body.heroImageDesktop ?? null,
      heroImageMobile: safeUrl(body.heroImageMobile) ?? body.heroImageMobile ?? null,
      heroLogo: safeUrl(body.heroLogo) ?? body.heroLogo ?? null,
      ogImage: safeUrl(body.ogImage) ?? body.ogImage ?? null,
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
    return ok(event)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Update failed", 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  try {
    await db.event.delete({ where: { id } })
    return ok({ success: true })
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Delete failed", 500)
  }
}
