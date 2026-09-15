import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocale, getActiveEvent, getUiText } from "@/lib/site-data"
import { buildPageMetadata } from "@/lib/seo"
import { PageHero } from "@/components/public/page-hero"
import { PassDetail } from "@/components/public/pass-detail"
import { BreadcrumbStructuredData } from "@/components/public/structured-data"

export const dynamic = "force-dynamic"

const SLUG = "pass-evenement"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    page: "pass-evenement",
    path: "/pass-evenement",
    locale,
    defaults: {
      titleFr: "Pass Événement",
      titleEn: "Event Pass",
      descriptionFr: "L'accès complet aux deux jours de conférence, keynotes et panels.",
      descriptionEn: "Full access to both conference days, keynotes and panels.",
    },
  })
}

export default async function PassEvenementPage() {
  const locale = await getLocale()
  const event = await getActiveEvent()
  const ui = await getUiText(locale)

  if (!event) return notFound()

  const pass = event.passes.find((p) => p.slug === SLUG)
  if (!pass) return notFound()

  const otherPasses = event.passes
    .filter((p) => p.slug !== SLUG)
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      nameFr: p.nameFr,
      nameEn: p.nameEn,
      price: p.price,
      currency: p.currency,
      isFeatured: p.isFeatured,
    }))

  const t = {
    eyebrow: ui("passes.evenement.eyebrow", "Billet"),
    title: ui("passes.evenement.title", "Pass Événement"),
    subtitle: ui("passes.evenement.subtitle", "L'accès complet aux deux jours de conférence, keynotes et panels."),
  }

  const detailLabels = {
    includes: ui("passes.detail.includes", "Ce pass inclut"),
    priceHt: ui("passes.detail.priceHt", "HT"),
    vat: ui("passes.detail.vat", "TVA"),
    ttc: ui("passes.detail.ttc", "TTC"),
    register: ui("common.cta.register", "Je m'inscris"),
    registrationSoon: ui("passes.detail.registrationSoon", "Inscriptions bientôt ouvertes"),
    minQty: ui("passes.detail.minQty", "Quantité minimum"),
    otherPasses: ui("passes.detail.otherPasses", "Autres passes"),
    guarantee: ui("passes.detail.guarantee", "Paiement sécurisé"),
    backToPasses: ui("passes.detail.backToPasses", "Voir tous les passes"),
    perPerson: ui("passes.detail.perPerson", "/ personne"),
    recommendedBadge: ui("passes.detail.recommendedBadge", "Formule recommandée"),
    priceLabel: ui("passes.detail.priceLabel", "Tarif"),
    access2days: ui("passes.detail.access2days", "Accès 2 jours"),
    networkingIncluded: ui("passes.detail.networkingIncluded", "Networking inclus"),
    viewDetails: ui("common.cta.viewDetails", "Voir les détails"),
  }

  const breadcrumbs = [
    { href: "/", label: ui("common.breadcrumb.home", "Accueil") },
    { href: "/evenement", label: ui("common.breadcrumb.event", "Événement") },
    { label: t.title },
  ]

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbs} />
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
        breadcrumbs={breadcrumbs}
      />
      <PassDetail pass={pass} otherPasses={otherPasses} locale={locale} theme="violet" labels={detailLabels} />
    </>
  )
}
