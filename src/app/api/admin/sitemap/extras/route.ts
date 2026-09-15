import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"

export const dynamic = "force-dynamic"

const CHANGE_FREQS = new Set(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"])

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)

  const path = safeUrl(body.path)
  if (!path) return fail("path is required and must be a valid relative path or URL", 400)

  const priority = typeof body.priority === "number" ? Math.min(1, Math.max(0, body.priority)) : 0.5
  const changeFreq = CHANGE_FREQS.has(body.changeFreq) ? body.changeFreq : "monthly"

  try {
    const extra = await db.sitemapExtraUrl.create({
      data: { path, priority, changeFreq, isActive: body.isActive ?? true },
    })
    return ok(extra, 201)
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      return fail("Cette URL est déjà dans le sitemap.", 400)
    }
    return fail(e instanceof Error ? e.message : "Create failed", 500)
  }
}
