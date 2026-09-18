import type { Locale } from "@/lib/site-data"

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pmomastery.tn").replace(/\/$/, "")

/** schema.org BreadcrumbList JSON-LD — mirrors the visible breadcrumb trail. */
export function BreadcrumbStructuredData({ items }: { items: { href?: string; label: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.href ? `${SITE_URL}${item.href}` : undefined,
    })),
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

interface EventForSchema {
  titleFr: string
  titleEn?: string | null
  descriptionFr?: string | null
  descriptionEn?: string | null
  startDate: Date
  endDate?: Date | null
  venue?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  heroImageDesktop?: string | null
  ogImage?: string | null
  status: string
  passes: { nameFr: string; price: number; currency: string; paymentUrl?: string | null }[]
}

function absolute(url: string | null | undefined) {
  if (!url) return undefined
  return url.startsWith("/") ? `${SITE_URL}${url}` : url
}

const STATUS_MAP: Record<string, string> = {
  UPCOMING: "https://schema.org/EventScheduled",
  LIVE: "https://schema.org/EventScheduled",
  ENDED: "https://schema.org/EventScheduled",
}

/** schema.org Event JSON-LD — powers rich results (dates, venue, price) in search. */
export function EventStructuredData({ event, locale, url }: { event: EventForSchema; locale: Locale; url: string }) {
  const name = locale === "en" ? event.titleEn ?? event.titleFr : event.titleFr
  const description = locale === "en" ? event.descriptionEn ?? event.descriptionFr : event.descriptionFr
  const image = absolute(event.ogImage ?? event.heroImageDesktop)

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description: description ?? undefined,
    startDate: event.startDate.toISOString(),
    endDate: (event.endDate ?? event.startDate).toISOString(),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: STATUS_MAP[event.status] ?? "https://schema.org/EventScheduled",
    url,
    image: image ? [image] : undefined,
    location: {
      "@type": "Place",
      name: event.venue ?? undefined,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.address ?? undefined,
        addressLocality: event.city ?? undefined,
        addressCountry: event.country ?? undefined,
      },
    },
    organizer: {
      "@type": "Organization",
      name: "PMO Mastery",
      url: SITE_URL,
    },
    offers: event.passes.map((p) => ({
      "@type": "Offer",
      name: p.nameFr,
      price: p.price,
      priceCurrency: p.currency,
      url: p.paymentUrl ?? url,
      availability: "https://schema.org/InStock",
    })),
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

interface OrgForSchema {
  logo?: string | null
  linkedinUrl?: string | null
  facebookUrl?: string | null
  instagramUrl?: string | null
  youtubeUrl?: string | null
}

/** schema.org Organization JSON-LD, site-wide — powers the Google knowledge panel. */
export function OrganizationStructuredData({ org }: { org: OrgForSchema }) {
  const sameAs = [org.linkedinUrl, org.facebookUrl, org.instagramUrl, org.youtubeUrl].filter(Boolean)

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PMO Mastery",
    url: SITE_URL,
    logo: absolute(org.logo) ?? `${SITE_URL}/favicon-512.png`,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
