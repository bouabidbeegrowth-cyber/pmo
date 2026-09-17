"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"

export interface GalleryItem {
  id: string
  type: "IMAGE" | "VIDEO"
  imageUrl?: string | null
  videoUrl?: string | null
  thumbnail?: string | null
  caption?: string | null
}

function Card({ item, className }: { item: GalleryItem; className?: string }) {
  return (
    <div className={`shrink-0 aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-premium ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.imageUrl!} alt={item.caption ?? ""} className="w-full h-full object-cover" />
    </div>
  )
}

const CARD_WIDTH = "w-[84%] sm:w-[70%] lg:w-[52%] xl:w-[46%]"

export function GalleryGrid({ items, emptyLabel }: { items: GalleryItem[]; emptyLabel: string }) {
  const images = items.filter((item) => item.type === "IMAGE" && item.imageUrl)
  const [index, setIndex] = useState(0)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    cardRefs.current[0]?.scrollIntoView({ inline: "center", block: "nearest" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (images.length === 0) {
    return (
      <div className="text-center py-16">
        <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">{emptyLabel}</p>
      </div>
    )
  }

  function goTo(newIndex: number, smooth = true) {
    const wrapped = (newIndex + images.length) % images.length
    setIndex(wrapped)
    cardRefs.current[wrapped]?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: smooth ? "smooth" : "auto",
    })
  }

  return (
    <div className="relative group/carousel">
      <div className="-mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Clone of the last image, peeking before the first — makes the loop feel continuous. */}
        {images.length > 1 && (
          <Card item={images[images.length - 1]} className={`${CARD_WIDTH} snap-center opacity-70`} />
        )}

        {images.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            className={`${CARD_WIDTH} snap-center shrink-0`}
          >
            <Card item={item} className="w-full" />
          </div>
        ))}

        {/* Clone of the first image, peeking after the last. */}
        {images.length > 1 && <Card item={images[0]} className={`${CARD_WIDTH} snap-center opacity-70`} />}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={() => goTo(index - 1)}
            aria-label="Image précédente"
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-premium-lg items-center justify-center text-foreground opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => goTo(index + 1)}
            aria-label="Image suivante"
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-premium-lg items-center justify-center text-foreground opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:scale-105"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  )
}
