import { db } from "@/lib/db"
import { cookies } from "next/headers"

export type Locale = "fr" | "en"

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const raw = cookieStore.get("pmo_locale")?.value
  if (raw === "fr" || raw === "en") return raw
  return "fr"
}

/**
 * Fetch the active event with ALL relations needed by public pages.
 * Single query — reused across every public page so data is consistent.
 */
export async function getActiveEvent() {
  return db.event.findFirst({
    where: { isActive: true },
    include: {
      speakers: {
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      },
      programmeDays: {
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        include: {
          sessions: {
            where: { isActive: true },
            orderBy: { displayOrder: "asc" },
            include: {
              speakers: { include: { speaker: true } },
              moderator: true,
            },
          },
        },
      },
      passes: {
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { price: "asc" }],
      },
      organizers: {
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      },
      partners: {
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      },
      popups: {
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      },
      galleryItems: {
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      },
      websiteSections: {
        include: { benefits: { orderBy: { displayOrder: "asc" } } },
      },
      contactInfo: true,
    },
  })
}

export type EventWithRelations = Awaited<ReturnType<typeof getActiveEvent>>

/**
 * All event editions that have at least one active gallery item, newest
 * first, each with its active gallery items. Used by the /galerie page,
 * which — unlike the rest of the public site — shows every edition, not
 * just the currently active one.
 */
export async function getEditionsWithGallery() {
  const events = await db.event.findMany({
    where: { galleryItems: { some: { isActive: true } } },
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      editionName: true,
      isActive: true,
      galleryItems: {
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  })
  return events
}

/**
 * Gallery items flagged to appear on the homepage, across all editions —
 * not scoped to the currently active event. Lets the homepage preview stay
 * stable even when the active edition changes.
 */
export async function getHomepageGallery() {
  return db.galleryItem.findMany({
    where: { isActive: true, showOnHomepage: true },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  })
}

/**
 * The single autoplaying background video for the Gallery page hero, if one
 * has been uploaded and enabled for the active event.
 */
export async function getGalleryHeroVideo() {
  const active = await db.event.findFirst({ where: { isActive: true } })
  if (!active) return null
  const section = await db.websiteSection.findUnique({
    where: { eventId_sectionKey: { eventId: active.id, sectionKey: "GALLERY_HERO" } },
  })
  if (!section || section.isActive === false) return null
  return section.backgroundImage ?? null
}

/** The background banner image for the Passes page hero, if one is set. */
export async function getPassesHeroImage() {
  const active = await db.event.findFirst({ where: { isActive: true } })
  if (!active) return null
  const section = await db.websiteSection.findUnique({
    where: { eventId_sectionKey: { eventId: active.id, sectionKey: "PASSES_HERO" } },
  })
  return section?.backgroundImage ?? null
}

/** Helper to pick the right localized string. */
export function pick<T>(fr: T | null | undefined, en: T | null | undefined, locale: Locale): T | null | undefined {
  return locale === "en" ? (en ?? fr) : fr
}

/**
 * Admin-editable UI text (nav labels, headings, buttons, empty states —
 * everything that isn't part of the richer WebsiteSection content model).
 * Returns a lookup function; callers always pass their current hardcoded
 * string as `fallback`, so a missing key never renders blank/undefined.
 */
export async function getUiText(locale: Locale) {
  const rows = await db.uiText.findMany()
  const map = new Map(rows.map((r) => [r.key, pick(r.valueFr, r.valueEn, locale) ?? r.valueFr]))
  return (key: string, fallback: string) => map.get(key) ?? fallback
}
