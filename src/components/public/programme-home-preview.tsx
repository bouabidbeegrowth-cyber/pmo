"use client"

import { useState } from "react"
import { Clock3, MapPin, Users } from "lucide-react"
import { format } from "date-fns"
import { fr, enUS } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/site-data"

interface SpeakerLite {
  id: string
  firstName: string
  lastName: string
  photo?: string | null
}

interface Session {
  id: string
  startTime: string
  endTime?: string | null
  titleFr: string
  titleEn?: string | null
  descriptionFr?: string | null
  descriptionEn?: string | null
  sessionType: string
  language?: string | null
  room?: string | null
  speakers: { speaker: SpeakerLite }[]
}

interface Day {
  id: string
  nameFr: string
  nameEn?: string | null
  date: string
  sessions: Session[]
}

interface Props {
  days: Day[]
  locale: Locale
}

const TYPE_STYLES: Record<string, { label: string; color: string; dot: string }> = {
  KEYNOTE: { label: "Keynote", color: "bg-violet-100 text-violet-700 border-violet-200", dot: "bg-violet-500" },
  PANEL: { label: "Panel", color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  BREAK: { label: "Pause", color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  NETWORKING: { label: "Networking", color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  CLOSING: { label: "Clôture", color: "bg-rose-100 text-rose-700 border-rose-200", dot: "bg-rose-500" },
  WORKSHOP: { label: "Atelier", color: "bg-cyan-100 text-cyan-700 border-cyan-200", dot: "bg-cyan-500" },
  SESSION: { label: "Session", color: "bg-zinc-100 text-zinc-700 border-zinc-200", dot: "bg-zinc-500" },
}

export function ProgrammeHomePreview({ days, locale }: Props) {
  const dateLocale = locale === "fr" ? fr : enUS
  // Show first day, first 5 sessions as preview
  const day = days[0]
  if (!day) return null
  const previewSessions = day.sessions.slice(0, 5)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-premium">
        {/* Day header */}
        <div className="bg-pmo-navy-gradient text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="font-display font-semibold text-lg">
              {locale === "en" ? day.nameEn ?? day.nameFr : day.nameFr}
            </div>
            <div className="text-xs text-white/60">
              {format(new Date(day.date), "EEEE dd MMMM yyyy", { locale: dateLocale })}
            </div>
          </div>
          <Clock3 className="w-5 h-5 text-pmo-gold" />
        </div>

        {/* Sessions */}
        <div className="divide-y divide-border">
          {previewSessions.map((session) => {
            const typeMeta = TYPE_STYLES[session.sessionType] ?? TYPE_STYLES.SESSION
            const title = locale === "en"
              ? session.titleEn ?? session.titleFr
              : session.titleFr
            return (
              <div key={session.id} className="p-4 sm:p-5 flex gap-4 hover:bg-muted/40 transition-colors">
                <div className="shrink-0 w-20 sm:w-24 text-right">
                  <div className="font-display text-sm font-bold tabular-nums">{session.startTime}</div>
                  {session.endTime && (
                    <div className="text-xs text-muted-foreground tabular-nums">{session.endTime}</div>
                  )}
                </div>
                <div className={cn("shrink-0 w-1 rounded-full", typeMeta.dot)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border", typeMeta.color)}>
                      {typeMeta.label}
                    </span>
                    {session.language && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {session.language}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-semibold leading-tight">{title}</h3>
                  {session.speakers.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      {session.speakers.map(({ speaker }, i) => (
                        <span key={speaker.id}>
                          {speaker.firstName} {speaker.lastName}{i < session.speakers.length - 1 ? "," : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
