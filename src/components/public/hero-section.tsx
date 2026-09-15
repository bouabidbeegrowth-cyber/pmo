"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Countdown } from "@/components/public/countdown"

interface HeroSectionProps {
  heroBg?: string | null
  badgeText: string
  title: string
  subtitle?: string
  ctaLabel: string
  ctaHref: string
  showCta: boolean
  ctaSecondaryLabel: string
  ctaSecondaryHref: string
  showCountdown: boolean
  countdownLabel: string
  countdownTarget: string
  countdownLabels: {
    days: string
    hours: string
    minutes: string
    seconds: string
    inProgress: string
    ended: string
  }
}

export function HeroSection({
  heroBg,
  badgeText,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  showCta,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  showCountdown,
  countdownLabel,
  countdownTarget,
  countdownLabels,
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-start lg:items-center pt-28 pb-16 lg:pt-0 lg:pb-0 overflow-hidden"
    >
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroBg ?? "/hero/hero-group-photo-v2.jpg"}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10 lg:gap-10">
          {/* LEFT — Text content */}
          <div className="max-w-xl lg:max-w-2xl flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <p className="hero-gradient-text font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] mb-6">
                {badgeText}
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.05] tracking-tight mb-5 text-balance">
                {title}
              </h1>
              {subtitle && (
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-normal mb-4 text-pretty">
                  {subtitle}
                </p>
              )}
              <div className="hero-divider mb-8" />

              {showCountdown && (
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-widest text-white/50 mb-3">{countdownLabel}</p>
                  <Countdown target={countdownTarget} labels={countdownLabels} />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {showCta && (
                  <Link
                    href={ctaHref}
                    className="hero-btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-premium hover:scale-[1.02] transition-transform"
                  >
                    {ctaLabel}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                <Link
                  href={ctaSecondaryHref}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm text-white px-6 py-3 font-semibold hover:bg-white/10 transition-colors"
                >
                  {ctaSecondaryLabel}
                </Link>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Full logo lockup assembles from its real elements: P, M, PMO watermark, MASTERY column */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
            className="flex-shrink-0 mt-4 lg:mt-0"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="relative w-[260px] sm:w-[320px] lg:w-[340px] xl:w-[410px] drop-shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              style={{ aspectRatio: "754 / 579" }}
            >
              {/* P */}
              <motion.div
                className="absolute"
                style={{ left: "1.19%", top: "3.80%", width: "31.83%" }}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.9 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/hero/hero-mark-p.png" alt="" className="w-full h-auto" />
              </motion.div>

              {/* M */}
              <motion.div
                className="absolute"
                style={{ left: "36.74%", top: "3.80%", width: "46.29%" }}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.05 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/hero/hero-mark-m.png" alt="" className="w-full h-auto" />
              </motion.div>

              {/* PMO watermark + divider line (white, for the dark hero backdrop) */}
              <motion.div
                className="absolute"
                style={{ left: "0.40%", top: "66%", width: "88.20%" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 1.3 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/hero/hero-mark-pmo-ghost-white-v2.png" alt="" className="w-full h-auto" />
              </motion.div>

              {/* MASTERY vertical text + divider line (white, for the dark hero backdrop) */}
              <motion.div
                className="absolute"
                style={{ left: "92.44%", top: "0.17%", width: "7.56%" }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 1.3 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/hero/hero-mark-mastery-ghost-white.png" alt="" className="w-full h-auto" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-2.5 hero-btn-gradient rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
