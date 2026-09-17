import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"
import { deleteUploadedImage } from "@/lib/uploads"
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

  const imageUrl = safeUrl(body.imageUrl)
  if (!imageUrl) return fail("imageUrl is required", 400)

  try {
    const data: Prisma.GalleryItemUpdateInput = {
      type: "IMAGE",
      imageUrl,
      videoUrl: null,
      thumbnail: null,
      captionFr: body.captionFr ?? null,
      captionEn: body.captionEn ?? null,
      isActive: body.isActive,
      showOnHomepage: body.showOnHomepage,
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
