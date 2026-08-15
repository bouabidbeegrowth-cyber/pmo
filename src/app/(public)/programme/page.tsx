import Link from "next/link"
import { Clock3, ArrowRight, Download, Users } from "lucide-react"
import { getLocale, getActiveEvent } from "@/lib/site-data"
import { PageHero } from "@/components/public/page-hero"
import { ProgrammeSection } from "@/components/public/sections/programme-section"

export const dynamic = "force-dynamic"

export default async function ProgrammePage() {
  const locale = await getLocale()
  const event = await getActiveEvent()

  if (!event || event.programmeDays.length === 0) {
    return (
      <>
        <PageHero
          eyebrow={locale === "fr" ? "Agenda" : "Schedule"}
          title={locale === "fr" ? "Programme" : "Programme"}
          subtitle={locale === "fr" ? "Le programme sera bientôt publié." : "The programme will be published soon."}
          breadcrumbs={[{ href: "/", label: locale === "fr" ? "Accueil" : "Home" }, { label: locale === "fr" ? "Programme" : "Programme" }]}
        />
      </>
    )
  }

  const t = locale === "fr"
    ? {
        eyebrow: "Agenda",
        title: "Programme",
        subtitle: "2 jours intensifs d'échanges, d'apprentissage et de networking au cœur des meilleures pratiques PMO.",
        dayLabel: "Jour",
        registerCta: "Je m'inscris",
        speakersLabel: "Intervenants participants",
        sessionsCount: (n: number) => `${n} sessions`,
      }
    : {
        eyebrow: "Schedule",
        title: "Programme",
        subtitle: "2 intensive days of exchange, learning and networking at the heart of best PMO practices.",
        dayLabel: "Day",
        registerCta: "Register now",
        speakersLabel: "Participating speakers",
        sessionsCount: (n: number) => `${n} sessions`,
      }

  const totalSessions = event.programmeDays.reduce((acc, d) => acc + d.sessions.length, 0)

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
        breadcrumbs={[{ href: "/", label: locale === "fr" ? "Accueil" : "Home" }, { label: t.title }]}
      />

      {/* Quick stats bar */}
      <section className="py-6 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock3 className="w-4 h-4 text-pmo-violet" />
              <span className="font-medium">{event.programmeDays.length} {locale === "fr" ? "jours" : "days"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-pmo-violet" />
              <span className="font-medium">{t.sessionsCount(totalSessions)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-pmo-violet" />
              <span className="font-medium">{event.speakers.length} {locale === "fr" ? "intervenants" : "speakers"}</span>
            </div>
          </div>
          {event.registrationEnabled && (
            <Link href="/pass-duo" className="inline-flex items-center gap-2 rounded-xl bg-pmo-gold-gradient text-pmo-navy px-5 py-2.5 font-semibold text-sm shadow-premium hover:scale-[1.02] transition-transform">
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
      />
    </>
  )
}
