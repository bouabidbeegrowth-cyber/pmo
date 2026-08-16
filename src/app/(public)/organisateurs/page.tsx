import Link from "next/link"
import {
  Building2,
  Globe,
  Linkedin,
  Facebook,
  Instagram,
  Award,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { getLocale, getActiveEvent, pick } from "@/lib/site-data"
import { PageHero } from "@/components/public/page-hero"

export const dynamic = "force-dynamic"

export default async function OrganisateursPage() {
  const locale = await getLocale()
  const event = await getActiveEvent()

  const t = locale === "fr"
    ? {
        eyebrow: "L'équipe",
        title: "Organisateurs",
        subtitle: "L'équipe derrière PMO Mastery, engagée pour l'excellence du PMO en Tunisie et dans la région MENA.",
        founderTitle: "Fondatrice",
        aboutOrg: "À propos",
        credentials: "Certifications",
        website: "Site web",
      }
    : {
        eyebrow: "The team",
        title: "Organizers",
        subtitle: "The team behind PMO Mastery, committed to PMO excellence in Tunisia and the MENA region.",
        founderTitle: "Founder",
        aboutOrg: "About",
        credentials: "Credentials",
        website: "Website",
      }

  const organizers = event?.organizers ?? []

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
          {organizers.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                {locale === "fr" ? "Les organisateurs seront bientôt présentés." : "Organizers will be showcased soon."}
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {organizers.map((org) => {
                const desc = pick(org.descriptionFr, org.descriptionEn, locale) ?? ""
                return (
                  <div key={org.id} className="grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-12 items-start">
                    {/* Founder card */}
                    {org.founderName && (
                      <div className="lg:sticky lg:top-24">
                        <div className="rounded-3xl bg-pmo-navy-gradient text-white p-6 shadow-premium-lg overflow-hidden relative">
                          <div className="absolute inset-0 bg-grid opacity-20" />
                          <div className="relative">
                            <div className="flex items-center gap-2 mb-4">
                              <Sparkles className="w-4 h-4 text-pmo-gold" />
                              <span className="text-xs uppercase tracking-widest text-pmo-gold">{t.founderTitle}</span>
                            </div>
                            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white/10 shadow-premium-lg mx-auto mb-4">
                              {org.founderPhoto ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={org.founderPhoto} alt={org.founderName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-display text-3xl font-bold">
                                  {org.founderName.charAt(0)}
                                </div>
                              )}
                            </div>
                            <h3 className="font-display text-xl font-bold text-center">{org.founderName}</h3>
                            {org.founderTitle && (
                              <p className="text-sm text-pmo-gold text-center mt-1">{org.founderTitle}</p>
                            )}
                            {org.founderCredentials && (
                              <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-xs uppercase tracking-widest text-white/50 mb-2 flex items-center gap-1.5">
                                  <Award className="w-3 h-3" />
                                  {t.credentials}
                                </p>
                                <p className="text-sm text-white/80">{org.founderCredentials}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Org details */}
                    <div>
                      <div className="flex items-start gap-4 mb-6">
                        {org.logo && (
                          <div className="w-16 h-16 rounded-2xl bg-card border border-border p-2 shrink-0 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={org.logo} alt={org.name} className="max-w-full max-h-full object-contain" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="w-4 h-4 text-pmo-violet" />
                            <span className="text-xs uppercase tracking-widest text-muted-foreground">{t.aboutOrg}</span>
                          </div>
                          <h2 className="font-display text-2xl sm:text-3xl font-bold">{org.name}</h2>
                        </div>
                      </div>

                      {desc && (
                        <div className="prose prose-lg max-w-none text-muted-foreground mb-6">
                          {desc.split("\n").filter((p) => p.trim().length > 0).map((paragraph, i) => (
                            <p key={i} className="leading-relaxed mb-3">{paragraph}</p>
                          ))}
                        </div>
                      )}

                      {/* Social links */}
                      <div className="flex flex-wrap items-center gap-3 mt-6">
                        {org.websiteUrl && (
                          <a href={org.websiteUrl} target="_blank" rel="noopener noreferrer"
                             className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/30 hover:bg-primary/5 transition-colors">
                            <Globe className="w-4 h-4 text-pmo-violet" />
                            {t.website}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {org.linkedinUrl && (
                          <a href={org.linkedinUrl} target="_blank" rel="noopener noreferrer"
                             className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-colors">
                            <Linkedin className="w-4 h-4 text-pmo-violet" />
                          </a>
                        )}
                        {org.facebookUrl && (
                          <a href={org.facebookUrl} target="_blank" rel="noopener noreferrer"
                             className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-colors">
                            <Facebook className="w-4 h-4 text-pmo-violet" />
                          </a>
                        )}
                        {org.instagramUrl && (
                          <a href={org.instagramUrl} target="_blank" rel="noopener noreferrer"
                             className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-colors">
                            <Instagram className="w-4 h-4 text-pmo-violet" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* CTA to partners */}
          <div className="mt-16 pt-12 border-t border-border text-center">
            <p className="text-muted-foreground mb-4">
              {locale === "fr" ? "Découvrez aussi nos partenaires qui soutiennent l'événement." : "Also discover our partners who support the event."}
            </p>
            <Link href="/partenaires" className="inline-flex items-center gap-2 rounded-xl bg-pmo-violet-gradient text-white px-6 py-3 font-semibold shadow-premium hover:scale-[1.02] transition-transform">
              {locale === "fr" ? "Voir les partenaires" : "View partners"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
