import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error
  const { searchParams } = new URL(req.url)
  let eventId = searchParams.get("eventId")
  if (!eventId) {
    const active = await db.event.findFirst({ where: { isActive: true } })
    eventId = active?.id
  }
  if (!eventId) return ok([])
  const partners = await db.partner.findMany({
    where: { eventId },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  })
  return ok(partners)
}

export async function POST(req: NextRequest) {
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
  if (!body.name) return fail("name is required", 400)
  try {
    const data: Prisma.PartnerCreateInput = {
      event: { connect: { id: eventId } },
      name: body.name,
      logo: safeUrl(body.logo),
      category: body.category ?? "PARTNER",
      websiteUrl: safeUrl(body.websiteUrl),
      descriptionFr: body.descriptionFr ?? null,
      descriptionEn: body.descriptionEn ?? null,
      isActive: body.isActive ?? true,
      displayOrder: body.displayOrder ?? 0,
    }
    const partner = await db.partner.create({ data })
    return ok(partner, 201)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Create failed", 500)
  }
}
