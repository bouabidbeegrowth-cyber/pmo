import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail } from "@/lib/api"

export const dynamic = "force-dynamic"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  const settings = await db.seoSettings.findUnique({ where: { id: "singleton" } })
  return ok(settings ?? { id: "singleton", extraDisallow: null, extraAllow: null, crawlDelay: null })
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)

  try {
    const data = {
      extraDisallow: typeof body.extraDisallow === "string" ? body.extraDisallow : null,
      extraAllow: typeof body.extraAllow === "string" ? body.extraAllow : null,
      crawlDelay: typeof body.crawlDelay === "number" ? body.crawlDelay : null,
    }
    const settings = await db.seoSettings.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    })
    return ok(settings)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Save failed", 500)
  }
}
