import type { Metadata } from "next"
import { Users } from "lucide-react"
import { getLocale, getActiveEvent, getUiText } from "@/lib/site-data"
import { buildPageMetadata } from "@/lib/seo"
import { PageHero } from "@/components/public/page-hero"
import { SpeakersGrid } from "@/components/public/speakers-grid"
import { BreadcrumbStructuredData } from "@/components/public/structured-data"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    page: "intervenants",
    path: "/intervenants",
    locale,
    defaults: {
      titleFr: "Intervenants",
      titleEn: "Speakers",
      descriptionFr:
        "Des experts reconnus, des leaders inspirants et des praticiens de renom partagent leur vision du PMO du futur.",
      descriptionEn:
        "Recognized experts, inspiring leaders and renowned practitioners share their vision of the PMO of the future.",
    },
  })
}

export default async function IntervenantsPage() {
  const locale = await getLocale()
  const event = await getActiveEvent()
  const ui = await getUiText(locale)

  const t = {
    eyebrow: ui("speakers.hero.eyebrow", "Speakers"),
    title: ui("speakers.hero.title", "Intervenants"),
    subtitle: ui("speakers.hero.subtitle", "Des experts reconnus, des leaders inspirants et des praticiens de renom partagent leur vision du PMO du futur."),
    statSpeakers: ui("speakers.stat.speakers", "intervenants"),
    statFeatured: ui("speakers.stat.featured", "en vedette"),
    emptyState: ui("speakers.emptyState", "Les intervenants seront bientôt annoncés."),
  }

  const gridLabels = {
    searchPlaceholder: ui("speakers.search.placeholder", "Rechercher un intervenant…"),
    filterAll: ui("speakers.filter.all", "Tous"),
    filterFeatured: ui("speakers.filter.featured", "Vedettes"),
    noResults: ui("speakers.noResults", "Aucun intervenant trouvé."),
    badgeFeatured: ui("speakers.badge.featured", "Vedette"),
    viewProfile: ui("common.speaker.viewProfile", "Voir le profil"),
    biography: ui("speakers.modal.biography", "Biographie"),
    featuredBadge: ui("speakers.modal.featuredBadge", "Speaker vedette"),
  }

  const speakers = event?.speakers ?? []
  const featuredCount = speakers.filter((s) => s.isFeatured).length
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

      {/* Stats bar */}
      <section className="py-6 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-pmo-violet" />
            <span className="font-medium">{speakers.length} {t.statSpeakers}</span>
          </div>
          {featuredCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pmo-gold" />
              <span className="text-muted-foreground">{featuredCount} {t.statFeatured}</span>
            </div>
          )}
        </div>
      </section>

      {speakers.length > 0 ? (
        <SpeakersGrid speakers={speakers} locale={locale} labels={gridLabels} />
      ) : (
        <div className="py-24 text-center">
          <p className="text-muted-foreground">{t.emptyState}</p>
        </div>
      )}
    </>
  )
}
