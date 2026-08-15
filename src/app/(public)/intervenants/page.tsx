import { Users, ArrowRight } from "lucide-react"
import { getLocale, getActiveEvent } from "@/lib/site-data"
import { PageHero } from "@/components/public/page-hero"
import { SpeakersGrid } from "@/components/public/speakers-grid"

export const dynamic = "force-dynamic"

export default async function IntervenantsPage() {
  const locale = await getLocale()
  const event = await getActiveEvent()

  const t = locale === "fr"
    ? {
        eyebrow: "Speakers",
        title: "Intervenants",
        subtitle: "Des experts reconnus, des leaders inspirants et des praticiens de renom partagent leur vision du PMO du futur.",
      }
    : {
        eyebrow: "Speakers",
        title: "Speakers",
        subtitle: "Recognized experts, inspiring leaders and renowned practitioners share their vision of the PMO of the future.",
      }

  const speakers = event?.speakers ?? []
  const featuredCount = speakers.filter((s) => s.isFeatured).length

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
        breadcrumbs={[{ href: "/", label: locale === "fr" ? "Accueil" : "Home" }, { label: t.title }]}
      />

      {/* Stats bar */}
      <section className="py-6 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-pmo-violet" />
            <span className="font-medium">{speakers.length} {locale === "fr" ? "intervenants" : "speakers"}</span>
          </div>
          {featuredCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pmo-gold" />
              <span className="text-muted-foreground">{featuredCount} {locale === "fr" ? "en vedette" : "featured"}</span>
            </div>
          )}
        </div>
      </section>

      {speakers.length > 0 ? (
        <SpeakersGrid speakers={speakers} locale={locale} />
      ) : (
        <div className="py-24 text-center">
          <p className="text-muted-foreground">
            {locale === "fr" ? "Les intervenants seront bientôt annoncés." : "Speakers will be announced soon."}
          </p>
        </div>
      )}
    </>
  )
}
