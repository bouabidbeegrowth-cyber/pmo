"use client"

import { useState } from "react"
import { Clock3, MapPin, Users, Calendar } from "lucide-react"
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

export function ProgrammeSection({ days, locale, title, subtitle, dayLabel }: Props) {
  const [activeDay, setActiveDay] = useState(days[0]?.id ?? "")
  const dateLocale = locale === "fr" ? fr : enUS
  const day = days.find((d) => d.id === activeDay)

  if (!day) return null

  return (
    <section id="programme" className="py-20 sm:py-28 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-pmo-violet/10 border border-pmo-violet/20 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-violet mb-4">
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
                      ? "bg-pmo-violet-gradient text-white shadow-premium"
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

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-32 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-4">
              {day.sessions.map((session) => {
                const typeMeta = TYPE_STYLES[session.sessionType] ?? TYPE_STYLES.SESSION
                const title = locale === "en"
                  ? session.titleEn ?? session.titleFr
                  : session.titleFr
                const description = locale === "en"
                  ? session.descriptionEn ?? session.descriptionFr
                  : session.descriptionFr
                return (
                  <div key={session.id} className="relative pl-12 sm:pl-40">
                    {/* Time + dot */}
                    <div className="absolute left-0 top-3 flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-full ring-4 ring-background", typeMeta.dot)} />
                    </div>
                    <div className="absolute left-0 top-3 hidden sm:block sm:w-32 sm:pr-4 text-right">
                      <div className="font-display text-sm font-bold tabular-nums">{session.startTime}</div>
                      {session.endTime && (
                        <div className="text-xs text-muted-foreground tabular-nums">{session.endTime}</div>
                      )}
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 hover:shadow-premium transition-shadow">
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border", typeMeta.color)}>
                            {typeMeta.label}
                          </span>
                          {session.language && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {session.language}
                            </span>
                          )}
                          {session.room && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {session.room}
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="font-display text-base sm:text-lg font-semibold leading-tight mb-1">
                        {title}
                      </h3>
                      {description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                      )}
                      {/* Speakers */}
                      {session.speakers.length > 0 && (
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                          <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <div className="flex items-center gap-2 flex-wrap">
                            {session.speakers.map(({ speaker }) => (
                              <div key={speaker.id} className="flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-full bg-muted overflow-hidden">
                                  {speaker.photo ? (
                                     
                                    <img src={speaker.photo} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-semibold bg-pmo-violet-gradient text-white">
                                      {speaker.firstName.charAt(0)}
                                      {speaker.lastName.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {speaker.firstName} {speaker.lastName}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
