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
    passEvenement: ui("passes.category.evenement", "Pass Événement"),
    passFormation: ui("passes.category.formation", "Pass Formation"),
    passDuo: ui("passes.category.duo", "Pass Duo"),
    passEtudiant: ui("passes.category.etudiant", "Pass Étudiant"),
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
    legalTitle: ui("footer.legalTitle", "Mentions légales & confidentialité"),
    ipLabel: ui("footer.ipLabel", "Propriété intellectuelle :"),
    ipText: ui("footer.ipText", "L'ensemble du contenu de ce site (textes, images, logos, marques) est la propriété exclusive d'Empowerment Paths. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable."),
    dataLabel: ui("footer.dataLabel", "Données personnelles :"),
    dataTextStart: ui("footer.dataTextStart", "Les informations collectées via ce site sont traitées par Empowerment Paths dans le but de vous informer sur l'événement PMO Mastery. Elles sont stockées de manière sécurisée et ne sont ni vendues ni partagées avec des tiers. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données en contactant"),
    dataTextMid: ui("footer.dataTextMid", " ou par téléphone au "),
    cookiesLabel: ui("footer.cookiesLabel", "Cookies & tracking :"),
    cookiesText: ui("footer.cookiesText", "Ce site utilise des cookies techniques et, le cas échéant, des pixels publicitaires pour mesurer l'efficacité des campagnes. Aucun cookie de tracking tiers n'est déposé à des fins publicitaires sans votre consentement."),
    hostingLabel: ui("footer.hostingLabel", "Hébergement :"),
    hostingTextStart: ui("footer.hostingTextStart", "Pour toute question juridique, contactez"),
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
