import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

// PUT — update contact info for the active event
export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)

  let eventId = body.eventId
  if (!eventId) {
    const active = await db.event.findFirst({ where: { isActive: true } })
    if (!active) return fail("No active event.", 400)
    eventId = active.id
  }

  try {
    const data: Prisma.ContactInfoUncheckedCreateInput = {
      eventId,
      email: body.email ?? null,
      phone: body.phone ?? null,
      address: body.address ?? null,
      city: body.city ?? null,
      country: body.country ?? null,
      mapUrl: safeUrl(body.mapUrl),
      linkedinUrl: safeUrl(body.linkedinUrl),
      facebookUrl: safeUrl(body.facebookUrl),
      instagramUrl: safeUrl(body.instagramUrl),
      youtubeUrl: safeUrl(body.youtubeUrl),
      websiteUrl: safeUrl(body.websiteUrl),
    }

    const existing = await db.contactInfo.findUnique({ where: { eventId } })
    let contact
    if (existing) {
      contact = await db.contactInfo.update({ where: { eventId }, data })
    } else {
      contact = await db.contactInfo.create({ data })
    }
    return ok(contact)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Save failed", 500)
  }
}
