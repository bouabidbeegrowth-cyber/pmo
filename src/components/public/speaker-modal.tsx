"use client"

import { useState } from "react"
import { X, Linkedin, Globe, MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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

export function SpeakerModal({
  speaker,
  locale,
  open,
  onOpenChange,
}: {
  speaker: Speaker | null
  locale: "fr" | "en"
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!speaker) return null
  const position = locale === "en" ? speaker.positionEn ?? speaker.positionFr : speaker.positionFr
  const bio = locale === "en" ? speaker.biographyEn ?? speaker.biographyFr : speaker.biographyFr

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {speaker.firstName} {speaker.lastName}
          </DialogTitle>
        </DialogHeader>
        <div className="grid sm:grid-cols-[280px_1fr] gap-0">
          {/* Photo side */}
          <div className="relative bg-pmo-navy-gradient p-6 sm:p-8 flex flex-col">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-white/10 shadow-premium-lg mx-auto">
                {speaker.photo ? (
                   
                  <img
                    src={speaker.photo}
                    alt={`${speaker.firstName} ${speaker.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-display font-bold text-white">
                    {speaker.firstName.charAt(0)}
                    {speaker.lastName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-display text-xl font-bold text-white">
                  {speaker.firstName} {speaker.lastName}
                </h3>
                {position && (
                  <p className="text-sm text-white/70 mt-1">{position}</p>
                )}
                {speaker.company && (
                  <p className="text-sm text-pmo-gold mt-1 font-medium">{speaker.company}</p>
                )}
                {speaker.country && (
                  <p className="text-xs text-white/60 mt-2 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {speaker.country}
                  </p>
                )}
              </div>
              <div className="mt-5 flex items-center justify-center gap-2">
                {speaker.linkedinUrl && (
                  <a
                    href={speaker.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {speaker.websiteUrl && (
                  <a
                    href={speaker.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
          {/* Bio side */}
          <div className="p-6 sm:p-8">
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              {locale === "fr" ? "Biographie" : "Biography"}
            </h4>
            <div className="prose prose-sm max-w-none">
              {(bio ?? "")
                .split("\n")
                .filter((p) => p.trim().length > 0)
                .map((paragraph, i) => (
                  <p key={i} className="text-foreground/80 leading-relaxed mb-3">
                    {paragraph}
                  </p>
                ))}
            </div>
            {speaker.isFeatured && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-pmo-gold/10 border border-pmo-gold/30 px-3 py-1 text-xs text-pmo-gold font-semibold">
                ★ {locale === "fr" ? "Speaker vedette" : "Featured speaker"}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function useSpeakerModal() {
  const [selected, setSelected] = useState<Speaker | null>(null)
  const [open, setOpen] = useState(false)
  function show(speaker: Speaker) {
    setSelected(speaker)
    setOpen(true)
  }
  return { selected, open, show, setOpen }
}
