import { getLocale, getActiveEvent, getUiText, pick } from "@/lib/site-data"
import { SiteHeader } from "@/components/public/site-header"
import { SiteFooter } from "@/components/public/site-footer"
import { OrganizationStructuredData } from "@/components/public/structured-data"
import { SocialProofPopup } from "@/components/public/social-proof-popup"
import { WhatsappButton } from "@/components/public/whatsapp-button"

export const dynamic = "force-dynamic"

/**
 * Shared layout for ALL public-facing pages.
 * Provides the header (with multi-page nav) + footer + locale bootstrap.
 * Admin pages use their own layout under /admin.
 */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const event = await getActiveEvent()
  const ui = await getUiText(locale)

  const logo = event?.heroLogo ?? null
  const registrationEnabled = event?.registrationEnabled ?? true
  const contact = event?.contactInfo ?? null
  const footerSection = event?.websiteSections.find((s) => s.sectionKey === "FOOTER")
  const footerText = locale === "en"
    ? footerSection?.descriptionEn ?? footerSection?.descriptionFr
    : footerSection?.descriptionFr
  const copyrightText = pick(footerSection?.titleFr, footerSection?.titleEn, locale)

  const popups = (event?.popups ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    photo: p.photo,
    message: pick(p.messageFr, p.messageEn, locale) ?? p.messageFr,
    ctaUrl: p.ctaUrl,
  }))

  const navLabels = {
    home: ui("nav.home", "Accueil"),
    event: ui("nav.event", "Événement"),
    eventProgramme: ui("nav.event.programme", "Programme"),
    eventPasses: ui("nav.event.passes", "Passes & Billets"),
    speakers: ui("nav.speakers", "Intervenants"),
    orgPartners: ui("nav.orgPartners", "Organisateurs & Partenaires"),
    organizers: ui("nav.organizers", "Organisateurs"),
    partners: ui("nav.partners", "Partenaires"),
    gallery: ui("nav.gallery", "Galerie"),
    contact: ui("nav.contact", "Contact"),
    register: ui("nav.cta.register", "Je m'inscris"),
  }

  const footerLabels = {
    nav: ui("footer.nav", "Navigation"),
    home: ui("common.breadcrumb.home", "Accueil"),
    event: ui("nav.event", "Événement"),
    programme: ui("nav.event.programme", "Programme"),
    passesHeading: ui("footer.passesHeading", "Pass"),
    passesLink: ui("nav.event.passes", "Passes & Billets"),
    speakers: ui("nav.speakers", "Intervenants"),
    organizers: ui("nav.organizers", "Organisateurs"),
    partners: ui("nav.partners", "Partenaires"),
    gallery: ui("nav.gallery", "Galerie"),
    contact: ui("nav.contact", "Contact"),
    followUs: ui("footer.followUs", "Suivez-nous"),
    rights: ui("footer.rights", "Tous droits réservés."),
    taglineDefault: ui("footer.taglineDefault", "Événement international pour les leaders des PMO."),
    bottomTagline: ui("footer.bottomTagline", "Conçu avec passion pour les leaders PMO"),
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <OrganizationStructuredData
        org={{
          logo,
          linkedinUrl: contact?.linkedinUrl,
          facebookUrl: contact?.facebookUrl,
          instagramUrl: contact?.instagramUrl,
          youtubeUrl: contact?.youtubeUrl,
        }}
      />
      <SiteHeader
        locale={locale}
        registrationEnabled={registrationEnabled}
        logo={logo}
        labels={navLabels}
      />
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter
        contact={contact}
        footerText={footerText}
        copyrightText={copyrightText}
        editionName={event?.editionName}
        logo={logo}
        labels={footerLabels}
      />
      <SocialProofPopup popups={popups} />
      <WhatsappButton />
    </div>
  )
}
