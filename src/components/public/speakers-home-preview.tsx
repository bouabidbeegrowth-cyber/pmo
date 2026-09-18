"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { SpeakerModal } from "@/components/public/speaker-modal"
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
  labels: { viewProfile: string; biography: string }
}

function SpeakerCard({
  sp,
  locale,
  labels,
  onClick,
  className,
}: {
  sp: Speaker
  locale: Locale
  labels: { viewProfile: string }
  onClick?: () => void
  className?: string
}) {
  const position = locale === "en" ? sp.positionEn ?? sp.positionFr : sp.positionFr
  return (
    <button
      onClick={onClick}
      className={`group text-left rounded-2xl bg-white border border-border overflow-hidden hover:shadow-premium-lg hover:border-primary/30 transition-all hover:-translate-y-1 shrink-0 ${className ?? ""}`}
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
        {position && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{position}</p>}
        {sp.company && <p className="text-xs text-pmo-violet font-medium mt-1 truncate">{sp.company}</p>}
      </div>
    </button>
  )
}

// Centers a card within its horizontal scroll track only — unlike
// Element.scrollIntoView(), this never touches the page's own vertical
// scroll position, even though the track sits inside a scrollable page.
function centerCardInTrack(card: HTMLElement | null, track: HTMLElement | null, behavior: ScrollBehavior) {
  if (!card || !track) return
  const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2
  track.scrollTo({ left, behavior })
}

export function SpeakersHomePreview({ speakers, locale, labels }: Props) {
  const [selected, setSelected] = useState<Speaker | null>(null)
  const preview = speakers.slice(0, 8)
  const carouselSpeakers = speakers

  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    centerCardInTrack(cardRefs.current[0], trackRef.current, "auto")
  }, [])

  function goTo(newIndex: number) {
    const wrapped = (newIndex + carouselSpeakers.length) % carouselSpeakers.length
    setIndex(wrapped)
    centerCardInTrack(cardRefs.current[wrapped], trackRef.current, "smooth")
  }

  return (
    <>
      {/* Mobile: swipeable loop carousel */}
      <div className="sm:hidden relative group/carousel">
        <div
          ref={trackRef}
          className="-mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {carouselSpeakers.length > 1 && (
            <SpeakerCard
              sp={carouselSpeakers[carouselSpeakers.length - 1]}
              locale={locale}
              labels={labels}
              className="w-[78%] snap-center opacity-70"
            />
          )}

          {carouselSpeakers.map((sp, i) => (
            <div
              key={sp.id}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              className="w-[78%] shrink-0"
            >
              <SpeakerCard
                sp={sp}
                locale={locale}
                labels={labels}
                onClick={() => setSelected(sp)}
                className="w-full snap-center"
              />
            </div>
          ))}

          {carouselSpeakers.length > 1 && (
            <SpeakerCard
              sp={carouselSpeakers[0]}
              locale={locale}
              labels={labels}
              className="w-[78%] snap-center opacity-70"
            />
          )}
        </div>

        {carouselSpeakers.length > 1 && (
          <>
            <button
              onClick={() => goTo(index - 1)}
              aria-label="Speaker précédent"
              className="absolute left-2 top-[38%] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-premium-lg flex items-center justify-center text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => goTo(index + 1)}
              aria-label="Speaker suivant"
              className="absolute right-2 top-[38%] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-premium-lg flex items-center justify-center text-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Tablet / desktop: grid */}
      <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {preview.map((sp) => (
          <SpeakerCard key={sp.id} sp={sp} locale={locale} labels={labels} onClick={() => setSelected(sp)} className="w-full" />
        ))}
      </div>

      <SpeakerModal
        speaker={selected}
        locale={locale}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        labels={labels}
      />
    </>
  )
}
