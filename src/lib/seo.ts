import type { Metadata } from "next"
import { db } from "@/lib/db"
import { pick, type Locale } from "@/lib/site-data"

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pmomastery.tn").replace(/\/$/, "")

export interface SeoDefaults {
  titleFr: string
  titleEn: string
  descriptionFr: string
  descriptionEn: string
}

export interface PageMetaOptions {
  /** Stable key matching a SeoMeta.page row, e.g. "programme". */
  page: string
  /** Public route, e.g. "/programme" ("" for the homepage). */
  path: string
  locale: Locale
  defaults: SeoDefaults
  /**
   * Homepage only: the title is already a complete brand string, so it
   * bypasses the root layout's "%s | PMO Mastery" template instead of
   * being appended to it.
   */
  absoluteTitle?: boolean
}

/**
 * Resolve a page's <title>/description/OG tags: admin-edited SeoMeta row
 * first, falling back to the caller's current hardcoded copy — same
 * fallback contract as getUiText, so a missing/unseeded row never renders
 * blank metadata.
 */
export async function buildPageMetadata({
  page,
  path,
  locale,
  defaults,
  absoluteTitle,
}: PageMetaOptions): Promise<Metadata> {
  const row = await db.seoMeta.findUnique({ where: { page } })

  const title =
    pick(row?.titleFr, row?.titleEn, locale) || pick(defaults.titleFr, defaults.titleEn, locale) || defaults.titleFr
  const description =
    pick(row?.descriptionFr, row?.descriptionEn, locale) ||
    pick(defaults.descriptionFr, defaults.descriptionEn, locale) ||
    defaults.descriptionFr

  const url = `${SITE_URL}${path}`
  const fullTitle = absoluteTitle ? title : `${title} | PMO Mastery`
  const ogImage = row?.ogImage || null
  const imageUrl = ogImage ? (ogImage.startsWith("/") ? `${SITE_URL}${ogImage}` : ogImage) : undefined

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: { fr: url, en: url },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "PMO Mastery",
      type: "website",
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  }
}
