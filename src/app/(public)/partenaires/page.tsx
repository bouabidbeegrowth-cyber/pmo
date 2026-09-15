import type { Metadata } from "next"
import Link from "next/link"
import { Network, Globe, ArrowRight, ExternalLink } from "lucide-react"
import { getLocale, getActiveEvent, getUiText, pick } from "@/lib/site-data"
import { buildPageMetadata } from "@/lib/seo"
import { PageHero } from "@/components/public/page-hero"
import { BreadcrumbStructuredData } from "@/components/public/structured-data"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    page: "partenaires",
    path: "/partenaires",
    locale,
    defaults: {
      titleFr: "Partenaires",
      titleEn: "Partners",
      descriptionFr:
        "Ils soutiennent PMO Mastery et accompagnent le développement de l'excellence PMO en Tunisie et dans la région.",
      descriptionEn: "They support PMO Mastery and foster the development of PMO excellence in Tunisia and the region.",
    },
  })
}

const TIER_CONFIG: { key: string; defaultLabelFr: string; defaultLabelEn: string; size: string; badge: string }[] = [
  { key: "STRATEGIC", defaultLabelFr: "Partenaires stratégiques", defaultLabelEn: "Strategic partners", size: "h-16 sm:h-20", badge: "bg-pmo-blue/10 text-pmo-blue border-pmo-blue/20" },
  { key: "DIAMOND", defaultLabelFr: "Partenaires Diamond", defaultLabelEn: "Diamond partners", size: "h-16 sm:h-20", badge: "bg-pmo-sky-blue/15 text-pmo-sky-blue border-pmo-sky-blue/25" },
  { key: "GOLD", defaultLabelFr: "Partenaires Gold", defaultLabelEn: "Gold partners", size: "h-14 sm:h-16", badge: "bg-pmo-pink/10 text-pmo-pink border-pmo-pink/20" },
  { key: "SILVER", defaultLabelFr: "Partenaires Silver", defaultLabelEn: "Silver partners", size: "h-12 sm:h-14", badge: "bg-pmo-text-navy/10 text-pmo-text-navy border-pmo-text-navy/20" },
  { key: "BRONZE", defaultLabelFr: "Partenaires Bronze", defaultLabelEn: "Bronze partners", size: "h-10 sm:h-12", badge: "bg-pmo-navy-deep/10 text-pmo-navy-deep border-pmo-navy-deep/20" },
  { key: "MEDIA", defaultLabelFr: "Partenaires média", defaultLabelEn: "Media partners", size: "h-12 sm:h-14", badge: "bg-pmo-bright-orange/10 text-pmo-bright-orange border-pmo-bright-orange/20" },
  { key: "INSTITUTIONAL", defaultLabelFr: "Partenaires institutionnels", defaultLabelEn: "Institutional partners", size: "h-12 sm:h-14", badge: "bg-pmo-blue/10 text-pmo-blue border-pmo-blue/20" },
  { key: "PARTNER", defaultLabelFr: "Partenaires", defaultLabelEn: "Partners", size: "h-12 sm:h-14", badge: "bg-muted text-muted-foreground border-border" },
]

export default async function PartenairesPage() {
  const locale = await getLocale()
  const event = await getActiveEvent()
  const ui = await getUiText(locale)

  const t = {
    eyebrow: ui("partners.hero.eyebrow", "Sponsors"),
    title: ui("partners.hero.title", "Partenaires"),
    subtitle: ui("partners.hero.subtitle", "Ils soutiennent PMO Mastery et accompagnent le développement de l'excellence PMO en Tunisie et dans la région."),
    visitSite: ui("partners.visitSite", "Visiter le site"),
    becomePartner: ui("partners.becomePartner", "Devenir partenaire"),
    becomePartnerDesc: ui("partners.becomePartnerDesc", "Vous souhaitez associer votre marque à PMO Mastery ? Contactez notre équipe pour découvrir nos offres de partenariat."),
    contactUs: ui("partners.contactUs", "Nous contacter"),
    emptyState: ui("partners.emptyState", "Les partenaires seront bientôt annoncés."),
    countSuffix: ui("partners.countSuffix", "partenaire(s)"),
  }

  const partners = event?.partners ?? []
  const tiers = TIER_CONFIG.map((tier) => ({
    ...tier,
    label: ui(`partners.tier.${tier.key}`, locale === "en" ? tier.defaultLabelEn : tier.defaultLabelFr),
  }))
  const tiersPresent = tiers.filter((tier) => partners.some((p) => p.category === tier.key))
  const breadcrumbs = [{ href: "/", label: ui("common.breadcrumb.home", "Accueil") }, { label: t.title }]

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbs} />
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {partners.length === 0 ? (
            <div className="text-center py-16">
              <Network className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">{t.emptyState}</p>
            </div>
          ) : (
            <div className="space-y-12">
              {tiersPresent.map((tier) => {
                const tierPartners = partners.filter((p) => p.category === tier.key)
                return (
                  <div key={tier.key}>
                    <div className="flex items-center gap-3 mb-6">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${tier.badge}`}>
                        {tier.label}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {tierPartners.length} {t.countSuffix}
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {tierPartners.map((p) => {
                        const desc = pick(p.descriptionFr, p.descriptionEn, locale)
                        return (
                          <div
                            key={p.id}
                            className="group rounded-2xl border border-border bg-card p-6 hover:shadow-premium hover:border-primary/30 transition-all"
                          >
                            <div className="flex items-center gap-4 mb-4">
                              {p.logo ? (
                                <div className="h-14 w-14 shrink-0 rounded-xl bg-background border border-border p-2 flex items-center justify-center">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={p.logo} alt={p.name} className="max-w-full max-h-full object-contain" />
                                </div>
                              ) : (
                                <div className="h-14 w-14 shrink-0 rounded-xl bg-pmo-violet-gradient flex items-center justify-center text-white font-display font-bold">
                                  {p.name.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <h3 className="font-display font-semibold text-base leading-tight">{p.name}</h3>
                                {p.websiteUrl && (
                                  <a
                                    href={p.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-pmo-violet hover:underline flex items-center gap-1 mt-1"
                                  >
                                    <Globe className="w-3 h-3" />
                                    {t.visitSite}
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                            {desc && (
                              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{desc}</p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Become a partner CTA */}
          <div className="mt-16 pt-12 border-t border-border">
            <div className="rounded-3xl bg-pmo-navy-gradient text-white p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="absolute -top-24 right-1/4 w-72 h-72 rounded-full bg-pmo-gold/10 blur-3xl" />
              <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-center">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">{t.becomePartner}</h2>
                  <p className="text-white/70 text-lg max-w-2xl">{t.becomePartnerDesc}</p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-pmo-gold-gradient text-white px-6 py-3 font-semibold shadow-premium hover:scale-[1.02] transition-transform whitespace-nowrap"
                >
                  {t.contactUs}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
