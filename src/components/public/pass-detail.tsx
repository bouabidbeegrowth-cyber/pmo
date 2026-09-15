"use client"

import { Check, ArrowRight, ArrowLeft, Shield, Clock, Users, Star } from "lucide-react"
import Link from "next/link"
import { cn, formatPrice, parseFeatures } from "@/lib/utils"
import type { Locale } from "@/lib/site-data"

interface Pass {
  id: string
  slug: string
  nameFr: string
  nameEn?: string | null
  descriptionFr?: string | null
  descriptionEn?: string | null
  price: number
  currency: string
  vatRate: number
  featuresFr?: string | null
  featuresEn?: string | null
  paymentUrl?: string | null
  minQuantity: number
  isFeatured: boolean
}

interface OtherPass {
  id: string
  slug: string
  nameFr: string
  nameEn?: string | null
  price: number
  currency: string
  isFeatured: boolean
}

interface Props {
  pass: Pass
  otherPasses: OtherPass[]
  locale: Locale
  theme: "violet" | "gold" | "navy"
  labels: {
    includes: string
    priceHt: string
    vat: string
    ttc: string
    register: string
    registrationSoon: string
    minQty: string
    otherPasses: string
    guarantee: string
    backToPasses: string
    perPerson: string
    recommendedBadge: string
    priceLabel: string
    access2days: string
    networkingIncluded: string
    viewDetails: string
  }
}

const SLUG_TO_HREF: Record<string, string> = {
  "pass-evenement": "/pass-evenement",
  "pass-formation": "/pass-formation",
  "pass-duo": "/pass-duo",
}

const THEME_STYLES = {
  violet: {
    badge: "bg-pmo-violet/10 border-pmo-violet/20 text-pmo-violet",
    accent: "bg-pmo-violet-gradient text-white",
    icon: "bg-pmo-violet/10 text-pmo-violet",
    ring: "ring-pmo-violet/30",
    glow: "from-pmo-violet/20",
  },
  gold: {
    badge: "bg-pmo-gold/10 border-pmo-gold/20 text-pmo-gold",
    accent: "bg-pmo-gold-gradient text-white",
    icon: "bg-pmo-gold/10 text-pmo-gold",
    ring: "ring-pmo-gold/30",
    glow: "from-pmo-gold/20",
  },
  navy: {
    badge: "bg-pmo-navy/10 border-pmo-navy/20 text-pmo-navy",
    accent: "bg-pmo-navy-gradient text-white",
    icon: "bg-pmo-navy/10 text-pmo-navy",
    ring: "ring-pmo-navy/30",
    glow: "from-pmo-navy/20",
  },
}

export function PassDetail({ pass, otherPasses, locale, theme, labels: t }: Props) {
  const styles = THEME_STYLES[theme]
  const name = locale === "en" ? pass.nameEn ?? pass.nameFr : pass.nameFr
  const description = locale === "en"
    ? pass.descriptionEn ?? pass.descriptionFr
    : pass.descriptionFr
  const features = parseFeatures(
    locale === "en" ? pass.featuresEn ?? pass.featuresFr : pass.featuresFr,
  )
  const priceTtc = pass.price + pass.price * pass.vatRate

  return (
    <div className="py-12 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-14 items-start">
          {/* Left — details */}
          <div>
            {pass.isFeatured && (
              <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold mb-4", styles.badge)}>
                <Star className="w-3 h-3 fill-current" />
                {t.recommendedBadge}
              </div>
            )}
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">{name}</h1>
            {description && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-pretty">{description}</p>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h2 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
                  <Check className="w-5 h-5 text-pmo-violet" />
                  {t.includes}
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className={cn("shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5", styles.icon)}>
                        <Check className="w-3 h-3" />
                      </span>
                      <span className="text-sm text-foreground/80 leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trust badges */}
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {[
                { icon: Shield, label: t.guarantee },
                { icon: Clock, label: t.access2days },
                { icon: Users, label: t.networkingIncluded },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-xl bg-muted/50 p-3">
                  <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — sticky purchase card */}
          <div className="lg:sticky lg:top-24">
            <div className="relative">
              <div className={cn("absolute -inset-3 bg-gradient-to-br to-transparent rounded-3xl blur-2xl", styles.glow)} />
              <div className={cn("relative rounded-3xl border-2 bg-card p-6 sm:p-8 shadow-premium-lg", `ring-4 ${styles.ring}`)}>
                <div className="text-center mb-6">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    {t.priceLabel}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-display text-5xl font-bold">
                      {formatPrice(pass.price, pass.currency, locale)}
                    </span>
                    <span className="text-sm text-muted-foreground">{t.priceHt}</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {Math.round(pass.vatRate * 100)}% {t.vat} · {t.ttc} :{" "}
                    <span className="font-semibold text-foreground">
                      {formatPrice(priceTtc, pass.currency, locale)}
                    </span>
                  </div>
                  {pass.minQuantity > 1 && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {t.perPerson} · {t.minQty}: {pass.minQuantity}
                    </div>
                  )}
                </div>

                {pass.paymentUrl ? (
                  <a
                    href={pass.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center justify-center gap-2 w-full rounded-xl px-6 py-4 font-semibold transition-all hover:scale-[1.02] shadow-premium",
                      styles.accent,
                    )}
                  >
                    {t.register}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="rounded-xl border border-dashed border-border px-6 py-4 text-center text-sm text-muted-foreground">
                    {t.registrationSoon}
                  </div>
                )}

                <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  {t.guarantee} · BusinessRoom
                </p>

                {/* Back link */}
                <Link
                  href="/pass-duo"
                  className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  {t.backToPasses}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Other passes */}
        {otherPasses.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border">
            <h2 className="font-display text-xl font-semibold mb-6">{t.otherPasses}</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {otherPasses.map((op) => {
                const opName = locale === "en" ? op.nameEn ?? op.nameFr : op.nameFr
                const href = SLUG_TO_HREF[op.slug] ?? "/pass-duo"
                return (
                  <Link
                    key={op.id}
                    href={href}
                    className={cn(
                      "group rounded-2xl border p-5 transition-all hover:shadow-premium hover:-translate-y-0.5",
                      op.isFeatured
                        ? "border-pmo-gold/40 bg-pmo-gold/5"
                        : "border-border bg-card hover:border-primary/30",
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-semibold">{opName}</h3>
                      {op.isFeatured && <Star className="w-4 h-4 text-pmo-gold fill-current" />}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-2xl font-bold">
                        {formatPrice(op.price, op.currency, locale)}
                      </span>
                      <span className="text-xs text-muted-foreground">{t.priceHt}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                      {t.viewDetails}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
