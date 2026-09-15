import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  const event = id
    ? await db.event.findUnique({
        where: { id },
        include: {
          contactInfo: true,
          websiteSections: { include: { benefits: { orderBy: { displayOrder: "asc" } } } },
        },
      })
    : await db.event.findFirst({
        where: { isActive: true },
        orderBy: { startDate: "desc" },
        include: {
          contactInfo: true,
          websiteSections: { include: { benefits: { orderBy: { displayOrder: "asc" } } } },
        },
      })

  const allEvents = await db.event.findMany({
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      editionName: true,
      titleFr: true,
      titleEn: true,
      startDate: true,
      isActive: true,
      status: true,
    },
  })

  return ok({ active: event, all: allEvents })
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON body", 400)

  const required = ["slug", "editionName", "titleFr", "titleEn", "startDate"]
  for (const f of required) {
    if (!body[f]) return fail(`Missing field: ${f}`, 400)
  }

  try {
    const data: Prisma.EventCreateInput = {
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
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
      startTime: body.startTime ?? null,
      endTime: body.endTime ?? null,
      timezone: body.timezone ?? "Africa/Tunis",
      countdownTarget: body.countdownTarget ? new Date(body.countdownTarget) : null,
      venue: body.venue ?? null,
      address: body.address ?? null,
      city: body.city ?? null,
      country: body.country ?? null,
      latitude: typeof body.latitude === "number" ? body.latitude : null,
      longitude: typeof body.longitude === "number" ? body.longitude : null,
      mapUrl: safeUrl(body.mapUrl),
      heroImageDesktop: safeUrl(body.heroImageDesktop),
      heroImageMobile: safeUrl(body.heroImageMobile),
      heroLogo: safeUrl(body.heroLogo),
      ogImage: safeUrl(body.ogImage),
      registrationEnabled: body.registrationEnabled ?? true,
      status: body.status ?? "UPCOMING",
      isActive: body.isActive ?? true,
    }

    if (data.isActive) {
      await db.event.updateMany({ where: { isActive: true }, data: { isActive: false } })
    }

    const event = await db.$transaction(async (tx) => {
      const created = await tx.event.create({ data })
      await tx.contactInfo.create({ data: { eventId: created.id } })
      return created
    })

    return ok(event, 201)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return fail("Ce slug est déjà utilisé par une autre édition.", 400)
    }
    return fail(
      e instanceof Error ? e.message : "Failed to create event",
      500,
      e instanceof Error ? undefined : String(e),
    )
  }
}
