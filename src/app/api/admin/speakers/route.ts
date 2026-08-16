import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

// GET /api/admin/speakers?eventId=…
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get("eventId")

  // Default to the active event if no eventId provided
  let activeEventId = eventId
  if (!activeEventId) {
    const active = await db.event.findFirst({ where: { isActive: true } })
    activeEventId = active?.id
  }
  if (!activeEventId) return ok([])

  const speakers = await db.speaker.findMany({
    where: { eventId: activeEventId },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  })
  return ok(speakers)
}

// POST /api/admin/speakers
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)

  // Resolve event
  let eventId = body.eventId
  if (!eventId) {
    const active = await db.event.findFirst({ where: { isActive: true } })
    if (!active) return fail("No active event. Create one first.", 400)
    eventId = active.id
  }

  if (!body.firstName || !body.lastName) {
    return fail("firstName and lastName are required", 400)
  }

  // Generate slug if missing
  const slug = body.slug || slugify(`${body.firstName}-${body.lastName}`)

  try {
    const data: Prisma.SpeakerCreateInput = {
      event: { connect: { id: eventId } },
      slug,
      firstName: body.firstName,
      lastName: body.lastName,
      photo: safeUrl(body.photo) ?? body.photo ?? null,
      positionFr: body.positionFr ?? null,
      positionEn: body.positionEn ?? null,
      company: body.company ?? null,
      biographyFr: body.biographyFr ?? null,
      biographyEn: body.biographyEn ?? null,
      country: body.country ?? null,
      linkedinUrl: safeUrl(body.linkedinUrl),
      websiteUrl: safeUrl(body.websiteUrl),
      twitterUrl: safeUrl(body.twitterUrl),
      isFeatured: body.isFeatured ?? false,
      isActive: body.isActive ?? true,
      displayOrder: body.displayOrder ?? 0,
    }
    const speaker = await db.speaker.create({ data })
    return ok(speaker, 201)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Create failed", 500)
  }
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
