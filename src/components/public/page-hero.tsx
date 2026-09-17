"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface PageHeroProps {
  eyebrow?: string
  title: string
  subtitle?: string
  breadcrumbs?: { href?: string; label: string }[]
  backgroundVideo?: string | null
}

/**
 * Shared hero band for inner public pages (not the home page).
 * Uses the premium navy gradient with subtle grid, or an optional single
 * autoplaying background video (opt-in per page via `backgroundVideo`).
 */
export function PageHero({ eyebrow, title, subtitle, breadcrumbs, backgroundVideo }: PageHeroProps) {
  if (backgroundVideo) {
    return (
      <section className="relative bg-pmo-navy text-white overflow-hidden h-[440px] sm:h-[520px] lg:h-[600px] flex flex-col">
        {/* Reserve the fixed header's own height — the video starts right below it. */}
        <div className="relative shrink-0 h-[72px] sm:h-[80px] bg-pmo-navy" />
        <div className="relative flex-1 overflow-hidden">
          <video
            src={backgroundVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pmo-navy via-pmo-navy/50 to-pmo-navy/10" />

          <div className="relative h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-5 flex-wrap" aria-label="Breadcrumb">
                {breadcrumbs.map((b, i) => {
                  const isLast = i === breadcrumbs.length - 1
                  return (
                    <span key={i} className="flex items-center gap-1.5">
                      {b.href && !isLast ? (
                        <Link href={b.href} className="hover:text-white transition-colors">
                          {b.label}
                        </Link>
                      ) : (
                        <span className={isLast ? "text-white/80" : ""}>{b.label}</span>
                      )}
                      {!isLast && <ChevronRight className="w-3 h-3" />}
                    </span>
                  )
                })}
              </nav>
            )}

            {eyebrow && (
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-gold mb-5 w-fit">
                {eyebrow}
              </div>
            )}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-balance max-w-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/70 text-lg mt-4 max-w-2xl text-pretty">{subtitle}</p>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-pmo-navy-gradient text-white overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-20">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full bg-pmo-violet/20 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-pmo-gold/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-5 flex-wrap" aria-label="Breadcrumb">
            {breadcrumbs.map((b, i) => {
              const isLast = i === breadcrumbs.length - 1
              return (
                <span key={i} className="flex items-center gap-1.5">
                  {b.href && !isLast ? (
                    <Link href={b.href} className="hover:text-white transition-colors">
                      {b.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-white/80" : ""}>{b.label}</span>
                  )}
                  {!isLast && <ChevronRight className="w-3 h-3" />}
                </span>
              )
            })}
          </nav>
        )}

        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs uppercase tracking-widest text-pmo-gold mb-5">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-balance max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/70 text-lg mt-4 max-w-2xl text-pretty">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
