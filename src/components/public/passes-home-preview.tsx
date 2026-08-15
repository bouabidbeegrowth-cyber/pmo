"use client"

import { Check, ArrowRight } from "lucide-react"
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

interface Props {
  passes: Pass[]
  locale: Locale
}

const SLUG_TO_HREF: Record<string, string> = {
  "pass-evenement": "/pass-evenement",
  "pass-formation": "/pass-formation",
  "pass-duo": "/pass-duo",
  "pass-etudiant": "/pass-evenement",
  "pass-equipe": "/pass-evenement",
}

export function PassesHomePreview({ passes, locale }: Props) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {passes.map((pass) => {
        const name = locale === "en" ? pass.nameEn ?? pass.nameFr : pass.nameFr
        const description = locale === "en"
          ? pass.descriptionEn ?? pass.descriptionFr
          : pass.descriptionFr
        const features = parseFeatures(
          locale === "en" ? pass.featuresEn ?? pass.featuresFr : pass.featuresFr,
        )
        const priceTtc = pass.price + pass.price * pass.vatRate
        const detailHref = SLUG_TO_HREF[pass.slug] ?? "/pass-duo"

        return (
          <div
            key={pass.id}
            className={cn(
              "relative rounded-3xl p-6 sm:p-8 flex flex-col transition-all",
              pass.isFeatured
                ? "bg-white text-pmo-navy shadow-premium-lg lg:scale-105 ring-2 ring-pmo-gold"
                : "bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.08]",
            )}
          >
            {pass.isFeatured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-pmo-gold-gradient text-pmo-navy text-[10px] font-bold uppercase tracking-wider px-4 py-1 shadow-premium">
                ★ {locale === "fr" ? "Recommandé" : "Recommended"}
              </div>
            )}

            <h3 className={cn("font-display text-xl font-bold mb-1", !pass.isFeatured && "text-white")}>
              {name}
            </h3>
            {description && (
              <p className={cn("text-sm mb-4", pass.isFeatured ? "text-muted-foreground" : "text-white/60")}>
                {description}
              </p>
            )}

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className={cn("font-display text-4xl font-bold", !pass.isFeatured && "text-white")}>
                  {formatPrice(pass.price, pass.currency, locale)}
                </span>
                <span className={cn("text-xs", pass.isFeatured ? "text-muted-foreground" : "text-white/50")}>
                  HT
                </span>
              </div>
              <div className={cn("text-xs mt-1", pass.isFeatured ? "text-muted-foreground" : "text-white/50")}>
                {Math.round(pass.vatRate * 100)}% TVA · TTC : {formatPrice(priceTtc, pass.currency, locale)}
              </div>
            </div>

            {features.length > 0 && (
              <ul className="space-y-2 mb-6 flex-1">
                {features.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span
                      className={cn(
                        "shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5",
                        pass.isFeatured ? "bg-pmo-violet/10 text-pmo-violet" : "bg-pmo-gold/20 text-pmo-gold",
                      )}
                    >
                      <Check className="w-3 h-3" />
                    </span>
                    <span className={pass.isFeatured ? "text-foreground/80" : "text-white/80"}>{f}</span>
                  </li>
                ))}
              </ul>
            )}

            <Link
              href={detailHref}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all hover:scale-[1.02]",
                pass.isFeatured
                  ? "bg-pmo-violet-gradient text-white shadow-premium"
                  : "bg-pmo-gold-gradient text-pmo-navy",
              )}
            >
              {locale === "fr" ? "Voir les détails" : "View details"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}
