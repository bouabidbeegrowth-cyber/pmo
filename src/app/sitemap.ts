import type { MetadataRoute } from "next"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

function maxDate(dates: Date[], fallback: Date): Date {
  if (dates.length === 0) return fallback
  return dates.reduce((max, d) => (d > max ? d : max), dates[0])
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pmomastery.tn"

  const [event, entryOverrides, extras, galleryItems] = await Promise.all([
    db.event.findFirst({
      where: { isActive: true },
      include: {
        speakers: { where: { isActive: true }, select: { updatedAt: true } },
        passes: { where: { isActive: true }, select: { updatedAt: true } },
        organizers: { where: { isActive: true }, select: { updatedAt: true } },
        partners: { where: { isActive: true }, select: { updatedAt: true } },
        programmeDays: {
          where: { isActive: true },
          select: { updatedAt: true, sessions: { select: { updatedAt: true } } },
        },
        contactInfo: { select: { updatedAt: true } },
        websiteSections: { select: { updatedAt: true } },
      },
    }),
    db.sitemapEntry.findMany(),
    db.sitemapExtraUrl.findMany({ where: { isActive: true } }),
    db.galleryItem.findMany({ where: { isActive: true }, select: { updatedAt: true } }),
  ])

  const overrideByPage = new Map(entryOverrides.map((e) => [e.page, e]))

  const now = new Date()
  const eventUpdated = event?.updatedAt ?? now

  const homeUpdated = maxDate(
    [eventUpdated, ...(event?.websiteSections.map((s) => s.updatedAt) ?? [])],
    eventUpdated,
  )
  const programmeUpdated = maxDate(
    (event?.programmeDays ?? []).flatMap((d) => [d.updatedAt, ...d.sessions.map((s) => s.updatedAt)]),
    eventUpdated,
  )
  const speakersUpdated = maxDate(event?.speakers.map((s) => s.updatedAt) ?? [], eventUpdated)
  const passesUpdated = maxDate(event?.passes.map((p) => p.updatedAt) ?? [], eventUpdated)
  const organizersUpdated = maxDate(event?.organizers.map((o) => o.updatedAt) ?? [], eventUpdated)
  const partnersUpdated = maxDate(event?.partners.map((p) => p.updatedAt) ?? [], eventUpdated)
  const contactUpdated = event?.contactInfo?.updatedAt ?? eventUpdated
  const galleryUpdated = maxDate(galleryItems.map((g) => g.updatedAt), eventUpdated)

  const pages: { page: string; path: string; lastModified: Date; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
    { page: "home", path: "", lastModified: homeUpdated, changeFrequency: "weekly", priority: 1 },
    { page: "evenement", path: "/evenement", lastModified: eventUpdated, changeFrequency: "weekly", priority: 0.9 },
    { page: "programme", path: "/programme", lastModified: programmeUpdated, changeFrequency: "weekly", priority: 0.9 },
    { page: "intervenants", path: "/intervenants", lastModified: speakersUpdated, changeFrequency: "weekly", priority: 0.8 },
    { page: "pass-duo", path: "/pass-duo", lastModified: passesUpdated, changeFrequency: "weekly", priority: 0.8 },
    { page: "pass-evenement", path: "/pass-evenement", lastModified: passesUpdated, changeFrequency: "weekly", priority: 0.8 },
    { page: "pass-formation", path: "/pass-formation", lastModified: passesUpdated, changeFrequency: "weekly", priority: 0.8 },
    { page: "partenaires", path: "/partenaires", lastModified: partnersUpdated, changeFrequency: "monthly", priority: 0.7 },
    { page: "organisateurs", path: "/organisateurs", lastModified: organizersUpdated, changeFrequency: "monthly", priority: 0.6 },
    { page: "galerie", path: "/galerie", lastModified: galleryUpdated, changeFrequency: "monthly", priority: 0.6 },
    { page: "contact", path: "/contact", lastModified: contactUpdated, changeFrequency: "monthly", priority: 0.5 },
  ]

  const entries: MetadataRoute.Sitemap = pages
    .filter((p) => overrideByPage.get(p.page)?.included !== false)
    .map((p) => ({
      url: `${siteUrl}${p.path}`,
      lastModified: p.lastModified,
      changeFrequency: p.changeFrequency,
      priority: overrideByPage.get(p.page)?.priorityOverride ?? p.priority,
    }))

  const extraEntries: MetadataRoute.Sitemap = extras.map((e) => ({
    url: e.path.startsWith("/") ? `${siteUrl}${e.path}` : e.path,
    lastModified: e.updatedAt,
    changeFrequency: e.changeFreq as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: e.priority,
  }))

  return [...entries, ...extraEntries]
}
