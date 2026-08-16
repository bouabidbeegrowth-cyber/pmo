import Link from "next/link"
import { format } from "date-fns"
import { fr, enUS } from "date-fns/locale"
import {
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  Rocket,
  Users,
  TrendingUp,
  Target,
  Award,
  Lightbulb,
  Globe,
  Network,
  Brain,
  Zap,
  Compass,
  Clock3,
  Ticket,
} from "lucide-react"
import { getLocale, getActiveEvent, pick } from "@/lib/site-data"
import { Countdown } from "@/components/public/countdown"
import { SpeakersHomePreview } from "@/components/public/speakers-home-preview"
import { ProgrammeHomePreview } from "@/components/public/programme-home-preview"
import { PassesHomePreview } from "@/components/public/passes-home-preview"

export const dynamic = "force-dynamic"

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Rocket, Users, TrendingUp, Target, Award, Lightbulb, Globe,
  Network, Brain, Zap, Compass,
}

export default async function HomePage() {
  const locale = await getLocale()
  const dateLocale = locale === "fr" ? fr : enUS
  const event = await getActiveEvent()

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-3">
            {locale === "fr" ? "Événement à venir" : "Event coming soon"}
          </h1>
          <p className="text-muted-foreground">
            {locale === "fr"
              ? "Les informations sur le prochain événement PMO Mastery seront bientôt disponibles."
              : "Information about the next PMO Mastery event will be available soon."}
          </p>
        </div>
      </div>
    )
  }

  const t = locale === "fr"
    ? {
        heroBadge: "Événement international",
        heroCta: "Je m'inscris",
        heroCtaSecondary: "Découvrir le programme",
        whyTitle: "Pourquoi y participer ?",
        aboutTitle: "À propos de l'événement",
        aboutCta: "En savoir plus",
        speakersTitle: "Intervenants",
        speakersSubtitle: "Des experts reconnus partagent leur vision",
        speakersCta: "Voir tous les intervenants",
        programmeTitle: "Programme",
        programmeSubtitle: "2 jours intensifs d'échanges et d'apprentissage",
        programmeCta: "Voir le programme complet",
        passesTitle: "Choisissez votre pass",
        passesSubtitle: "Des formules adaptées à chaque besoin",
        passesCta: "Comparer tous les passes",
        partnersTitle: "Partenaires",
        partnersSubtitle: "Ils soutiennent PMO Mastery",
        countdownLabel: "Plus que",
        editionLabel: "Édition",
      }
    : {
        heroBadge: "International event",
        heroCta: "Register now",
        heroCtaSecondary: "View programme",
        whyTitle: "Why participate?",
        aboutTitle: "About the event",
        aboutCta: "Learn more",
        speakersTitle: "Speakers",
        speakersSubtitle: "Renowned experts share their vision",
        speakersCta: "View all speakers",
        programmeTitle: "Programme",
        programmeSubtitle: "2 intensive days of exchange and learning",
        programmeCta: "View full programme",
        passesTitle: "Choose your pass",
        passesSubtitle: "Options for every need",
        passesCta: "Compare all passes",
        partnersTitle: "Partners",
        partnersSubtitle: "They support PMO Mastery",
        countdownLabel: "Only",
        editionLabel: "Edition",
      }

  const heroSection = event.websiteSections.find((s) => s.sectionKey === "HERO")
  const whySection = event.websiteSections.find((s) => s.sectionKey === "WHY_PARTICIPATE")
  const aboutSection = event.websiteSections.find((s) => s.sectionKey === "ABOUT")

  const heroTitle = pick(heroSection?.titleFr, heroSection?.titleEn, locale) ?? event.titleFr
  const heroSubtitle = pick(heroSection?.subtitleFr, heroSection?.subtitleEn, locale) ?? ""
  const heroDescription = pick(heroSection?.descriptionFr, heroSection?.descriptionEn, locale) ?? ""
  const heroBg = heroSection?.backgroundImage ?? event.heroImageDesktop ?? null
  const heroCtaUrl = heroSection?.ctaUrl ?? "/pass-duo"

  const whyTitle = pick(whySection?.titleFr, whySection?.titleEn, locale) ?? t.whyTitle
  const whyDesc = pick(whySection?.descriptionFr, whySection?.descriptionEn, locale) ?? ""
  const whyBenefits = whySection?.benefits ?? []

  const aboutTitle = pick(aboutSection?.titleFr, aboutSection?.titleEn, locale) ?? t.aboutTitle
  const aboutDesc = pick(aboutSection?.descriptionFr, aboutSection?.descriptionEn, locale) ?? ""

  const featuredSpeakers = event.speakers.filter((s) => s.isFeatured).slice(0, 4)
  const speakersPreview = featuredSpeakers.length > 0 ? featuredSpeakers : event.speakers.slice(0, 4)
  const programmePreviewDays = event.programmeDays.slice(0, 1) // first day preview
  const featuredPasses = event.passes.slice(0, 3)
  const featuredPartners = event.partners.slice(0, 7)

  const countdownTarget = event.countdownTarget ?? event.startDate
  const eventDateStr = event.endDate
    ? `${format(event.startDate, "dd", { locale: dateLocale })}–${format(event.endDate, "dd MMM yyyy", { locale: dateLocale })}`
    : format(event.startDate, "dd MMM yyyy", { locale: dateLocale })

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section id="hero" className="relative min-h-screen flex items-center bg-pmo-navy-gradient text-white overflow-hidden">
        {/* Background image */}
        {heroBg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] rounded-full bg-pmo-violet/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-[400px] h-[400px] rounded-full bg-pmo-gold/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-gold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              {t.heroBadge} · {event.editionName}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-balance">
              {heroTitle}
            </h1>

            {heroSubtitle && (
              <p className="text-lg sm:text-xl text-pmo-gold font-medium mt-4 flex items-center gap-2 flex-wrap">
                <Calendar className="w-5 h-5" />
                {heroSubtitle}
                {event.venue && (
                  <>
                    <span className="text-white/40">·</span>
                    <MapPin className="w-5 h-5" />
                    {event.venue}, {event.city}
                  </>
                )}
              </p>
            )}

            {heroDescription && (
              <p className="text-white/70 text-lg mt-6 max-w-2xl text-pretty leading-relaxed">
                {heroDescription}
              </p>
            )}

            {/* Countdown */}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-white/50 mb-3">{t.countdownLabel}</p>
              <Countdown target={countdownTarget.toISOString()} locale={locale} />
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {event.registrationEnabled && (
                <Link
                  href={heroCtaUrl.startsWith("#") ? "/pass-duo" : heroCtaUrl}
                  className="inline-flex items-center gap-2 rounded-xl bg-pmo-gold-gradient text-pmo-navy px-6 py-3 font-semibold shadow-premium hover:scale-[1.02] transition-transform"
                >
                  {t.heroCta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <Link
                href="/programme"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm text-white px-6 py-3 font-semibold hover:bg-white/10 transition-colors"
              >
                {t.heroCtaSecondary}
              </Link>
            </div>

            {/* Quick stats */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              {[
                { icon: Users, value: `${event.speakers.length}+`, label: locale === "fr" ? "Intervenants" : "Speakers" },
                { icon: Calendar, value: `${event.programmeDays.length}`, label: locale === "fr" ? "Jours" : "Days" },
                { icon: Ticket, value: `${event.passes.length}`, label: locale === "fr" ? "Pass disponibles" : "Passes" },
                { icon: Network, value: `${event.partners.length}`, label: locale === "fr" ? "Partenaires" : "Partners" },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm p-3">
                  <stat.icon className="w-4 h-4 text-pmo-gold mb-1.5" />
                  <div className="font-display text-xl font-bold">{stat.value}</div>
                  <div className="text-[11px] text-white/60 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================== WHY PARTICIPATE ====================== */}
      {whySection?.isActive !== false && whyBenefits.length > 0 && (
        <section className="py-20 sm:py-28 bg-[#f6f7fb] relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-dark opacity-50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-pmo-violet/10 border border-pmo-violet/20 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-violet mb-4">
                <Target className="w-3.5 h-3.5" />
                {t.whyTitle}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{whyTitle}</h2>
              {whyDesc && (
                <p className="text-muted-foreground text-lg text-pretty">{whyDesc}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {whyBenefits.map((benefit) => {
                const Icon = ICONS[benefit.icon ?? ""] ?? Sparkles
                const title = pick(benefit.titleFr, benefit.titleEn, locale) ?? ""
                const desc = pick(benefit.descriptionFr, benefit.descriptionEn, locale) ?? ""
                return (
                  <div
                    key={benefit.id}
                    className="group rounded-2xl bg-white border border-border p-6 hover:shadow-premium-lg hover:border-primary/30 transition-all hover:-translate-y-1"
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

      {/* ========================= ABOUT ========================= */}
      {aboutSection?.isActive !== false && (
        <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
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
                      <p key={i} className="leading-relaxed mb-4">{paragraph}</p>
                    ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/evenement"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 px-5 py-2.5 font-semibold text-primary transition-all"
                  >
                    {t.aboutCta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Event meta card */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-pmo-violet/20 to-pmo-gold/10 rounded-3xl blur-2xl" />
                <div className="relative rounded-3xl bg-pmo-navy-gradient text-white p-8 shadow-premium-lg overflow-hidden">
                  <div className="absolute inset-0 bg-grid opacity-20" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <Calendar className="w-5 h-5 text-pmo-gold" />
                      <span className="text-sm uppercase tracking-widest text-white/60">
                        {t.editionLabel}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-1">{event.editionName}</h3>
                    <p className="text-pmo-gold text-sm mb-6">
                      {pick(event.themeTaglineFr, event.themeTaglineEn, locale)}
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
                        href="/evenement"
                        className="mt-6 inline-flex items-center gap-2 text-sm text-pmo-gold hover:underline"
                      >
                        <MapPin className="w-4 h-4" />
                        {locale === "fr" ? "Voir le lieu" : "View venue"}
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

      {/* ====================== SPEAKERS PREVIEW ====================== */}
      {speakersPreview.length > 0 && (
        <section className="py-20 sm:py-28 bg-[#f6f7fb] relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-dark opacity-50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-pmo-violet/10 border border-pmo-violet/20 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-violet mb-4">
                <Users className="w-3.5 h-3.5" />
                {t.speakersTitle}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">{t.speakersTitle}</h2>
              <p className="text-muted-foreground text-lg">{t.speakersSubtitle}</p>
            </div>

            <SpeakersHomePreview speakers={event.speakers} locale={locale} />

            <div className="text-center mt-10">
              <Link
                href="/intervenants"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 px-6 py-3 font-semibold text-primary transition-all"
              >
                {t.speakersCta} ({event.speakers.length})
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ====================== PROGRAMME PREVIEW ====================== */}
      {event.programmeDays.length > 0 && (
        <section className="py-20 sm:py-28 bg-background relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-pmo-violet/10 border border-pmo-violet/20 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-violet mb-4">
                <Clock3 className="w-3.5 h-3.5" />
                {t.programmeTitle}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">{t.programmeTitle}</h2>
              <p className="text-muted-foreground text-lg">{t.programmeSubtitle}</p>
            </div>

            <ProgrammeHomePreview days={programmePreviewDays} locale={locale} />

            <div className="text-center mt-10">
              <Link
                href="/programme"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 px-6 py-3 font-semibold text-primary transition-all"
              >
                {t.programmeCta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ====================== PASSES PREVIEW ====================== */}
      {featuredPasses.length > 0 && (
        <section className="py-20 sm:py-28 bg-pmo-navy-gradient text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full bg-pmo-violet/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-pmo-gold/10 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs uppercase tracking-widest text-white/70 mb-4">
                <Ticket className="w-3.5 h-3.5" />
                {t.passesTitle}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">{t.passesTitle}</h2>
              <p className="text-white/70 text-lg">{t.passesSubtitle}</p>
            </div>

            <PassesHomePreview passes={featuredPasses} locale={locale} />

            <div className="text-center mt-10">
              <Link
                href="/pass-duo"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 px-6 py-3 font-semibold transition-all"
              >
                {t.passesCta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ====================== PARTNERS PREVIEW ====================== */}
      {featuredPartners.length > 0 && (
        <section className="py-16 sm:py-20 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-pmo-gold/10 border border-pmo-gold/20 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-gold mb-4">
                <Network className="w-3.5 h-3.5" />
                {t.partnersTitle}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold">{t.partnersTitle}</h2>
              <p className="text-muted-foreground mt-2">{t.partnersSubtitle}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {featuredPartners.map((p) => (
                <a
                  key={p.id}
                  href={p.websiteUrl ?? "#"}
                  target={p.websiteUrl ? "_blank" : undefined}
                  rel={p.websiteUrl ? "noopener noreferrer" : undefined}
                  className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all hover:scale-105"
                  title={p.name}
                >
                  {p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logo} alt={p.name} className="h-12 sm:h-14 w-auto object-contain" />
                  ) : (
                    <span className="font-display font-semibold text-lg text-foreground/70">{p.name}</span>
                  )}
                </a>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/partenaires"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                {locale === "fr" ? "Voir tous les partenaires" : "View all partners"}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
