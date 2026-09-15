"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock3, MapPin, ArrowUpRight } from "lucide-react"
import { format } from "date-fns"
import { fr, enUS } from "date-fns/locale"
import { cn } from "@/lib/utils"

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
  titleAr?: string | null
  descriptionFr?: string | null
  descriptionEn?: string | null
  sessionType: string
  language?: string | null
  room?: string | null
  speakers: { speaker: SpeakerLite }[]
  moderator?: SpeakerLite | null
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
  locale: "fr" | "en"
  title: string
  subtitle: string
  dayLabel: string
  sessionTypeLabels: Record<string, string>
  showCta?: boolean
  ctaLabel?: string
  ctaHref?: string
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

export function ProgrammeSection({ days, locale, title, subtitle, dayLabel, sessionTypeLabels, showCta, ctaLabel, ctaHref }: Props) {
  const [activeDay, setActiveDay] = useState(days[0]?.id ?? "")
  const dateLocale = locale === "fr" ? fr : enUS
  const day = days.find((d) => d.id === activeDay)

  if (!day) return null

  return (
    <section id="programme" className="py-20 sm:py-28 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-pmo-pink/10 border border-pmo-pink/20 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-pink mb-4">
            <Clock3 className="w-3.5 h-3.5" />
            {title}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">{title}</h2>
          <p className="text-muted-foreground text-lg">{subtitle}</p>
        </div>

        {/* Day tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex gap-1 bg-muted rounded-2xl p-1 overflow-x-auto max-w-full">
            {days.map((d) => {
              const isActive = d.id === activeDay
              const dayName = locale === "en" ? d.nameEn ?? d.nameFr : d.nameFr
              return (
                <button
                  key={d.id}
                  onClick={() => setActiveDay(d.id)}
                  className={cn(
                    "px-5 sm:px-8 py-3 rounded-xl font-display font-semibold transition-all whitespace-nowrap",
                    isActive
                      ? "hero-btn-gradient text-white shadow-premium"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <div className="text-sm sm:text-base">{dayName}</div>
                  <div className={cn("text-xs mt-0.5", isActive ? "text-white/80" : "text-muted-foreground/70")}>
                    {format(new Date(d.date), "dd MMM", { locale: dateLocale })}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Sessions */}
        <div className="max-w-4xl mx-auto space-y-4">
          {day.sessions.map((session) => {
            const typeMeta = TYPE_STYLES[session.sessionType] ?? TYPE_STYLES.SESSION
            const typeLabel = sessionTypeLabels[session.sessionType] ?? session.sessionType
            const title = locale === "en"
              ? session.titleEn ?? session.titleFr
              : session.titleFr
            const description = locale === "en"
              ? session.descriptionEn ?? session.descriptionFr
              : session.descriptionFr
            const timeRange = session.endTime ? `${session.startTime} – ${session.endTime}` : session.startTime

            return (
              <div key={session.id} className="rounded-2xl border border-border bg-card p-4 sm:p-5 flex gap-4 hover:shadow-premium transition-shadow">
                {/* Photo(s) + type badge */}
                <div className="relative shrink-0 pt-2">
                  <div className="flex -space-x-3">
                    {session.speakers.length > 0 ? (
                      session.speakers.slice(0, 2).map(({ speaker }) => (
                        <div key={speaker.id} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full ring-2 ring-background overflow-hidden bg-muted shrink-0">
                          {speaker.photo ? (

                            <img src={speaker.photo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-semibold hero-btn-gradient text-white">
                              {speaker.firstName.charAt(0)}
                              {speaker.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center", typeMeta.color)}>
                        <Clock3 className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <span className={cn("absolute -top-2 left-0 text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border whitespace-nowrap", typeMeta.color)}>
                    {typeLabel}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                    <h3 className="font-display text-sm sm:text-base font-bold leading-snug">
                      {title}
                    </h3>
                    {session.language && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                        {session.language}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-2 flex-wrap">
                    <Clock3 className="w-3.5 h-3.5 text-pmo-blue shrink-0" />
                    <span className="font-semibold tabular-nums">{timeRange}</span>
                    {session.room && (
                      <>
                        <span className="text-border">·</span>
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{session.room}</span>
                      </>
                    )}
                  </div>
                  {description && (
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                      {description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 flex-wrap">
                    {showCta && ctaHref && ctaLabel && (
                      <>
                        <span className="w-px h-4 bg-border shrink-0" />
                        <Link
                          href={ctaHref}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-pmo-navy-deep text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide px-3.5 py-2 hover:opacity-90 transition-opacity"
                        >
                          {ctaLabel}
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </>
                    )}
                    {session.speakers.length > 0 && (
                      <span className="text-xs text-muted-foreground truncate">
                        {session.speakers.map(({ speaker }) => `${speaker.firstName} ${speaker.lastName}`).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
