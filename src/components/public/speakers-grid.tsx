"use client"

import { useState, useMemo } from "react"
import { ArrowRight, Search } from "lucide-react"
import { SpeakerModal } from "@/components/public/speaker-modal"
import { Input } from "@/components/ui/input"
import { thumbUrl } from "@/lib/image"
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
}

interface Props {
  speakers: Speaker[]
  locale: Locale
  labels: {
    searchPlaceholder: string
    noResults: string
    viewProfile: string
    biography: string
  }
}

export function SpeakersGrid({ speakers, locale, labels }: Props) {
  const [selected, setSelected] = useState<Speaker | null>(null)
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return speakers.filter((s) => {
      if (!q) return true
      const pos = (locale === "en" ? s.positionEn ?? s.positionFr : s.positionFr) ?? ""
      return (
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        (s.company ?? "").toLowerCase().includes(q) ||
        pos.toLowerCase().includes(q) ||
        (s.country ?? "").toLowerCase().includes(q)
      )
    })
  }, [speakers, query, locale])

  return (
    <section className="py-12 sm:py-16 bg-pmo-light-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.searchPlaceholder}
              className="pl-9 bg-white"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">{labels.noResults}</p>
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
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl bg-muted">
                    {sp.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbUrl(sp.photo) ?? sp.photo}
                        onError={(e) => {
                          if (e.currentTarget.src !== sp.photo) e.currentTarget.src = sp.photo!
                        }}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                      <span className="inline-flex items-center gap-1 text-xs text-white font-medium">
                        {labels.viewProfile}
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
        labels={labels}
      />
    </section>
  )
}
