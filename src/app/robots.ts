import type { MetadataRoute } from "next"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

function parseLines(value: string | null | undefined): string[] {
  if (!value) return []
  return value
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pmomastery.tn"
  const settings = await db.seoSettings.findUnique({ where: { id: "singleton" } })

  // Baseline safety rules are always enforced — admins can only add to this
  // list via /admin/seo, never remove /admin or /api from it.
  const disallow = ["/admin", "/api", ...parseLines(settings?.extraDisallow)]
  const extraAllow = parseLines(settings?.extraAllow)

  return {
    rules: [
      {
        userAgent: "*",
        allow: extraAllow.length > 0 ? ["/", ...extraAllow] : "/",
        disallow,
        ...(settings?.crawlDelay ? { crawlDelay: settings.crawlDelay } : {}),
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
