import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"

export const dynamic = "force-dynamic"

const CHANGE_FREQS = new Set(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"])

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)

  const existing = await db.sitemapExtraUrl.findUnique({ where: { id } })
  if (!existing) return fail("Not found", 404)

  const path = safeUrl(body.path)
  if (!path) return fail("path is required and must be a valid relative path or URL", 400)

  const priority = typeof body.priority === "number" ? Math.min(1, Math.max(0, body.priority)) : existing.priority
  const changeFreq = CHANGE_FREQS.has(body.changeFreq) ? body.changeFreq : existing.changeFreq

  try {
    const extra = await db.sitemapExtraUrl.update({
      where: { id },
      data: { path, priority, changeFreq, isActive: body.isActive ?? existing.isActive },
    })
    return ok(extra)
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      return fail("Cette URL est déjà dans le sitemap.", 400)
    }
    return fail(e instanceof Error ? e.message : "Update failed", 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  try {
    await db.sitemapExtraUrl.delete({ where: { id } })
    return ok({ success: true })
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Delete failed", 500)
  }
}
