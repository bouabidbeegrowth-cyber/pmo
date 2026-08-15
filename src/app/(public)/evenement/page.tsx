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
import { getLocale, getActiveEvent, pick } from "@/lib/site-data"
import { PageHero } from "@/components/public/page-hero"
import { Countdown } from "@/components/public/countdown"

export const dynamic = "force-dynamic"

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Rocket, Users, TrendingUp, Target, Award, Lightbulb, Globe,
  Network, Brain, Zap, Compass,
}

export default async function EvenementPage() {
  const locale = await getLocale()
  const dateLocale = locale === "fr" ? fr : enUS
  const event = await getActiveEvent()

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <p className="text-muted-foreground">
          {locale === "fr" ? "Événement à venir." : "Event coming soon."}
        </p>
      </div>
    )
  }

  const t = locale === "fr"
    ? {
        heroEyebrow: "L'événement",
        heroTitle: event.titleFr,
        heroSubtitle: event.subtitleFr ?? event.themeTaglineFr ?? "",
        whyTitle: "Pourquoi y participer ?",
        aboutTitle: "À propos de l'événement",
        venueTitle: "Le lieu",
        venueAddress: "Adresse",
        venueMap: "Voir sur la carte",
        countdownLabel: "L'événement commence dans",
        editionLabel: "Édition",
        dateLabel: "Dates",
        timeLabel: "Horaires",
        cityLabel: "Ville",
        ctaProgramme: "Voir le programme",
        ctaRegister: "Je m'inscris",
      }
    : {
        heroEyebrow: "The event",
        heroTitle: event.titleEn ?? event.titleFr,
        heroSubtitle: event.subtitleEn ?? event.themeTaglineEn ?? "",
        whyTitle: "Why participate?",
        aboutTitle: "About the event",
        venueTitle: "The venue",
        venueAddress: "Address",
        venueMap: "View on map",
        countdownLabel: "The event starts in",
        editionLabel: "Edition",
        dateLabel: "Dates",
        timeLabel: "Hours",
        cityLabel: "City",
        ctaProgramme: "View programme",
        ctaRegister: "Register now",
      }

  const whySection = event.websiteSections.find((s) => s.sectionKey === "WHY_PARTICIPATE")
  const aboutSection = event.websiteSections.find((s) => s.sectionKey === "ABOUT")
  const whyBenefits = whySection?.benefits ?? []
  const aboutDesc = pick(aboutSection?.descriptionFr, aboutSection?.descriptionEn, locale) ?? ""

  const eventDateStr = event.endDate
    ? `${format(event.startDate, "dd", { locale: dateLocale })} – ${format(event.endDate, "dd MMMM yyyy", { locale: dateLocale })}`
    : format(event.startDate, "dd MMMM yyyy", { locale: dateLocale })

  const countdownTarget = event.countdownTarget ?? event.startDate

  return (
    <>
      <PageHero
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        breadcrumbs={[{ href: "/", label: locale === "fr" ? "Accueil" : "Home" }, { label: t.heroEyebrow }]}
      />

      {/* Countdown + key info */}
      <section className="py-12 sm:py-16 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{t.countdownLabel}</p>
              <Countdown target={countdownTarget.toISOString()} locale={locale} />
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

      {/* About */}
      {aboutSection?.isActive !== false && (
        <section className="py-20 sm:py-24 bg-[#f6f7fb] relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-dark opacity-50" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-pmo-gold/10 border border-pmo-gold/20 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-gold mb-4">
                <Award className="w-3.5 h-3.5" />
                {t.aboutTitle}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold">
                {pick(aboutSection?.titleFr, aboutSection?.titleEn, locale) ?? t.aboutTitle}
              </h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground text-center">
              {(aboutDesc ?? "")
                .split("\n")
                .filter((p) => p.trim().length > 0)
                .map((paragraph, i) => (
                  <p key={i} className="leading-relaxed mb-4 text-lg">{paragraph}</p>
                ))}
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
        <section className="py-20 sm:py-24 bg-pmo-navy-gradient text-white relative overflow-hidden">
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
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pmo-gold-gradient text-pmo-navy px-6 py-3 font-semibold shadow-premium hover:scale-[1.02] transition-transform"
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
