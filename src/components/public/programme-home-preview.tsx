"use client"

import { motion } from "framer-motion"
import { Clock3, MapPin } from "lucide-react"
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
  isHeader?: boolean
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
  OUVERTURE: { color: "bg-pmo-orange/10 text-pmo-orange border-pmo-orange/20", dot: "bg-pmo-orange" },
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
  const previewSessions = day.sessions.filter((s) => !s.isHeader).slice(0, 5)
  const speakersLabel = locale === "en" ? "Speakers" : "Intervenants"

  return (
    <div className="max-w-4xl mx-auto">
      {/* Day header */}
      <div className="rounded-2xl bg-pmo-navy-deep text-white px-6 py-4 flex items-center justify-between mb-4">
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
      <div className="space-y-4">
        {previewSessions.map((session, i) => {
          const typeMeta = TYPE_STYLES[session.sessionType] ?? TYPE_STYLES.SESSION
          const typeLabel = sessionTypeLabels[session.sessionType] ?? session.sessionType
          const title = locale === "en"
            ? session.titleEn ?? session.titleFr
            : session.titleFr
          const hideDetails = session.sessionType === "PANEL" || session.sessionType === "SESSION"
          const description = hideDetails
            ? null
            : locale === "en"
              ? session.descriptionEn ?? session.descriptionFr
              : session.descriptionFr
          const timeRange = session.endTime ? `${session.startTime} – ${session.endTime}` : session.startTime

          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
              className="rounded-2xl border border-border bg-card p-4 sm:p-5 hover:shadow-premium transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                {/* Time · room · type badge */}
                <div className="sm:w-40 shrink-0 flex flex-row sm:flex-col flex-wrap items-center sm:items-start gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-bold tabular-nums">
                    <Clock3 className="w-3.5 h-3.5 text-pmo-blue shrink-0" />
                    {timeRange}
                  </div>
                  {session.room && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {session.room}
                    </div>
                  )}
                  <span className={cn("inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border whitespace-nowrap", typeMeta.color)}>
                    {typeLabel}
                  </span>
                </div>

                {/* Title + description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-1.5">
                    <h3 className="font-display text-base sm:text-lg font-bold leading-snug">
                      {title}
                    </h3>
                  </div>
                  {description && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {description}
                    </p>
                  )}
                </div>

                {/* Speakers */}
                {session.speakers.length > 0 && (
                  <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {speakersLabel}
                    </span>
                    <div className="flex -space-x-2">
                      {session.speakers.slice(0, 4).map(({ speaker }) => (
                        <div
                          key={speaker.id}
                          title={`${speaker.firstName} ${speaker.lastName}`}
                          className="w-9 h-9 rounded-full ring-2 ring-background overflow-hidden bg-muted shrink-0"
                        >
                          {speaker.photo ? (
                            <img src={speaker.photo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-semibold hero-btn-gradient text-white">
                              {speaker.firstName.charAt(0)}
                              {speaker.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
