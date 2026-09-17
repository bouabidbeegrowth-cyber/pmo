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
  const items = await db.galleryItem.findMany({
    where: { eventId },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  })
  return ok(items)
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

  const imageUrl = safeUrl(body.imageUrl)
  if (!imageUrl) return fail("imageUrl is required", 400)

  try {
    let displayOrder = body.displayOrder
    if (typeof displayOrder !== "number" || displayOrder <= 0) {
      const max = await db.galleryItem.aggregate({ where: { eventId }, _max: { displayOrder: true } })
      displayOrder = (max._max.displayOrder ?? -1) + 1
    }

    const data: Prisma.GalleryItemCreateInput = {
      event: { connect: { id: eventId } },
      type: "IMAGE",
      imageUrl,
      captionFr: body.captionFr ?? null,
      captionEn: body.captionEn ?? null,
      isActive: body.isActive ?? true,
      showOnHomepage: body.showOnHomepage ?? false,
      displayOrder,
    }
    const item = await db.galleryItem.create({ data })
    return ok(item, 201)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Create failed", 500)
  }
}
