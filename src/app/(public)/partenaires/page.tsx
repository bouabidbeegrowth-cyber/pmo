import Link from "next/link"
import { Network, Globe, ArrowRight, ExternalLink } from "lucide-react"
import { getLocale, getActiveEvent, pick } from "@/lib/site-data"
import { PageHero } from "@/components/public/page-hero"

export const dynamic = "force-dynamic"

const TIER_CONFIG: { key: string; labelFr: string; labelEn: string; size: string; badge: string }[] = [
  { key: "STRATEGIC", labelFr: "Partenaires stratégiques", labelEn: "Strategic partners", size: "h-16 sm:h-20", badge: "bg-pmo-violet/10 text-pmo-violet border-pmo-violet/20" },
  { key: "DIAMOND", labelFr: "Partenaires Diamond", labelEn: "Diamond partners", size: "h-16 sm:h-20", badge: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  { key: "GOLD", labelFr: "Partenaires Gold", labelEn: "Gold partners", size: "h-14 sm:h-16", badge: "bg-pmo-gold/10 text-pmo-gold border-pmo-gold/20" },
  { key: "SILVER", labelFr: "Partenaires Silver", labelEn: "Silver partners", size: "h-12 sm:h-14", badge: "bg-zinc-100 text-zinc-600 border-zinc-200" },
  { key: "MEDIA", labelFr: "Partenaires média", labelEn: "Media partners", size: "h-12 sm:h-14", badge: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { key: "INSTITUTIONAL", labelFr: "Partenaires institutionnels", labelEn: "Institutional partners", size: "h-12 sm:h-14", badge: "bg-blue-100 text-blue-700 border-blue-200" },
  { key: "PARTNER", labelFr: "Partenaires", labelEn: "Partners", size: "h-12 sm:h-14", badge: "bg-muted text-muted-foreground border-border" },
]

export default async function PartenairesPage() {
  const locale = await getLocale()
  const event = await getActiveEvent()

  const t = locale === "fr"
    ? {
        eyebrow: "Sponsors",
        title: "Partenaires",
        subtitle: "Ils soutiennent PMO Mastery et accompagnent le développement de l'excellence PMO en Tunisie et dans la région.",
        visitSite: "Visiter le site",
        becomePartner: "Devenir partenaire",
        becomePartnerDesc: "Vous souhaitez associer votre marque à PMO Mastery ? Contactez notre équipe pour découvrir nos offres de partenariat.",
        contactUs: "Nous contacter",
      }
    : {
        eyebrow: "Sponsors",
        title: "Partners",
        subtitle: "They support PMO Mastery and foster the development of PMO excellence in Tunisia and the region.",
        visitSite: "Visit website",
        becomePartner: "Become a partner",
        becomePartnerDesc: "Want to associate your brand with PMO Mastery? Contact our team to discover our partnership offers.",
        contactUs: "Contact us",
      }

  const partners = event?.partners ?? []
  const tiersPresent = TIER_CONFIG.filter((tier) =>
    partners.some((p) => p.category === tier.key),
  )

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
        breadcrumbs={[{ href: "/", label: locale === "fr" ? "Accueil" : "Home" }, { label: t.title }]}
      />

      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {partners.length === 0 ? (
            <div className="text-center py-16">
              <Network className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {locale === "fr" ? "Les partenaires seront bientôt annoncés." : "Partners will be announced soon."}
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {tiersPresent.map((tier) => {
                const tierPartners = partners.filter((p) => p.category === tier.key)
                const tierLabel = locale === "en" ? tier.labelEn : tier.labelFr
                return (
                  <div key={tier.key}>
                    <div className="flex items-center gap-3 mb-6">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${tier.badge}`}>
                        {tierLabel}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {tierPartners.length} {locale === "fr" ? "partenaire(s)" : "partner(s)"}
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
                  className="inline-flex items-center gap-2 rounded-xl bg-pmo-gold-gradient text-pmo-navy px-6 py-3 font-semibold shadow-premium hover:scale-[1.02] transition-transform whitespace-nowrap"
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
