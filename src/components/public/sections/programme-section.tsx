"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
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
  isHeader?: boolean
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

export function ProgrammeSection({ days, locale, title, subtitle, dayLabel, sessionTypeLabels, showCta, ctaLabel, ctaHref }: Props) {
  const [activeDay, setActiveDay] = useState(days[0]?.id ?? "")
  const dateLocale = locale === "fr" ? fr : enUS
  const day = days.find((d) => d.id === activeDay)

  if (!day) return null

  return (
    <section id="programme" className="py-20 sm:py-28 bg-background relative overflow-hidden">
      {/* Background: subtle grid + soft brand-color glows */}
      <div className="absolute inset-0 bg-grid-dark opacity-40" />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-pmo-blue/10 blur-3xl" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-pmo-pink/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-pmo-bright-orange/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <AnimatePresence mode="wait">
          <motion.div
            key={day.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-4"
          >
          {day.sessions.map((session, i) => {
            const title = locale === "en"
              ? session.titleEn ?? session.titleFr
              : session.titleFr

            if (session.isHeader) {
              return (
                <motion.h3
                  key={session.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
                  className="hero-gradient-text font-display text-xl sm:text-2xl font-extrabold pt-6 first:pt-0"
                >
                  {title}
                </motion.h3>
              )
            }

            const typeMeta = TYPE_STYLES[session.sessionType] ?? TYPE_STYLES.SESSION
            const typeLabel = sessionTypeLabels[session.sessionType] ?? session.sessionType
            const hideDetails = session.sessionType === "PANEL" || session.sessionType === "SESSION"
            const description = hideDetails
              ? null
              : locale === "en"
                ? session.descriptionEn ?? session.descriptionFr
                : session.descriptionFr
            const timeRange = session.endTime ? `${session.startTime} – ${session.endTime}` : session.startTime

            const speakersLabel = locale === "en" ? "Speakers" : "Intervenants"

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
                className="rounded-2xl border border-border bg-card p-4 sm:p-5 hover:shadow-premium transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                  {/* Time · room · type badge */}
                  <div className="sm:w-44 shrink-0 flex flex-row sm:flex-col flex-wrap items-center sm:items-start gap-2">
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

                  {/* Title + description + CTA */}
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
                    {showCta && ctaHref && ctaLabel && (
                      <Link
                        href={ctaHref}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-pmo-navy-deep text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide px-3.5 py-2 hover:opacity-90 transition-opacity"
                      >
                        {ctaLabel}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
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
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
