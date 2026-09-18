"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

// Keep in sync with whatsapp-button.tsx's ALLOWED_PATHS — the toast sits
// higher on pages where the floating WhatsApp button is also present.
const WHATSAPP_PATHS = ["/evenement", "/programme", "/passes"]

export interface PopupItem {
  id: string
  name: string
  photo?: string | null
  message: string
  ctaUrl?: string | null
}

const INITIAL_DELAY_MS = 4000
const VISIBLE_MS = 7000
const GAP_MS = 9000
const DISMISSED_KEY = "pmo_popups_dismissed"

/**
 * Cycles through admin-managed social-proof/announcement bubbles, one at a
 * time, bottom-right. Dismissing one hides it for the rest of the browser
 * session (sessionStorage) without stopping the cycle for the others.
 */
export function SocialProofPopup({ popups }: { popups: PopupItem[] }) {
  const pathname = usePathname()
  const hasWhatsapp = WHATSAPP_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DISMISSED_KEY)
      if (raw) setDismissed(new Set(JSON.parse(raw)))
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (popups.length === 0) return

    let timer: ReturnType<typeof setTimeout>

    function showAt(i: number) {
      setIndex(i)
      setVisible(true)
      timer = setTimeout(() => {
        setVisible(false)
        timer = setTimeout(() => showAt((i + 1) % popups.length), GAP_MS)
      }, VISIBLE_MS)
    }

    timer = setTimeout(() => showAt(0), INITIAL_DELAY_MS)
    return () => clearTimeout(timer)
  }, [popups.length])

  if (popups.length === 0) return null

  const current = popups[index]
  const isDismissed = dismissed.has(current.id)

  function dismiss() {
    setVisible(false)
    setDismissed((prev) => {
      const next = new Set(prev).add(current.id)
      try {
        sessionStorage.setItem(DISMISSED_KEY, JSON.stringify([...next]))
      } catch {
        // ignore
      }
      return next
    })
  }

  const content = (
    <>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fermer"
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <div className="flex items-center gap-3 pr-5">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-white/10 border border-white/20 flex items-center justify-center">
          {current.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current.photo} alt={current.name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-display text-lg font-bold text-white">{current.name.charAt(0)}</span>
          )}
        </div>
        <div className="min-w-0">
          <div className="font-display font-semibold text-sm text-white truncate">{current.name}</div>
          <div className="text-xs text-white/80 leading-snug mt-0.5 flex items-start gap-1">
            <Sparkles className="w-3 h-3 text-pmo-gold shrink-0 mt-0.5" />
            <span>{current.message}</span>
          </div>
        </div>
      </div>
    </>
  )

  const cardClass =
    "relative rounded-2xl bg-pmo-navy-gradient border border-white/10 shadow-premium-lg p-4 pointer-events-auto max-w-[min(90vw,320px)]"

  return (
    <div className={cn("fixed right-4 z-50 pointer-events-none", hasWhatsapp ? "bottom-24" : "bottom-4")}>
      <AnimatePresence>
        {visible && !isDismissed && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {current.ctaUrl ? (
              <Link href={current.ctaUrl} className={`${cardClass} block hover:border-pmo-gold/40 transition-colors`}>
                {content}
              </Link>
            ) : (
              <div className={cardClass}>{content}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
