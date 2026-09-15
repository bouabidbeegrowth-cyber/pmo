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
  const popups = await db.popup.findMany({
    where: { eventId },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  })
  return ok(popups)
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
  if (!body.messageFr) return fail("messageFr is required", 400)
  try {
    const data: Prisma.PopupCreateInput = {
      event: { connect: { id: eventId } },
      name: body.name,
      photo: safeUrl(body.photo),
      messageFr: body.messageFr,
      messageEn: body.messageEn ?? null,
      ctaUrl: safeUrl(body.ctaUrl),
      isActive: body.isActive ?? true,
      displayOrder: body.displayOrder ?? 0,
    }
    const popup = await db.popup.create({ data })
    return ok(popup, 201)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Create failed", 500)
  }
}
