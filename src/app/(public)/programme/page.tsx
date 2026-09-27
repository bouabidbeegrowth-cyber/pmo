import type { Metadata } from "next"
import Link from "next/link"
import { Clock3, ArrowRight, Users, Layers } from "lucide-react"
import { getLocale, getActiveEvent, getUiText } from "@/lib/site-data"
import { buildPageMetadata } from "@/lib/seo"
import { PageHero } from "@/components/public/page-hero"
import { ProgrammeSection } from "@/components/public/sections/programme-section"
import { BreadcrumbStructuredData } from "@/components/public/structured-data"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    page: "programme",
    path: "/programme",
    locale,
    defaults: {
      titleFr: "Programme",
      titleEn: "Programme",
      descriptionFr:
        "2 jours intensifs d'échanges, d'apprentissage et de networking au cœur des meilleures pratiques PMO.",
      descriptionEn: "2 intensive days of exchange, learning and networking at the heart of best PMO practices.",
    },
  })
}

const SESSION_TYPE_KEYS = ["OUVERTURE", "KEYNOTE", "PANEL", "BREAK", "NETWORKING", "CLOSING", "WORKSHOP", "SESSION", "PMO_TALKS", "MASTERCLASS"]
const SESSION_TYPE_DEFAULTS: Record<string, string> = {
  OUVERTURE: "Ouverture", KEYNOTE: "Keynote", PANEL: "Panel", BREAK: "Pause", NETWORKING: "Networking",
  CLOSING: "Clôture", WORKSHOP: "Atelier", SESSION: "Session", PMO_TALKS: "PMO Talks", MASTERCLASS: "Masterclass",
}

export default async function ProgrammePage() {
  const locale = await getLocale()
  const event = await getActiveEvent()
  const ui = await getUiText(locale)

  const homeLabel = ui("common.breadcrumb.home", "Accueil")

  if (!event || event.programmeDays.length === 0) {
    const emptyBreadcrumbs = [{ href: "/", label: homeLabel }, { label: ui("programme.hero.title", "Programme") }]
    return (
      <>
        <BreadcrumbStructuredData items={emptyBreadcrumbs} />
        <PageHero
          title={ui("programme.hero.title", "Programme")}
          subtitle={ui("programme.emptyState.subtitle", "Le programme sera bientôt publié.")}
          breadcrumbs={emptyBreadcrumbs}
        />
      </>
    )
  }

  const t = {
    title: ui("programme.hero.title", "Programme"),
    subtitle: ui("programme.hero.subtitle", "2 jours intensifs d'échanges, d'apprentissage et de networking au cœur des meilleures pratiques PMO."),
    dayLabel: ui("programme.dayLabel", "Jour"),
    registerCta: ui("common.cta.register", "Je m'inscris"),
    statDays: ui("programme.stat.daysStatic", "2 jours"),
    statSessions: ui("programme.stat.sessionsStatic", "4 sessions de formations"),
    statSpeakers: ui("programme.stat.speakersStatic", "25 speakers"),
  }

  const sessionTypeLabels = Object.fromEntries(
    SESSION_TYPE_KEYS.map((k) => [k, ui(`programme.sessionType.${k}`, SESSION_TYPE_DEFAULTS[k])]),
  )

  const breadcrumbs = [{ href: "/", label: homeLabel }, { label: t.title }]

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbs} />
      <PageHero
        title={t.title}
        subtitle={t.subtitle}
        breadcrumbs={breadcrumbs}
      />

      {/* Quick stats bar */}
      <section className="py-6 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock3 className="w-4 h-4 text-pmo-violet" />
              <span className="font-medium">{t.statDays}</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-pmo-violet" />
              <span className="font-medium">{t.statSessions}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-pmo-violet" />
              <span className="font-medium">{t.statSpeakers}</span>
            </div>
          </div>
          {event.registrationEnabled && (
            <Link href="/passes" className="inline-flex items-center gap-2 rounded-xl bg-pmo-gold-gradient text-white px-5 py-2.5 font-semibold text-sm shadow-premium hover:scale-[1.02] transition-transform">
              {t.registerCta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </section>

      {/* Full programme */}
      <ProgrammeSection
        days={event.programmeDays.map((d) => ({
          ...d,
          date: d.date.toISOString(),
          sessions: d.sessions.map((s) => ({
            ...s,
            speakers: s.speakers.map((ss) => ({ speaker: ss.speaker })),
          })),
        }))}
        locale={locale}
        title={t.title}
        subtitle={t.subtitle}
        dayLabel={t.dayLabel}
        sessionTypeLabels={sessionTypeLabels}
        showCta={event.registrationEnabled}
        ctaLabel={t.registerCta}
        ctaHref="/passes"
      />
    </>
  )
}
