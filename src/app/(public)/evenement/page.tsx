import Link from "next/link"
import { format } from "date-fns"
import { fr, enUS } from "date-fns/locale"
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket,
  Network,
  Target,
  Award,
  Sparkles,
  Rocket,
  TrendingUp,
  Lightbulb,
  Brain,
  Zap,
  Compass,
  Globe,
  ArrowRight,
  Building2,
  Navigation,
} from "lucide-react"
import type { Metadata } from "next"
import { getLocale, getActiveEvent, getUiText, pick } from "@/lib/site-data"
import { buildPageMetadata } from "@/lib/seo"
import { renderBoldText, renderTriColorTagline } from "@/lib/text-format"
import { PageHero } from "@/components/public/page-hero"
import { Countdown } from "@/components/public/countdown"
import { EventStructuredData, BreadcrumbStructuredData } from "@/components/public/structured-data"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    page: "evenement",
    path: "/evenement",
    locale,
    defaults: {
      titleFr: "L'événement",
      titleEn: "The Event",
      descriptionFr:
        "Dates, lieu, programme et informations pratiques sur PMO Mastery — l'événement international dédié aux leaders PMO.",
      descriptionEn:
        "Dates, venue, programme and practical information about PMO Mastery — the international event for PMO leaders.",
    },
  })
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Rocket, Users, TrendingUp, Target, Award, Lightbulb, Globe,
  Network, Brain, Zap, Compass,
}

export default async function EvenementPage() {
  const locale = await getLocale()
  const dateLocale = locale === "fr" ? fr : enUS
  const event = await getActiveEvent()
  const ui = await getUiText(locale)

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <p className="text-muted-foreground">
          {ui("event.emptyState", "Événement à venir.")}
        </p>
      </div>
    )
  }

  const t = {
    heroEyebrow: ui("event.hero.eyebrow", "L'événement"),
    heroTitle: locale === "fr" ? event.titleFr : event.titleEn ?? event.titleFr,
    heroSubtitle: locale === "fr"
      ? event.subtitleFr ?? event.themeTaglineFr ?? ""
      : event.subtitleEn ?? event.themeTaglineEn ?? "",
    whyTitle: ui("common.why.titleFallback", "Pourquoi y participer ?"),
    aboutTitle: ui("common.about.titleFallback", "À propos de l'événement"),
    venueTitle: ui("event.venueTitle", "Le lieu"),
    venueAddress: ui("event.venueAddress", "Adresse"),
    venueMap: ui("event.venueMap", "Voir sur la carte"),
    countdownLabel: ui("event.countdownLabel", "L'événement commence dans"),
    editionLabel: ui("event.editionLabel", "Édition"),
    dateLabel: ui("event.dateLabel", "Dates"),
    timeLabel: ui("event.timeLabel", "Horaires"),
    cityLabel: ui("event.cityLabel", "Ville"),
    ctaProgramme: ui("event.ctaProgramme", "Voir le programme"),
    ctaRegister: ui("common.cta.register", "Je m'inscris"),
    venueLink: ui("home.venueLink", "Voir le lieu"),
  }

  const countdownLabels = {
    days: ui("countdown.days", "Jours"),
    hours: ui("countdown.hours", "Heures"),
    minutes: ui("countdown.minutes", "Minutes"),
    seconds: ui("countdown.seconds", "Secondes"),
    inProgress: ui("countdown.inProgress", "Événement en cours"),
    ended: ui("countdown.ended", "Événement terminé"),
  }

  const whySection = event.websiteSections.find((s) => s.sectionKey === "WHY_PARTICIPATE")
  const aboutSection = event.websiteSections.find((s) => s.sectionKey === "ABOUT")
  const whyBenefits = whySection?.benefits ?? []
  const aboutTitle = pick(aboutSection?.titleFr, aboutSection?.titleEn, locale) ?? t.aboutTitle
  const aboutDesc = pick(aboutSection?.descriptionFr, aboutSection?.descriptionEn, locale) ?? ""
  const aboutBg = aboutSection?.backgroundImage ?? null

  const eventDateStr = event.endDate
    ? `${format(event.startDate, "dd", { locale: dateLocale })} – ${format(event.endDate, "dd MMMM yyyy", { locale: dateLocale })}`
    : format(event.startDate, "dd MMMM yyyy", { locale: dateLocale })

  const countdownTarget = event.countdownTarget ?? event.startDate
  const breadcrumbs = [{ href: "/", label: ui("common.breadcrumb.home", "Accueil") }, { label: t.heroEyebrow }]

  return (
    <>
      <EventStructuredData
        event={event}
        locale={locale}
        url={`${(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pmomastery.tn").replace(/\/$/, "")}/evenement`}
      />
      <BreadcrumbStructuredData items={breadcrumbs} />
      <PageHero
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        breadcrumbs={breadcrumbs}
      />

      {/* Countdown + key info */}
      <section className="py-12 sm:py-16 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{t.countdownLabel}</p>
              <Countdown target={countdownTarget.toISOString()} labels={countdownLabels} variant="light" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Calendar, label: t.dateLabel, value: eventDateStr },
                { icon: Clock, label: t.timeLabel, value: event.startTime && event.endTime ? `${event.startTime} – ${event.endTime}` : (event.startTime ?? "—") },
                { icon: Building2, label: t.venueAddress, value: event.venue ?? "—" },
                { icon: MapPin, label: t.cityLabel, value: [event.city, event.country].filter(Boolean).join(", ") || "—" },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pmo-violet/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-pmo-violet" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">{item.label}</div>
                    <div className="font-medium text-sm break-words">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/programme" className="inline-flex items-center gap-2 rounded-xl bg-pmo-violet-gradient text-white px-6 py-3 font-semibold shadow-premium hover:scale-[1.02] transition-transform">
              {t.ctaProgramme}
              <ArrowRight className="w-4 h-4" />
            </Link>
            {event.registrationEnabled && (
              <Link href="/pass-duo" className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 px-6 py-3 font-semibold text-primary transition-all">
                {t.ctaRegister}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* About — matches the homepage's two-column text + event card layout */}
      {aboutSection?.isActive !== false && (
        <section className="py-20 sm:py-24 bg-background relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-start justify-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-pmo-gold/10 border border-pmo-gold/20 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-gold mb-4">
                  <Award className="w-3.5 h-3.5" />
                  {t.aboutTitle}
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold mb-5 text-balance">{aboutTitle}</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  {(aboutDesc ?? "")
                    .split("\n")
                    .filter((p) => p.trim().length > 0)
                    .map((paragraph, i) => (
                      <p key={i} className="leading-relaxed mb-4">{renderBoldText(paragraph)}</p>
                    ))}
                </div>
              </div>

              {/* Event meta card */}
              <div className="relative h-[320px]">
                <div className="absolute -inset-4 bg-gradient-to-br from-pmo-violet/20 to-pmo-gold/10 rounded-3xl blur-2xl" />
                <div className="relative h-full rounded-3xl bg-pmo-navy-gradient text-white p-8 shadow-premium-lg overflow-hidden flex flex-col justify-center">
                  {aboutBg && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={aboutBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-pmo-navy via-pmo-navy/85 to-pmo-navy/60" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-grid opacity-20" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <Calendar className="w-5 h-5 text-pmo-gold" />
                      <span className="text-sm uppercase tracking-widest text-white/60">
                        {t.editionLabel}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-1">{event.editionName}</h3>
                    <p className="text-sm font-semibold mb-6">
                      {renderTriColorTagline(pick(event.themeTaglineFr, event.themeTaglineEn, locale) ?? "")}
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-pmo-gold shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">{eventDateStr}</div>
                          {event.startTime && (
                            <div className="text-xs text-white/60">
                              {event.startTime}{event.endTime ? ` – ${event.endTime}` : ""}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-pmo-gold shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">{event.venue ?? event.city ?? ""}</div>
                          {(event.address || event.city) && (
                            <div className="text-xs text-white/60">
                              {[event.address, event.city, event.country].filter(Boolean).join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {event.mapUrl && (
                      <Link
                        href="/evenement#venue"
                        className="mt-6 inline-flex items-center gap-2 text-sm text-pmo-gold hover:underline"
                      >
                        <MapPin className="w-4 h-4" />
                        {t.venueLink}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why participate — full benefits */}
      {whySection?.isActive !== false && whyBenefits.length > 0 && (
        <section className="py-20 sm:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-pmo-violet/10 border border-pmo-violet/20 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-violet mb-4">
                <Target className="w-3.5 h-3.5" />
                {t.whyTitle}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                {pick(whySection?.titleFr, whySection?.titleEn, locale) ?? t.whyTitle}
              </h2>
              <p className="text-muted-foreground text-lg text-pretty">
                {pick(whySection?.descriptionFr, whySection?.descriptionEn, locale) ?? ""}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {whyBenefits.map((benefit) => {
                const Icon = ICONS[benefit.icon ?? ""] ?? Sparkles
                const title = pick(benefit.titleFr, benefit.titleEn, locale) ?? ""
                const desc = pick(benefit.descriptionFr, benefit.descriptionEn, locale) ?? ""
                return (
                  <div
                    key={benefit.id}
                    className="group rounded-2xl bg-card border border-border p-6 hover:shadow-premium-lg hover:border-primary/30 transition-all hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 rounded-xl bg-pmo-violet/10 flex items-center justify-center mb-4 group-hover:bg-pmo-violet-gradient group-hover:scale-105 transition-all">
                      <Icon className="w-6 h-6 text-pmo-violet group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Venue */}
      {(event.venue || event.mapUrl) && (
        <section id="venue" className="py-20 sm:py-24 bg-pmo-navy-gradient text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full bg-pmo-violet/20 blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-gold mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  {t.venueTitle}
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">{event.venue}</h2>
                {event.address && (
                  <p className="text-white/70 text-lg leading-relaxed mb-2">{event.address}</p>
                )}
                <p className="text-white/60">
                  {[event.city, event.country].filter(Boolean).join(", ")}
                </p>

                {event.mapUrl && (
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pmo-gold-gradient text-white px-6 py-3 font-semibold shadow-premium hover:scale-[1.02] transition-transform"
                  >
                    <Navigation className="w-4 h-4" />
                    {t.venueMap}
                  </a>
                )}
              </div>

              {/* Map embed */}
              {event.mapUrl && (
                <div className="rounded-3xl overflow-hidden shadow-premium-lg border-4 border-white/10">
                  <iframe
                    src={event.mapUrl.replace("/maps?", "/maps/embed?")}
                    width="100%"
                    height="360"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={event.venue ?? "Venue"}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
