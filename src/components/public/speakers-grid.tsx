"use client"

import { useState, useMemo } from "react"
import { ArrowRight, Search, Star } from "lucide-react"
import { SpeakerModal } from "@/components/public/speaker-modal"
import { Input } from "@/components/ui/input"
import type { Locale } from "@/lib/site-data"

interface Speaker {
  id: string
  firstName: string
  lastName: string
  photo?: string | null
  positionFr?: string | null
  positionEn?: string | null
  company?: string | null
  biographyFr?: string | null
  biographyEn?: string | null
  country?: string | null
  linkedinUrl?: string | null
  websiteUrl?: string | null
  isFeatured: boolean
}

interface Props {
  speakers: Speaker[]
  locale: Locale
}

export function SpeakersGrid({ speakers, locale }: Props) {
  const [selected, setSelected] = useState<Speaker | null>(null)
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "featured">("all")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return speakers.filter((s) => {
      if (filter === "featured" && !s.isFeatured) return false
      if (!q) return true
      const pos = (locale === "en" ? s.positionEn ?? s.positionFr : s.positionFr) ?? ""
      return (
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        (s.company ?? "").toLowerCase().includes(q) ||
        pos.toLowerCase().includes(q) ||
        (s.country ?? "").toLowerCase().includes(q)
      )
    })
  }, [speakers, query, filter, locale])

  return (
    <section className="py-12 sm:py-16 bg-[#f6f7fb] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={locale === "fr" ? "Rechercher un intervenant…" : "Search a speaker…"}
              className="pl-9 bg-white"
            />
          </div>
          <div className="flex gap-1 bg-white rounded-lg border border-border p-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === "all" ? "bg-pmo-violet text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {locale === "fr" ? "Tous" : "All"}
            </button>
            <button
              onClick={() => setFilter("featured")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                filter === "featured" ? "bg-pmo-gold text-pmo-navy" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              {locale === "fr" ? "Vedettes" : "Featured"}
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {locale === "fr" ? "Aucun intervenant trouvé." : "No speakers found."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((sp) => {
              const position = locale === "en" ? sp.positionEn ?? sp.positionFr : sp.positionFr
              return (
                <button
                  key={sp.id}
                  onClick={() => setSelected(sp)}
                  className="group text-left rounded-2xl bg-white border border-border overflow-hidden hover:shadow-premium-lg hover:border-primary/30 transition-all hover:-translate-y-1"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    {sp.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={sp.photo}
                        alt={`${sp.firstName} ${sp.lastName}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-pmo-violet-gradient text-white">
                        <span className="font-display text-4xl font-bold">
                          {sp.firstName.charAt(0)}
                          {sp.lastName.charAt(0)}
                        </span>
                      </div>
                    )}
                    {sp.isFeatured && (
                      <div className="absolute top-2 right-2 rounded-full bg-pmo-gold text-pmo-navy text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        {locale === "fr" ? "Vedette" : "Featured"}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                      <span className="inline-flex items-center gap-1 text-xs text-white font-medium">
                        {locale === "fr" ? "Voir le profil" : "View profile"}
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-base leading-tight">
                      {sp.firstName} {sp.lastName}
                    </h3>
                    {position && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{position}</p>
                    )}
                    {sp.company && (
                      <p className="text-xs text-pmo-violet font-medium mt-1 truncate">{sp.company}</p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <SpeakerModal
        speaker={selected}
        locale={locale}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </section>
  )
}
