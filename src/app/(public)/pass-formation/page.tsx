import { notFound } from "next/navigation"
import { getLocale, getActiveEvent } from "@/lib/site-data"
import { PageHero } from "@/components/public/page-hero"
import { PassDetail } from "@/components/public/pass-detail"

export const dynamic = "force-dynamic"

const SLUG = "pass-formation"

export default async function PassFormationPage() {
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
        title: "Pass Formation",
        subtitle: "Un jour de formation pratique pour monter en compétences sur des thématiques ciblées.",
      }
    : {
        eyebrow: "Ticket",
        title: "Training Pass",
        subtitle: "A practical training day to build skills on targeted topics.",
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
      <PassDetail pass={pass} otherPasses={otherPasses} locale={locale} theme="gold" />
    </>
  )
}
