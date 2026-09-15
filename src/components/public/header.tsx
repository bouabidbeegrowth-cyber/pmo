"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface HeaderProps {
  locale: "fr" | "en"
  onLocaleChange?: (l: "fr" | "en") => void
  registrationEnabled: boolean
  logo?: string | null
}

const NAV_FR = [
  { href: "#hero", label: "Accueil" },
  { href: "#about", label: "À propos" },
  { href: "#speakers", label: "Intervenants" },
  { href: "#programme", label: "Programme" },
  { href: "#passes", label: "Passes" },
  { href: "#partners", label: "Partenaires" },
  { href: "#contact", label: "Contact" },
]
const NAV_EN = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#speakers", label: "Speakers" },
  { href: "#programme", label: "Programme" },
  { href: "#passes", label: "Passes" },
  { href: "#partners", label: "Partners" },
  { href: "#contact", label: "Contact" },
]

export function Header({ locale, onLocaleChange, registrationEnabled, logo }: HeaderProps) {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const nav = locale === "fr" ? NAV_FR : NAV_EN

  function changeLocale(next: "fr" | "en") {
    if (next === locale) return
    document.cookie = `pmo_locale=${next};path=/;max-age=31536000`
    try {
      localStorage.setItem("pmo_locale", next)
    } catch {}
    onLocaleChange?.(next)
    router.refresh()
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-pmo-navy-gradient/95 backdrop-blur-md shadow-premium py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="#hero" className="flex items-center gap-3 group">
          {logo ? (
             
            <img src={logo} alt="PMO Mastery" className="h-10 w-auto" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-pmo-violet-gradient flex items-center justify-center font-display font-bold text-white text-base shadow-premium group-hover:scale-105 transition-transform">
                P
              </div>
              <span className="font-display font-semibold text-white text-lg tracking-tight">
                PMO Mastery
              </span>
            </div>
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm text-white/80 hover:text-white transition-colors relative group"
            >
              {item.label}
              <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-pmo-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-white/10 border border-white/10 p-0.5 backdrop-blur-sm">
            <Globe className="w-3.5 h-3.5 text-white/50 ml-2" />
            <button
              onClick={() => changeLocale("fr")}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                locale === "fr" ? "bg-white text-pmo-navy" : "text-white/70 hover:text-white"
              }`}
            >
              FR
            </button>
            <button
              onClick={() => changeLocale("en")}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                locale === "en" ? "bg-white text-pmo-navy" : "text-white/70 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          {registrationEnabled && (
            <Button
              asChild
              className="hidden sm:flex bg-pmo-gold-gradient text-pmo-navy hover:opacity-90 font-semibold shadow-premium"
            >
              <Link href="#passes">{locale === "fr" ? "Je m'inscris" : "Register"}</Link>
            </Button>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/10"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0 bg-pmo-navy-gradient border-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full text-white p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display font-semibold text-lg">PMO Mastery</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1 text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="flex flex-col gap-1">
                  {nav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                {registrationEnabled && (
                  <Button
                    asChild
                    className="mt-auto bg-pmo-gold-gradient text-pmo-navy hover:opacity-90 font-semibold"
                  >
                    <Link href="#passes" onClick={() => setMobileOpen(false)}>
                      {locale === "fr" ? "Je m'inscris" : "Register"}
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
