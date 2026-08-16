"use client"

import { Ticket, Check, ArrowRight, Star } from "lucide-react"
import { cn, formatPrice, parseFeatures } from "@/lib/utils"

interface Pass {
  id: string
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
  locale: "fr" | "en"
  title: string
  subtitle: string
  ctaLabel: string
}

export function PassesSection({ passes, locale, title, subtitle, ctaLabel }: Props) {
  return (
    <section id="passes" className="py-20 sm:py-28 bg-pmo-navy-gradient text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full bg-pmo-violet/20 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-pmo-gold/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs uppercase tracking-widest text-white/70 mb-4">
            <Ticket className="w-3.5 h-3.5" />
            {title}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">{title}</h2>
          <p className="text-white/70 text-lg">{subtitle}</p>
        </div>

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

            return (
              <div
                key={pass.id}
                className={cn(
                  "relative rounded-3xl p-6 sm:p-8 flex flex-col transition-all",
                  pass.isFeatured
                    ? "bg-white text-pmo-navy shadow-premium-lg scale-105 ring-2 ring-pmo-gold"
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
                    {features.map((f, i) => (
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

                {pass.paymentUrl ? (
                  <a
                    href={pass.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all hover:scale-[1.02]",
                      pass.isFeatured
                        ? "bg-pmo-violet-gradient text-white shadow-premium"
                        : "bg-pmo-gold-gradient text-pmo-navy",
                    )}
                  >
                    {ctaLabel}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/20 px-6 py-3 text-center text-sm text-white/40">
                    {locale === "fr" ? "Inscriptions bientôt ouvertes" : "Registration opening soon"}
                  </div>
                )}

                {pass.minQuantity > 1 && (
                  <p className={cn("text-xs text-center mt-3", pass.isFeatured ? "text-muted-foreground" : "text-white/50")}>
                    {locale === "fr" ? `Quantité min. ${pass.minQuantity}` : `Min. quantity ${pass.minQuantity}`}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
