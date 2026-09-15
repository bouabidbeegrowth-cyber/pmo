import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"
import { deleteUploadedImage } from "@/lib/uploads"

export const dynamic = "force-dynamic"

// GET /api/admin/seo — list every SEO meta row
export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  const rows = await db.seoMeta.findMany({ orderBy: { page: "asc" } })
  return ok(rows)
}

// PUT /api/admin/seo — upsert one page's SEO fields. This is a fixed-page
// catalog like UiText: `page` must match a seeded key, but the row itself
// may not exist yet (upsert), unlike UiText's update-only contract, because
// this resource also carries an image that needs replace/delete cleanup.
export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const body = await req.json().catch(() => null)
  if (!body || typeof body.page !== "string" || !body.page.trim()) {
    return fail("page is required", 400)
  }

  const ogImage = safeUrl(body.ogImage)

  try {
    const existing = await db.seoMeta.findUnique({ where: { page: body.page } })

    const row = await db.seoMeta.upsert({
      where: { page: body.page },
      update: {
        titleFr: body.titleFr ?? null,
        titleEn: body.titleEn ?? null,
        descriptionFr: body.descriptionFr ?? null,
        descriptionEn: body.descriptionEn ?? null,
        ogImage,
      },
      create: {
        page: body.page,
        titleFr: body.titleFr ?? null,
        titleEn: body.titleEn ?? null,
        descriptionFr: body.descriptionFr ?? null,
        descriptionEn: body.descriptionEn ?? null,
        ogImage,
      },
    })

    if (existing?.ogImage && existing.ogImage !== ogImage) {
      await deleteUploadedImage(existing.ogImage)
    }

    return ok(row)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Save failed", 500)
  }
}
