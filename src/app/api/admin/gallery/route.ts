import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"
import { parseVideoUrl } from "@/lib/video"
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

  const type = body.type === "VIDEO" ? "VIDEO" : "IMAGE"
  const imageUrl = safeUrl(body.imageUrl)
  if (type === "IMAGE" && !imageUrl) return fail("imageUrl is required for an image item", 400)

  let videoUrl: string | null = null
  let thumbnail: string | null = null
  if (type === "VIDEO") {
    const parsed = typeof body.videoUrl === "string" ? parseVideoUrl(body.videoUrl.trim()) : null
    if (!parsed) return fail("Invalid video URL. Must be a YouTube or Vimeo link.", 400)
    videoUrl = body.videoUrl.trim()
    thumbnail = safeUrl(body.thumbnail)
  }

  try {
    const data: Prisma.GalleryItemCreateInput = {
      event: { connect: { id: eventId } },
      type,
      imageUrl: type === "IMAGE" ? imageUrl : null,
      videoUrl,
      thumbnail,
      captionFr: body.captionFr ?? null,
      captionEn: body.captionEn ?? null,
      isActive: body.isActive ?? true,
      displayOrder: typeof body.displayOrder === "number" ? body.displayOrder : 0,
    }
    const item = await db.galleryItem.create({ data })
    return ok(item, 201)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Create failed", 500)
  }
}
