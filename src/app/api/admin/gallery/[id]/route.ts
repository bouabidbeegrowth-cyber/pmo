import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"
import { deleteUploadedImage } from "@/lib/uploads"
import { parseVideoUrl } from "@/lib/video"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)
  const existing = await db.galleryItem.findUnique({ where: { id } })
  if (!existing) return fail("Gallery item not found", 404)

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
    const data: Prisma.GalleryItemUpdateInput = {
      type,
      imageUrl: type === "IMAGE" ? imageUrl : null,
      videoUrl,
      thumbnail,
      captionFr: body.captionFr ?? null,
      captionEn: body.captionEn ?? null,
      isActive: body.isActive,
      displayOrder: typeof body.displayOrder === "number" ? body.displayOrder : undefined,
    }
    const item = await db.galleryItem.update({ where: { id }, data })

    // Orphaned uploaded files from a replaced/removed image or thumbnail.
    if (existing.imageUrl && existing.imageUrl !== data.imageUrl) {
      await deleteUploadedImage(existing.imageUrl)
    }
    if (existing.thumbnail && existing.thumbnail !== data.thumbnail) {
      await deleteUploadedImage(existing.thumbnail)
    }

    return ok(item)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Update failed", 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  try {
    const item = await db.galleryItem.delete({ where: { id } })
    await Promise.all([deleteUploadedImage(item.imageUrl), deleteUploadedImage(item.thumbnail)])
    return ok({ success: true })
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Delete failed", 500)
  }
}
