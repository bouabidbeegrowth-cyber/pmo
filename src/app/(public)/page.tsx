import Link from "next/link"
import { format } from "date-fns"
import { fr, enUS } from "date-fns/locale"
import {
  Calendar,
  MapPin,
  ArrowRight,
  Users,
  Award,
  Network,
  Clock3,
  Ticket,
  Check,
  Images,
} from "lucide-react"
import type { Metadata } from "next"
import { getLocale, getActiveEvent, getHomepageGallery, getUiText, pick } from "@/lib/site-data"
import { buildPageMetadata } from "@/lib/seo"
import { renderBoldText, renderTriColorTagline } from "@/lib/text-format"
import { HeroSection } from "@/components/public/hero-section"
import { SpeakersHomePreview } from "@/components/public/speakers-home-preview"
import { ProgrammeHomePreview } from "@/components/public/programme-home-preview"
import { PassesHomePreview } from "@/components/public/passes-home-preview"
import { GalleryGrid } from "@/components/public/gallery-grid"
import { SmartMapButton } from "@/components/public/smart-map-button"
import { EventStructuredData } from "@/components/public/structured-data"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    page: "home",
    path: "",
    locale,
    absoluteTitle: true,
    defaults: {
      titleFr: "PMO Mastery — Le PMO du Futur : Stratégie, IA et Performance",
      titleEn: "PMO Mastery — International Event for PMO Leaders",
      descriptionFr:
        "Événement international pour les leaders des PMO. Deux jours intensifs au cœur des meilleures pratiques en management de projets, PMO, conduite du changement, IA et leadership.",
      descriptionEn:
        "International event for PMO leaders. Two intensive days on best practices in project management, PMO, change management, AI and leadership.",
    },
  })
}

const SESSION_TYPE_KEYS = ["KEYNOTE", "PANEL", "BREAK", "NETWORKING", "CLOSING", "WORKSHOP", "SESSION", "PMO_TALKS", "MASTERCLASS"]
const SESSION_TYPE_DEFAULTS: Record<string, string> = {
  KEYNOTE: "Keynote", PANEL: "Panel", BREAK: "Pause", NETWORKING: "Networking",
  CLOSING: "Clôture", WORKSHOP: "Atelier", SESSION: "Session", PMO_TALKS: "PMO Talks", MASTERCLASS: "Masterclass",
}

export default async function HomePage() {
  const locale = await getLocale()
  const dateLocale = locale === "fr" ? fr : enUS
  const event = await getActiveEvent()
  const ui = await getUiText(locale)
  const homepageGalleryItems = await getHomepageGallery()

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-3">
            {ui("home.emptyState.title", "Événement à venir")}
          </h1>
          <p className="text-muted-foreground">
            {ui("home.emptyState.body", "Les informations sur le prochain événement PMO Mastery seront bientôt disponibles.")}
          </p>
        </div>
      </div>
    )
  }

  const t = {
    heroBadge: ui("home.hero.badge", "Événement international"),
    heroCta: ui("common.cta.register", "Je m'inscris"),
    heroCtaSecondary: ui("home.hero.ctaSecondary", "Découvrir le programme"),
    whyTitle: ui("common.why.titleFallback", "Pourquoi y participer ?"),
    aboutTitle: ui("common.about.titleFallback", "À propos de l'événement"),
    aboutCta: ui("home.aboutCta", "En savoir plus"),
    speakersTitle: ui("home.speakers.title", "Intervenants"),
    speakersSubtitle: ui("home.speakers.subtitle", "Des experts reconnus partagent leur vision"),
    speakersCta: ui("home.speakers.cta", "Voir tous les intervenants"),
    programmeTitle: ui("home.programme.title", "Programme"),
    programmeSubtitle: ui("home.programme.subtitle", "2 jours intensifs d'échanges et d'apprentissage"),
    programmeCta: ui("home.programme.cta", "Voir le programme complet"),
    passesTitle: ui("home.passes.title", "Choisissez votre pass"),
    passesSubtitle: ui("home.passes.subtitle", "Des formules adaptées à chaque besoin"),
    passesCta: ui("home.passes.cta", "Comparer tous les passes"),
    partnersTitle: ui("home.partners.title", "Partenaires"),
    partnersSubtitle: ui("home.partners.subtitle", "Ils soutiennent PMO Mastery"),
    partnersViewAll: ui("home.partners.viewAll", "Voir tous les partenaires"),
    galleryTitle: ui("home.gallery.title", "Galerie"),
    gallerySubtitle: ui("home.gallery.subtitle", "Revivez les temps forts en images et en vidéos"),
    galleryCta: ui("home.gallery.cta", "Voir toute la galerie"),
    countdownLabel: ui("home.countdownLabel", "Plus que"),
    editionLabel: ui("home.editionLabel", "Édition"),
    venueLink: ui("home.venueLink", "Voir le lieu"),
    venueTitle: ui("event.venueTitle", "Le lieu"),
    venueAddress: ui("event.venueAddress", "Adresse"),
    venueMap: ui("event.venueMap", "Voir sur la carte"),
    statSpeakers: ui("home.stat.speakers", "Intervenants"),
    statDays: ui("home.stat.days", "Jours"),
    statPasses: ui("home.stat.passes", "Pass disponibles"),
    statPartners: ui("home.stat.partners", "Partenaires"),
  }

  const countdownLabels = {
    days: ui("countdown.days", "Jours"),
    hours: ui("countdown.hours", "Heures"),
    minutes: ui("countdown.minutes", "Minutes"),
    seconds: ui("countdown.seconds", "Secondes"),
    inProgress: ui("countdown.inProgress", "Événement en cours"),
    ended: ui("countdown.ended", "Événement terminé"),
  }

  const speakerLabels = {
    viewProfile: ui("common.speaker.viewProfile", "Voir le profil"),
    biography: ui("speakers.modal.biography", "Biographie"),
  }

  const sessionTypeLabels = Object.fromEntries(
    SESSION_TYPE_KEYS.map((k) => [k, ui(`programme.sessionType.${k}`, SESSION_TYPE_DEFAULTS[k])]),
  )

  const passLabels = {
    recommended: ui("passes.recommended", "Recommandé"),
    priceHt: ui("passes.detail.priceHt", "HT"),
    vat: ui("passes.detail.vat", "TVA"),
    ttc: ui("passes.detail.ttc", "TTC"),
    viewDetails: ui("common.cta.viewDetails", "Voir les détails"),
  }

  const heroSection = event.websiteSections.find((s) => s.sectionKey === "HERO")
  const whySection = event.websiteSections.find((s) => s.sectionKey === "WHY_PARTICIPATE")
  const aboutSection = event.websiteSections.find((s) => s.sectionKey === "ABOUT")
  const countdownSection = event.websiteSections.find((s) => s.sectionKey === "COUNTDOWN")
  const chairmanSection = event.websiteSections.find((s) => s.sectionKey === "CHAIRMAN_MESSAGE")
  const showCountdown = countdownSection?.isActive !== false

  const heroTitle = pick(heroSection?.titleFr, heroSection?.titleEn, locale) ?? pick(event.titleFr, event.titleEn, locale) ?? event.titleFr
  const heroSubtitle = pick(heroSection?.subtitleFr, heroSection?.subtitleEn, locale) ?? ""
  const heroBg = heroSection?.backgroundImage ?? event.heroImageDesktop ?? null
  const heroCtaUrl = heroSection?.ctaUrl ?? "/passes"

  const whyTitle = pick(whySection?.titleFr, whySection?.titleEn, locale) ?? t.whyTitle
  const whyDesc = pick(whySection?.descriptionFr, whySection?.descriptionEn, locale) ?? ""
  const whyBenefits = whySection?.benefits ?? []
  const whyBg = whySection?.backgroundImage ?? null

  const aboutTitle = pick(aboutSection?.titleFr, aboutSection?.titleEn, locale) ?? t.aboutTitle
  const aboutDesc = pick(aboutSection?.descriptionFr, aboutSection?.descriptionEn, locale) ?? ""
  const aboutBg = aboutSection?.backgroundImage ?? null

  const chairmanTitle = pick(chairmanSection?.titleFr, chairmanSection?.titleEn, locale) ?? ""
  const chairmanDesc = pick(chairmanSection?.descriptionFr, chairmanSection?.descriptionEn, locale) ?? ""
  const chairmanName = pick(chairmanSection?.subtitleFr, chairmanSection?.subtitleEn, locale) ?? ""
  const chairmanRole = pick(chairmanSection?.ctaTextFr, chairmanSection?.ctaTextEn, locale) ?? ""
  const chairmanPhoto = chairmanSection?.backgroundImage ?? null

  const venueAddressQuery = [event.venue, event.address, event.city, event.country].filter(Boolean).join(", ")
  const showVenue = venueAddressQuery.length > 0
  const venueLabel = event.venue || event.city || "Venue"
  const venueMapQuery = event.latitude != null && event.longitude != null
    ? `${event.latitude},${event.longitude}(${venueLabel})`
    : venueAddressQuery
  const venueMapZoom = event.latitude != null && event.longitude != null ? "&z=16" : ""

  const speakersPreview = event.speakers.slice(0, 4)
  const programmePreviewDays = event.programmeDays.slice(0, 1) // first day preview
  const featuredPasses = event.passes.slice(0, 3)
  const featuredPartners = event.partners.slice(0, 7)
  const galleryPreview = homepageGalleryItems.map((item) => ({
    id: item.id,
    type: item.type as "IMAGE" | "VIDEO",
    imageUrl: item.imageUrl,
    videoUrl: item.videoUrl,
    thumbnail: item.thumbnail,
    caption: pick(item.captionFr, item.captionEn, locale),
  }))

  const countdownTarget = event.countdownTarget ?? event.startDate
  const eventDateStr = event.endDate
    ? `${format(event.startDate, "dd", { locale: dateLocale })}–${format(event.endDate, "dd MMM yyyy", { locale: dateLocale })}`
    : format(event.startDate, "dd MMM yyyy", { locale: dateLocale })

  return (
    <>
      <EventStructuredData
        event={event}
        locale={locale}
        url={(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pmomastery.tn").replace(/\/$/, "")}
      />
      {/* ============================ HERO ============================ */}
      <HeroSection
        heroBg={heroBg}
        badgeText={`${t.heroBadge} · ${event.editionName}`}
        title={heroTitle}
        subtitle={heroSubtitle || undefined}
        ctaLabel={t.heroCta}
        ctaHref={heroCtaUrl.startsWith("#") ? "/passes" : heroCtaUrl}
        showCta={event.registrationEnabled}
        ctaSecondaryLabel={t.heroCtaSecondary}
        ctaSecondaryHref="/programme"
        showCountdown={showCountdown}
        countdownLabel={t.countdownLabel}
        countdownTarget={countdownTarget.toISOString()}
        countdownLabels={countdownLabels}
      />

      {/* ====================== WHY PARTICIPATE ====================== */}
      {whySection?.isActive !== false && whyBenefits.length > 0 && (
        <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {whyBg && (
                <div className="relative rounded-3xl overflow-hidden shadow-premium-lg aspect-[4/3] lg:order-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={whyBg} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              <div className={whyBg ? "lg:order-2" : "max-w-3xl"}>
                <p className="text-[#e5005a] font-semibold text-xs sm:text-sm uppercase tracking-[0.15em] mb-5">
                  {whyTitle}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] mb-6 text-balance">{whyTitle}</h2>
                {whyDesc && (
                  <div className="text-muted-foreground text-[15px] sm:text-base leading-[1.7] mb-8 text-pretty">
                    {whyDesc.split("\n").filter((p) => p.trim().length > 0).map((paragraph, i) => (
                      <p key={i} className="mb-3">{paragraph}</p>
                    ))}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                  {whyBenefits.map((benefit) => {
                    const title = pick(benefit.titleFr, benefit.titleEn, locale) ?? ""
                    return (
                      <div key={benefit.id} className="flex items-start gap-3">
                        <span className="hero-btn-gradient shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </span>
                        <span className="text-sm font-medium text-foreground leading-snug">{title}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================= ABOUT ========================= */}
      {aboutSection?.isActive !== false && (
        <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
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
                        href="/evenement"
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

      {/* ========================= VENUE / MAP ========================= */}
      {showVenue && (
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
                <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">{venueLabel}</h2>
                {event.address && (
                  <p className="text-white/70 text-lg leading-relaxed mb-2">{event.address}</p>
                )}
                <p className="text-white/60">
                  {[event.city, event.country].filter(Boolean).join(", ")}
                </p>

                <SmartMapButton
                  label={t.venueMap}
                  googleMapsUrl={event.mapUrl}
                  latitude={event.latitude}
                  longitude={event.longitude}
                  addressQuery={venueAddressQuery}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pmo-gold-gradient text-white px-6 py-3 font-semibold shadow-premium hover:scale-[1.02] transition-transform"
                />
              </div>

              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-br from-pmo-gold/20 to-pmo-violet/10 rounded-[2rem] blur-2xl" />
                <div className="relative rounded-3xl overflow-hidden shadow-premium-lg border-4 border-white/10">
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(venueMapQuery)}${venueMapZoom}&output=embed`}
                    width="100%"
                    height="380"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={venueLabel}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================== SPEAKERS PREVIEW ====================== */}
      {speakersPreview.length > 0 && (
        <section className="py-20 sm:py-28 bg-pmo-light-bg relative overflow-hidden">
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

            <SpeakersHomePreview speakers={event.speakers} locale={locale} labels={speakerLabels} />

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
        <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-dark opacity-40" />
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-pmo-blue/10 blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-pmo-pink/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-pmo-bright-orange/10 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-pmo-pink/10 border border-pmo-pink/20 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-pink mb-4">
                <Clock3 className="w-3.5 h-3.5" />
                {t.programmeTitle}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">{t.programmeTitle}</h2>
              <p className="text-muted-foreground text-lg">{t.programmeSubtitle}</p>
            </div>

            <ProgrammeHomePreview days={programmePreviewDays} locale={locale} sessionTypeLabels={sessionTypeLabels} />

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

            <PassesHomePreview passes={featuredPasses} locale={locale} labels={passLabels} />

            <div className="text-center mt-10">
              <Link
                href="/passes"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 px-6 py-3 font-semibold transition-all"
              >
                {t.passesCta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===================== CHAIRMAN MESSAGE ===================== */}
      {chairmanSection?.isActive !== false && chairmanDesc && (
        <section className="py-20 sm:py-28 bg-pmo-navy relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-pmo-blue/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-pmo-pink/10 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[340px_1fr] gap-10 lg:gap-16 items-center">
              {chairmanPhoto && (
                <div className="relative rounded-3xl overflow-hidden shadow-premium-lg aspect-[3/4] mx-auto w-full max-w-[340px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={chairmanPhoto} alt={chairmanName} className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                {chairmanTitle && (
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 text-balance">
                    {chairmanTitle}
                  </h2>
                )}
                <div className="text-white/75 text-[15px] sm:text-base leading-[1.8] mb-8 text-pretty">
                  {chairmanDesc.split("\n").filter((p) => p.trim().length > 0).map((paragraph, i) => (
                    <p key={i} className="mb-4">{renderBoldText(paragraph)}</p>
                  ))}
                </div>

                {(chairmanName || chairmanRole) && (
                  <div className="rounded-2xl border border-white/15 bg-white/5 px-6 py-5">
                    {chairmanName && (
                      <div className="font-display text-lg font-bold text-white">{chairmanName}</div>
                    )}
                    {chairmanRole && (
                      <div className="text-sm text-white/60 mt-1">{chairmanRole}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================== GALLERY PREVIEW ====================== */}
      {galleryPreview.length > 0 && (
        <section className="py-20 sm:py-28 bg-pmo-light-bg relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-dark opacity-50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-pmo-violet/10 border border-pmo-violet/20 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-violet mb-4">
                <Images className="w-3.5 h-3.5" />
                {t.galleryTitle}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">{t.galleryTitle}</h2>
              <p className="text-muted-foreground text-lg">{t.gallerySubtitle}</p>
            </div>

            <GalleryGrid items={galleryPreview} emptyLabel="" />

            <div className="text-center mt-10">
              <Link
                href="/galerie"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 px-6 py-3 font-semibold text-primary transition-all"
              >
                {t.galleryCta}
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
                {t.partnersViewAll}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
