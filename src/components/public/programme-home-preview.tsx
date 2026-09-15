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
  sessionTypeLabels: Record<string, string>
}

const TYPE_STYLES: Record<string, { color: string; dot: string }> = {
  KEYNOTE: { color: "bg-pmo-blue/10 text-pmo-blue border-pmo-blue/20", dot: "bg-pmo-blue" },
  PANEL: { color: "bg-pmo-sky-blue/15 text-pmo-sky-blue border-pmo-sky-blue/25", dot: "bg-pmo-sky-blue" },
  BREAK: { color: "bg-pmo-bright-orange/10 text-pmo-bright-orange border-pmo-bright-orange/20", dot: "bg-pmo-bright-orange" },
  NETWORKING: { color: "bg-pmo-pink/10 text-pmo-pink border-pmo-pink/20", dot: "bg-pmo-pink" },
  CLOSING: { color: "bg-pmo-navy-deep/10 text-pmo-navy-deep border-pmo-navy-deep/20", dot: "bg-pmo-navy-deep" },
  WORKSHOP: { color: "bg-pmo-sky-blue/15 text-pmo-sky-blue border-pmo-sky-blue/25", dot: "bg-pmo-sky-blue" },
  SESSION: { color: "bg-pmo-text-navy/10 text-pmo-text-navy border-pmo-text-navy/20", dot: "bg-pmo-text-navy" },
  PMO_TALKS: { color: "bg-pmo-blue/10 text-pmo-blue border-pmo-blue/20", dot: "bg-pmo-blue" },
  MASTERCLASS: { color: "bg-pmo-pink/10 text-pmo-pink border-pmo-pink/20", dot: "bg-pmo-pink" },
}

export function ProgrammeHomePreview({ days, locale, sessionTypeLabels }: Props) {
  const dateLocale = locale === "fr" ? fr : enUS
  // Show first day, first 5 sessions as preview
  const day = days[0]
  if (!day) return null
  const previewSessions = day.sessions.slice(0, 5)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-premium">
        {/* Day header */}
        <div className="bg-pmo-navy-deep text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="font-display font-semibold text-lg">
              {locale === "en" ? day.nameEn ?? day.nameFr : day.nameFr}
            </div>
            <div className="text-xs text-white/60">
              {format(new Date(day.date), "EEEE dd MMMM yyyy", { locale: dateLocale })}
            </div>
          </div>
          <Clock3 className="w-5 h-5 text-pmo-sky-blue" />
        </div>

        {/* Sessions */}
        <div className="divide-y divide-border">
          {previewSessions.map((session) => {
            const typeMeta = TYPE_STYLES[session.sessionType] ?? TYPE_STYLES.SESSION
            const typeLabel = sessionTypeLabels[session.sessionType] ?? session.sessionType
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
                      {typeLabel}
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
