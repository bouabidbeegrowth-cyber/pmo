import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail } from "@/lib/api"

export const dynamic = "force-dynamic"

// GET — all per-page sitemap entries + custom extra URLs
export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  const [entries, extras] = await Promise.all([
    db.sitemapEntry.findMany({ orderBy: { page: "asc" } }),
    db.sitemapExtraUrl.findMany({ orderBy: { createdAt: "desc" } }),
  ])
  return ok({ entries, extras })
}

// PUT — upsert one page's include/priority override (fixed page-key catalog)
export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const body = await req.json().catch(() => null)
  if (!body || typeof body.page !== "string" || !body.page.trim()) {
    return fail("page is required", 400)
  }

  try {
    const data = {
      included: body.included ?? true,
      priorityOverride: typeof body.priorityOverride === "number" ? body.priorityOverride : null,
    }
    const entry = await db.sitemapEntry.upsert({
      where: { page: body.page },
      update: data,
      create: { page: body.page, ...data },
    })
    return ok(entry)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Save failed", 500)
  }
}
