"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { SpeakerModal } from "@/components/public/speaker-modal"
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

export function SpeakersHomePreview({ speakers, locale }: Props) {
  const [selected, setSelected] = useState<Speaker | null>(null)
  const preview = speakers.slice(0, 8)

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {preview.map((sp) => {
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
                  <div className="absolute top-2 right-2 rounded-full bg-pmo-gold text-pmo-navy text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                    ★
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

      <SpeakerModal
        speaker={selected}
        locale={locale}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </>
  )
}
