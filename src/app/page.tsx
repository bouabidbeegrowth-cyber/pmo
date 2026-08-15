import { db } from "@/lib/db"
import { cookies } from "next/headers"
import { Header } from "@/components/public/header"
import { Countdown } from "@/components/public/countdown"
import { SpeakerModal, useSpeakerModal } from "@/components/public/speaker-modal"
import { ContactForm } from "@/components/public/contact-form"
import { LocaleToggle } from "@/components/public/locale-toggle"
import { SpeakersSection } from "@/components/public/sections/speakers-section"
import { ProgrammeSection } from "@/components/public/sections/programme-section"
import { PassesSection } from "@/components/public/sections/passes-section"
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
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  Building2,
  Handshake,
} from "lucide-react"
import Link from "next/link"
import { formatPrice, parseFeatures } from "@/lib/utils"

export const dynamic = "force-dynamic"

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Rocket, Users, TrendingUp, Target, Award, Lightbulb, Globe,
  Network, Brain, Zap, Compass,
}

type Locale = "fr" | "en"

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const raw = cookieStore.get("pmo_locale")?.value
  if (raw === "fr" || raw === "en") return raw
  return "fr"
}

export default async function HomePage() {
  const locale = await getLocale()
  const dateLocale = locale === "fr" ? fr : enUS

  const event = await db.event.findFirst({
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
      websiteSections: { include: { benefits: { orderBy: { displayOrder: "asc" } } } },
      contactInfo: true,
    },
  })

  const t = locale === "fr"
    ? {
        heroBadge: "Événement international",
        heroCta: "Je m'inscris",
        heroCtaSecondary: "Découvrir le programme",
        whyTitle: "Pourquoi y participer ?",
        aboutTitle: "À propos de l'événement",
        speakersTitle: "Intervenants",
        speakersSubtitle: "Des experts reconnus partagent leur vision",
        programmeTitle: "Programme",
        programmeSubtitle: "2 jours intensifs d'échanges et d'apprentissage",
        passesTitle: "Choisissez votre pass",
        passesSubtitle: "Des formules adaptées à chaque besoin",
        getPass: "Obtenir ce pass",
        partnersTitle: "Partenaires",
        partnersSubtitle: "Ils soutiennent PMO Mastery",
        organizersTitle: "Organisateurs",
        contactTitle: "Contact",
        contactSubtitle: "Une question ? Écrivez-nous.",
        footerDesc: "Événement international pour les leaders des PMO",
        learnMore: "En savoir plus",
        viewAll: "Voir tous les intervenants",
        day: "Jour",
      }
    : {
        heroBadge: "International event",
        heroCta: "Register now",
        heroCtaSecondary: "View programme",
        whyTitle: "Why participate?",
        aboutTitle: "About the event",
        speakersTitle: "Speakers",
        speakersSubtitle: "Renowned experts share their vision",
        programmeTitle: "Programme",
        programmeSubtitle: "2 intensive days of exchange and learning",
        passesTitle: "Choose your pass",
        passesSubtitle: "Options for every need",
        getPass: "Get this pass",
        partnersTitle: "Partners",
        partnersSubtitle: "They support PMO Mastery",
        organizersTitle: "Organizers",
        contactTitle: "Contact",
        contactSubtitle: "A question? Write to us.",
        footerDesc: "International event for PMO leaders",
        learnMore: "Learn more",
        viewAll: "View all speakers",
        day: "Day",
      }

  const heroSection = event?.websiteSections.find((s) => s.sectionKey === "HERO")
  const whySection = event?.websiteSections.find((s) => s.sectionKey === "WHY_PARTICIPATE")
  const aboutSection = event?.websiteSections.find((s) => s.sectionKey === "ABOUT")
  const footerSection = event?.websiteSections.find((s) => s.sectionKey === "FOOTER")
  const contact = event?.contactInfo

  const heroTitle = locale === "en"
    ? heroSection?.titleEn ?? heroSection?.titleFr ?? event?.titleEn ?? event?.titleFr ?? "PMO Mastery"
    : heroSection?.titleFr ?? heroSection?.titleEn ?? event?.titleFr ?? event?.titleEn ?? "PMO Mastery"
  const heroSubtitle = locale === "en"
    ? heroSection?.subtitleEn ?? heroSection?.subtitleFr ?? event?.subtitleEn ?? event?.subtitleEn
    : heroSection?.subtitleFr ?? heroSection?.subtitleEn ?? event?.subtitleFr ?? event?.subtitleEn

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header
        locale={locale}
        registrationEnabled={event?.registrationEnabled ?? false}
        logo={event?.heroLogo}
      />

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-pmo-navy-gradient text-white pt-20">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-pmo-violet/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[40rem] h-[40rem] rounded-full bg-pmo-gold/20 blur-3xl" />
        {event?.heroImageDesktop && (
          <div className="absolute inset-0 opacity-20">
            { }
            <img
              src={event.heroImageDesktop}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs uppercase tracking-widest text-white/70 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-pmo-gold animate-pulse" />
              {event?.editionName ?? t.heroBadge}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-balance">
              {heroTitle}
            </h1>

            {event?.themeTaglineFr && (
              <p className="font-display text-lg sm:text-xl text-gradient-violet font-semibold">
                {locale === "en" ? event.themeTaglineEn ?? event.themeTaglineFr : event.themeTaglineFr}
              </p>
            )}

            {heroSubtitle && (
              <p className="text-lg text-white/70 max-w-xl leading-relaxed">
                {heroSubtitle}
              </p>
            )}

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
              {event && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pmo-gold" />
                  <span className="font-medium">
                    {format(event.startDate, "dd MMMM yyyy", { locale: dateLocale })}
                    {event.endDate && ` → ${format(event.endDate, "dd MMMM yyyy", { locale: dateLocale })}`}
                  </span>
                </div>
              )}
              {event?.venue && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-pmo-gold" />
                  <span className="font-medium">
                    {event.venue}
                    {event.city ? `, ${event.city}` : ""}
                  </span>
                </div>
              )}
            </div>

            {event?.countdownTarget && (
              <Countdown target={event.countdownTarget.toISOString()} locale={locale} />
            )}

            <div className="flex flex-wrap gap-3 pt-4">
              {event?.registrationEnabled && (
                <Link
                  href="#passes"
                  className="inline-flex items-center gap-2 rounded-xl bg-pmo-gold-gradient text-pmo-navy px-6 py-3 font-semibold shadow-premium-lg hover:scale-[1.02] transition-transform"
                >
                  {t.heroCta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <Link
                href="#programme"
                className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                {t.heroCtaSecondary}
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden lg:block relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-pmo-violet/40 to-pmo-gold/20 blur-2xl" />
              {event?.heroImageMobile || event?.heroImageDesktop ? (
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-premium-lg border border-white/10">
                  { }
                  <img
                    src={event.heroImageMobile ?? event.heroImageDesktop ?? ""}
                    alt={event.titleFr}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-premium-lg border border-white/10 bg-white/5 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-display text-7xl font-bold text-gradient-violet mb-4">
                      PMO
                    </div>
                    <div className="text-white/60 uppercase tracking-widest text-sm">
                      Mastery Summit
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WHY PARTICIPATE */}
      {whySection && (
        <section id="about" className="py-20 sm:py-28 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-dark opacity-50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-pmo-violet/10 border border-pmo-violet/20 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-violet">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.whyTitle}
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance">
                  {locale === "en" ? whySection.titleEn ?? whySection.titleFr : whySection.titleFr}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {locale === "en" ? whySection.descriptionEn ?? whySection.descriptionFr : whySection.descriptionFr}
                </p>
                {aboutSection?.backgroundImage && (
                  <div className="rounded-2xl overflow-hidden shadow-premium-lg mt-8">
                    { }
                    <img
                      src={aboutSection.backgroundImage}
                      alt=""
                      className="w-full aspect-[16/9] object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {whySection.benefits
                  .filter((b) => b.isActive)
                  .map((benefit) => {
                    const Icon = ICONS[benefit.icon ?? "Sparkles"] ?? Sparkles
                    return (
                      <div
                        key={benefit.id}
                        className="group rounded-2xl border border-border bg-card p-6 hover:shadow-premium-lg hover:border-primary/30 transition-all hover:-translate-y-1"
                      >
                        <div className="w-12 h-12 rounded-xl bg-pmo-violet-gradient flex items-center justify-center text-white mb-4 shadow-premium group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-display font-semibold text-lg mb-2">
                          {locale === "en" ? benefit.titleEn ?? benefit.titleFr : benefit.titleFr}
                        </h3>
                        {benefit.descriptionFr && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {locale === "en" ? benefit.descriptionEn ?? benefit.descriptionFr : benefit.descriptionFr}
                          </p>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SPEAKERS */}
      {event && event.speakers.length > 0 && (
        <SpeakersSection
          speakers={event.speakers}
          locale={locale}
          title={t.speakersTitle}
          subtitle={t.speakersSubtitle}
        />
      )}

      {/* PROGRAMME */}
      {event && event.programmeDays.length > 0 && (
        <ProgrammeSection
          days={event.programmeDays}
          locale={locale}
          title={t.programmeTitle}
          subtitle={t.programmeSubtitle}
          dayLabel={t.day}
        />
      )}

      {/* PASSES */}
      {event && event.passes.length > 0 && (
        <PassesSection
          passes={event.passes}
          locale={locale}
          title={t.passesTitle}
          subtitle={t.passesSubtitle}
          ctaLabel={t.getPass}
        />
      )}

      {/* ORGANIZERS */}
      {event && event.organizers.length > 0 && (
        <section id="organizers" className="py-20 sm:py-28 bg-pmo-navy-gradient text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs uppercase tracking-widest text-white/70 mb-4">
                <Building2 className="w-3.5 h-3.5" />
                {t.organizersTitle}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
                {t.organizersTitle}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {event.organizers.map((org) => (
                <div
                  key={org.id}
                  className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                      {org.logo ? (
                         
                        <img src={org.logo} alt={org.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <Building2 className="w-8 h-8 text-white/50" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-lg">{org.name}</h3>
                      {org.founderName && (
                        <p className="text-sm text-pmo-gold mt-1">{org.founderName}</p>
                      )}
                      {org.founderTitle && (
                        <p className="text-xs text-white/60">{org.founderTitle}</p>
                      )}
                    </div>
                  </div>
                  {(org.descriptionFr || org.descriptionEn) && (
                    <p className="text-sm text-white/70 leading-relaxed line-clamp-4">
                      {locale === "en" ? org.descriptionEn ?? org.descriptionFr : org.descriptionFr}
                    </p>
                  )}
                  {org.founderCredentials && (
                    <p className="text-xs text-white/50 mt-3 pt-3 border-t border-white/10">
                      {org.founderCredentials}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PARTNERS */}
      {event && event.partners.length > 0 && (
        <section id="partners" className="py-20 sm:py-28 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-pmo-violet/10 border border-pmo-violet/20 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-violet mb-4">
                <Handshake className="w-3.5 h-3.5" />
                {t.partnersTitle}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
                {t.partnersTitle}
              </h2>
              <p className="text-muted-foreground mt-3">{t.partnersSubtitle}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {event.partners.map((p) => (
                <a
                  key={p.id}
                  href={p.websiteUrl ?? "#"}
                  target={p.websiteUrl ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-border bg-card p-6 hover:shadow-premium hover:border-primary/30 transition-all flex flex-col items-center"
                >
                  <div className="aspect-[3/2] w-full flex items-center justify-center mb-3">
                    {p.logo ? (
                       
                      <img
                        src={p.logo}
                        alt={p.name}
                        className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <Handshake className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">
                    {p.name}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LOCATION + CONTACT */}
      <section id="contact" className="py-20 sm:py-28 bg-pmo-navy-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: contact info + map */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs uppercase tracking-widest text-white/70 mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  {t.contactTitle}
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
                  {t.contactSubtitle}
                </h2>
                {event?.venue && (
                  <p className="text-lg text-white/80">
                    {event.venue}
                    {event.address ? `, ${event.address}` : ""}
                    {event.city ? `, ${event.city}` : ""}
                    {event.country ? `, ${event.country}` : ""}
                  </p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {contact?.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-pmo-violet/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-pmo-gold" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-white/60 uppercase tracking-wider">Email</div>
                      <div className="text-sm font-medium truncate">{contact.email}</div>
                    </div>
                  </a>
                )}
                {contact?.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-pmo-violet/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-pmo-gold" />
                    </div>
                    <div>
                      <div className="text-xs text-white/60 uppercase tracking-wider">
                        {locale === "fr" ? "Téléphone" : "Phone"}
                      </div>
                      <div className="text-sm font-medium">{contact.phone}</div>
                    </div>
                  </a>
                )}
              </div>

              {/* Social */}
              {(contact?.linkedinUrl || contact?.facebookUrl || contact?.instagramUrl || contact?.youtubeUrl) && (
                <div className="flex gap-2">
                  {contact?.linkedinUrl && (
                    <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {contact?.facebookUrl && (
                    <a href={contact.facebookUrl} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {contact?.instagramUrl && (
                    <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {contact?.youtubeUrl && (
                    <a href={contact.youtubeUrl} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Youtube className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}

              {/* Map */}
              {contact?.mapUrl && (
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-premium-lg">
                  <iframe
                    src={contact.mapUrl}
                    width="100%"
                    height="280"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Map"
                  />
                </div>
              )}
            </div>

            {/* Right: contact form */}
            <div className="bg-white text-foreground rounded-2xl p-6 sm:p-8 shadow-premium-lg">
              <ContactForm locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-pmo-navy-gradient text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                {event?.heroLogo ? (
                   
                  <img src={event.heroLogo} alt="PMO Mastery" className="h-10" />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-pmo-violet-gradient flex items-center justify-center font-display font-bold text-white">
                    P
                  </div>
                )}
                <span className="font-display font-semibold text-lg">PMO Mastery</span>
              </div>
              <p className="text-sm text-white/60 max-w-md leading-relaxed">
                {locale === "en" ? footerSection?.descriptionEn ?? footerSection?.descriptionFr : footerSection?.descriptionFr}
              </p>
              {event?.city && (
                <p className="text-sm text-white/60 mt-3">
                  {event.city}{event.country ? `, ${event.country}` : ""}
                </p>
              )}
            </div>
            <div>
              <h4 className="font-display font-semibold mb-3 text-sm uppercase tracking-wider text-white/80">
                {locale === "fr" ? "Navigation" : "Navigation"}
              </h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="#hero" className="hover:text-white transition-colors">{locale === "fr" ? "Accueil" : "Home"}</Link></li>
                <li><Link href="#speakers" className="hover:text-white transition-colors">{locale === "fr" ? "Intervenants" : "Speakers"}</Link></li>
                <li><Link href="#programme" className="hover:text-white transition-colors">{locale === "fr" ? "Programme" : "Programme"}</Link></li>
                <li><Link href="#passes" className="hover:text-white transition-colors">{locale === "fr" ? "Passes" : "Passes"}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-3 text-sm uppercase tracking-wider text-white/80">
                {locale === "fr" ? "Contact" : "Contact"}
              </h4>
              <ul className="space-y-2 text-sm text-white/60">
                {contact?.email && <li><a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">{contact.email}</a></li>}
                {contact?.phone && <li><a href={`tel:${contact.phone}`} className="hover:text-white transition-colors">{contact.phone}</a></li>}
                {contact?.linkedinUrl && <li><a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>}
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
            <p>{locale === "en" ? footerSection?.titleEn ?? footerSection?.titleFr : footerSection?.titleFr ?? `© ${new Date().getFullYear()} PMO Mastery`}</p>
            <p>{locale === "fr" ? "Empowerment Paths · Tunisie" : "Empowerment Paths · Tunisia"}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
