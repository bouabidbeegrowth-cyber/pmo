"use client"

import { useState } from "react"
import { Play, ImageIcon, Video } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { parseVideoUrl } from "@/lib/video"

export interface GalleryItem {
  id: string
  type: "IMAGE" | "VIDEO"
  imageUrl?: string | null
  videoUrl?: string | null
  thumbnail?: string | null
  caption?: string | null
}

export function GalleryGrid({ items, emptyLabel }: { items: GalleryItem[]; emptyLabel: string }) {
  const [active, setActive] = useState<GalleryItem | null>(null)

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">{emptyLabel}</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => {
          const parsed = item.type === "VIDEO" && item.videoUrl ? parseVideoUrl(item.videoUrl) : null
          const thumb = item.type === "IMAGE" ? item.imageUrl : item.thumbnail ?? parsed?.thumbnailUrl

          return (
            <button
              key={item.id}
              onClick={() => setActive(item)}
              className="group relative aspect-video rounded-2xl overflow-hidden bg-muted shadow-premium hover:shadow-premium-lg transition-all hover:-translate-y-1 text-left"
            >
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumb}
                  alt={item.caption ?? ""}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-pmo-navy-gradient">
                  <Video className="w-8 h-8 text-white/40" />
                </div>
              )}
              {item.type === "VIDEO" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/35 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-premium group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-pmo-navy fill-pmo-navy ml-0.5" />
                  </div>
                </div>
              )}
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                  <p className="text-white text-sm font-medium line-clamp-1">{item.caption}</p>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-3xl lg:max-w-5xl p-0 overflow-hidden bg-black border-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{active?.caption ?? "Média"}</DialogTitle>
          </DialogHeader>
          {active && (
            <div className="aspect-video w-full">
              {active.type === "IMAGE" && active.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={active.imageUrl} alt={active.caption ?? ""} className="w-full h-full object-contain" />
              ) : active.type === "VIDEO" && active.videoUrl ? (
                (() => {
                  const parsed = parseVideoUrl(active.videoUrl)
                  return parsed ? (
                    <iframe
                      src={parsed.embedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : null
                })()
              ) : null}
            </div>
          )}
          {active?.caption && (
            <p className="text-white/80 text-sm px-4 py-3">{active.caption}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
