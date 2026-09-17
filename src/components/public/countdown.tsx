"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CountdownProps {
  target: string // ISO date string
  labels: {
    days: string
    hours: string
    minutes: string
    seconds: string
    inProgress: string
    ended: string
  }
  variant?: "dark" | "light"
}

function calcRemaining(target: number) {
  const now = Date.now()
  const diff = target - now
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, state: "ended" as const }
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds, state: "upcoming" as const }
}

export function Countdown({ target, labels, variant = "dark" }: CountdownProps) {
  const isLightVariant = variant === "light"
  const targetTime = new Date(target).getTime()
  const [data, setData] = useState(() => calcRemaining(targetTime))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const tick = () => setData(calcRemaining(targetTime))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetTime])

  const units = [
    { key: "days" as const, label: labels.days },
    { key: "hours" as const, label: labels.hours },
    { key: "minutes" as const, label: labels.minutes },
    { key: "seconds" as const, label: labels.seconds },
  ]

  const now = Date.now()
  const startOfDay = new Date(targetTime).setHours(0, 0, 0, 0)
  const endOfDay = new Date(targetTime).setHours(23, 59, 59, 999)
  const isLive = now >= startOfDay && now <= endOfDay + 86400000

  if (isLive) {
    return (
      <div className="inline-flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-6 py-4 backdrop-blur-sm">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
        </span>
        <span className="font-display text-xl font-bold text-emerald-400">{labels.inProgress}</span>
      </div>
    )
  }

  if (data.state === "ended") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-3 rounded-2xl border px-6 py-4",
          isLightVariant ? "bg-muted border-border" : "bg-white/5 border-white/10",
        )}
      >
        <span className={cn("font-display text-xl font-bold", isLightVariant ? "text-muted-foreground" : "text-white/70")}>
          {labels.ended}
        </span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md">
      {units.map((u) => {
        const value = data[u.key]
        return (
          <div
            key={u.key}
            className={cn(
              "relative rounded-2xl backdrop-blur-md border px-2 py-3 sm:px-4 sm:py-4 text-center overflow-hidden",
              isLightVariant
                ? "bg-pmo-navy-deep/5 border-pmo-navy-deep/10"
                : "bg-white/5 border-white/10",
            )}
          >
            {!isLightVariant && (
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
            )}
            <div
              className={cn(
                "relative font-display text-2xl sm:text-4xl font-bold tabular-nums",
                isLightVariant ? "text-pmo-navy-deep" : "text-white",
              )}
            >
              {mounted ? String(value).padStart(2, "0") : "--"}
            </div>
            <div
              className={cn(
                "relative text-[10px] sm:text-xs uppercase tracking-widest mt-1",
                isLightVariant ? "text-muted-foreground" : "text-white/60",
              )}
            >
              {u.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
