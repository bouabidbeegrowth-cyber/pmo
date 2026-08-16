import { notFound } from "next/navigation"
import { getLocale, getActiveEvent, pick } from "@/lib/site-data"
import { PageHero } from "@/components/public/page-hero"
import { PassDetail } from "@/components/public/pass-detail"

export const dynamic = "force-dynamic"

const SLUG = "pass-evenement"

export default async function PassEvenementPage() {
  const locale = await getLocale()
  const event = await getActiveEvent()

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

  const t = locale === "fr"
    ? {
        eyebrow: "Billet",
        title: "Pass Événement",
        subtitle: "L'accès complet aux deux jours de conférence, keynotes et panels.",
      }
    : {
        eyebrow: "Ticket",
        title: "Event Pass",
        subtitle: "Full access to both conference days, keynotes and panels.",
      }

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
        breadcrumbs={[
          { href: "/", label: locale === "fr" ? "Accueil" : "Home" },
          { href: "/evenement", label: locale === "fr" ? "Événement" : "Event" },
          { label: t.title },
        ]}
      />
      <PassDetail pass={pass} otherPasses={otherPasses} locale={locale} theme="violet" />
    </>
  )
}
