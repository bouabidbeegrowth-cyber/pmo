"use client"

import { useState } from "react"
import { Users, ArrowRight } from "lucide-react"
import { SpeakerModal } from "@/components/public/speaker-modal"

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
  locale: "fr" | "en"
  title: string
  subtitle: string
}

export function SpeakersSection({ speakers, locale, title, subtitle }: Props) {
  const [selected, setSelected] = useState<Speaker | null>(null)
  const [showAll, setShowAll] = useState(false)

  const visible = showAll ? speakers : speakers.slice(0, 8)
  const featured = speakers.filter((s) => s.isFeatured)

  return (
    <section id="speakers" className="py-20 sm:py-28 bg-[#f6f7fb] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-pmo-violet/10 border border-pmo-violet/20 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-violet mb-4">
            <Users className="w-3.5 h-3.5" />
            {title}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            {title}
          </h2>
          <p className="text-muted-foreground text-lg">{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {visible.map((sp) => {
            const position = locale === "en" ? sp.positionEn ?? sp.positionFr : sp.positionFr
            return (
              <button
                key={sp.id}
                onClick={() => setSelected(sp)}
                className="group text-left rounded-2xl bg-white border border-border overflow-hidden hover:shadow-premium-lg hover:border-primary/30 transition-all hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  {sp.photo ? (
                     
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
                    <div className="absolute top-2 right-2 rounded-full bg-pmo-gold text-pmo-navy text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                      ★ Vedette
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                    <span className="inline-flex items-center gap-1 text-xs text-white font-medium">
                      Voir le profil
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

        {speakers.length > 8 && !showAll && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 px-6 py-3 font-semibold text-primary transition-all"
            >
              Voir tous les intervenants ({speakers.length})
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <SpeakerModal
          speaker={selected}
          locale={locale}
          open={!!selected}
          onOpenChange={(o) => !o && setSelected(null)}
        />
      </div>
    </section>
  )
}
