import type { Metadata } from "next"
import Link from "next/link"
import { Images } from "lucide-react"
import { getLocale, getUiText, getEditionsWithGallery, pick } from "@/lib/site-data"
import { buildPageMetadata } from "@/lib/seo"
import { PageHero } from "@/components/public/page-hero"
import { GalleryGrid } from "@/components/public/gallery-grid"
import { BreadcrumbStructuredData } from "@/components/public/structured-data"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    page: "galerie",
    path: "/galerie",
    locale,
    defaults: {
      titleFr: "Galerie",
      titleEn: "Gallery",
      descriptionFr: "Photos et vidéos des éditions de PMO Mastery.",
      descriptionEn: "Photos and videos from PMO Mastery editions.",
    },
  })
}

export default async function GaleriePage({
  searchParams,
}: {
  searchParams: Promise<{ edition?: string }>
}) {
  const locale = await getLocale()
  const ui = await getUiText(locale)
  const { edition } = await searchParams

  const t = {
    eyebrow: ui("gallery.hero.eyebrow", "Souvenirs"),
    title: ui("gallery.hero.title", "Galerie"),
    subtitle: ui("gallery.hero.subtitle", "Revivez les temps forts en images et en vidéos, édition après édition."),
    emptyState: ui("gallery.emptyState", "Aucun média disponible pour cette édition."),
  }

  const editions = await getEditionsWithGallery()
  const breadcrumbs = [{ href: "/", label: ui("common.breadcrumb.home", "Accueil") }, { label: t.title }]

  if (editions.length === 0) {
    return (
      <>
        <BreadcrumbStructuredData items={breadcrumbs} />
        <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} breadcrumbs={breadcrumbs} />
        <section className="py-16 sm:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
            <Images className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{t.emptyState}</p>
          </div>
        </section>
      </>
    )
  }

  const selected = editions.find((e) => e.id === edition) ?? editions.find((e) => e.isActive) ?? editions[0]
  const items = selected.galleryItems.map((item) => ({
    id: item.id,
    type: item.type as "IMAGE" | "VIDEO",
    imageUrl: item.imageUrl,
    videoUrl: item.videoUrl,
    thumbnail: item.thumbnail,
    caption: pick(item.captionFr, item.captionEn, locale),
  }))

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbs} />
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} breadcrumbs={breadcrumbs} />

      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {editions.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {editions.map((e) => (
                <Link
                  key={e.id}
                  href={`/galerie?edition=${e.id}`}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-semibold transition-all",
                    e.id === selected.id
                      ? "bg-pmo-violet-gradient text-white shadow-premium"
                      : "bg-muted text-muted-foreground hover:bg-muted/70",
                  )}
                >
                  {e.editionName}
                </Link>
              ))}
            </div>
          )}

          <GalleryGrid items={items} emptyLabel={t.emptyState} />
        </div>
      </section>
    </>
  )
}
