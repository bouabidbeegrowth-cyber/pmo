import type { Metadata } from "next"
import { Check, ArrowRight, Shield, Star } from "lucide-react"
import { getLocale, getActiveEvent, getUiText, getPassesHeroImage, pick } from "@/lib/site-data"
import { buildPageMetadata } from "@/lib/seo"
import { PageHero } from "@/components/public/page-hero"
import { BreadcrumbStructuredData } from "@/components/public/structured-data"
import { cn, formatPrice, parseFeatures } from "@/lib/utils"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    page: "passes",
    path: "/passes",
    locale,
    defaults: {
      titleFr: "Passes & Billets",
      titleEn: "Passes & Tickets",
      descriptionFr: "Comparez tous les passes PMO Mastery et choisissez la formule adaptée à vos besoins.",
      descriptionEn: "Compare all PMO Mastery passes and choose the formula that fits your needs.",
    },
  })
}

export default async function PassesPage() {
  const locale = await getLocale()
  const event = await getActiveEvent()
  const ui = await getUiText(locale)
  const heroImage = await getPassesHeroImage()

  const t = {
    eyebrow: ui("passes.hero.eyebrow", "Billets"),
    title: ui("passes.hero.title", "Passes & Billets"),
    subtitle: ui("passes.hero.subtitle", "Comparez toutes les formules et choisissez celle qui vous correspond."),
    includes: ui("passes.detail.includes", "Ce pass inclut"),
    priceHt: ui("passes.detail.priceHt", "HT"),
    vat: ui("passes.detail.vat", "TVA"),
    ttc: ui("passes.detail.ttc", "TTC"),
    register: ui("common.cta.register", "Je m'inscris"),
    registrationSoon: ui("passes.detail.registrationSoon", "Inscriptions bientôt ouvertes"),
    minQty: ui("passes.detail.minQty", "Quantité minimum"),
    guarantee: ui("passes.detail.guarantee", "Paiement sécurisé"),
    perPerson: ui("passes.detail.perPerson", "/ personne"),
    recommendedBadge: ui("passes.detail.recommendedBadge", "Formule recommandée"),
    emptyState: ui("passes.emptyState", "Les pass seront bientôt disponibles."),
  }

  const breadcrumbs = [{ href: "/", label: ui("common.breadcrumb.home", "Accueil") }, { label: t.title }]
  const passes = event?.passes ?? []

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbs} />
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} breadcrumbs={breadcrumbs} backgroundImage={heroImage} />

      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {passes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">{t.emptyState}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {passes.map((pass) => {
                const name = pick(pass.nameFr, pass.nameEn, locale) ?? pass.nameFr
                const description = pick(pass.descriptionFr, pass.descriptionEn, locale)
                const features = parseFeatures(pick(pass.featuresFr, pass.featuresEn, locale))
                const priceTtc = pass.price + pass.price * pass.vatRate

                return (
                  <div
                    key={pass.id}
                    className={cn(
                      "relative rounded-3xl border-2 bg-card overflow-hidden flex flex-col",
                      pass.isFeatured
                        ? "border-pmo-gold shadow-premium-lg ring-4 ring-pmo-gold/20"
                        : "border-border shadow-premium",
                    )}
                  >
                    {pass.image && (
                      <div className="relative aspect-video w-full overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={pass.image} alt={name} className="w-full h-full object-cover" />
                        {pass.isFeatured && (
                          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-pmo-gold-gradient text-pmo-navy px-3 py-1 text-xs font-semibold shadow-premium">
                            <Star className="w-3 h-3 fill-current" />
                            {t.recommendedBadge}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-6 sm:p-8 flex flex-col flex-1">
                      {!pass.image && pass.isFeatured && (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-pmo-gold/20 bg-pmo-gold/10 text-pmo-gold px-3 py-1 text-xs font-semibold mb-4 w-fit">
                          <Star className="w-3 h-3 fill-current" />
                          {t.recommendedBadge}
                        </div>
                      )}

                      <h2 className="font-display text-2xl font-bold mb-2">{name}</h2>
                      {description && <p className="text-sm text-muted-foreground mb-5">{description}</p>}

                      <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-4xl font-bold">
                          {formatPrice(pass.price, pass.currency, locale)}
                        </span>
                        <span className="text-sm text-muted-foreground">{t.priceHt}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {Math.round(pass.vatRate * 100)}% {t.vat} · {t.ttc}:{" "}
                        <span className="font-semibold text-foreground">
                          {formatPrice(priceTtc, pass.currency, locale)}
                        </span>
                      </div>
                      {pass.minQuantity > 1 && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {t.perPerson} · {t.minQty}: {pass.minQuantity}
                        </div>
                      )}
                    </div>

                    {features.length > 0 && (
                      <ul className="space-y-2.5 mb-6 flex-1">
                        {features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="shrink-0 w-5 h-5 rounded-full bg-pmo-violet/10 text-pmo-violet flex items-center justify-center mt-0.5">
                              <Check className="w-3 h-3" />
                            </span>
                            <span className="text-sm text-foreground/80 leading-relaxed">{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {pass.paymentUrl ? (
                      <a
                        href={pass.paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex items-center justify-center gap-2 w-full rounded-xl px-6 py-3.5 font-semibold transition-all hover:scale-[1.02] shadow-premium mt-auto",
                          pass.isFeatured ? "bg-pmo-gold-gradient text-white" : "bg-pmo-violet-gradient text-white",
                        )}
                      >
                        {t.register}
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <div className="rounded-xl border border-dashed border-border px-6 py-3.5 text-center text-sm text-muted-foreground mt-auto">
                        {t.registrationSoon}
                      </div>
                    )}

                      <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
                        <Shield className="w-3 h-3" />
                        {t.guarantee}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
