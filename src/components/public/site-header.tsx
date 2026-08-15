"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Globe, ChevronDown, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface HeaderProps {
  locale: "fr" | "en"
  onLocaleChange?: (l: "fr" | "en") => void
  registrationEnabled: boolean
  logo?: string | null
}

// Multi-page navigation — mirrors the original PMO Mastery site menu exactly
const NAV_FR = [
  { href: "/", label: "Accueil" },
  {
    label: "Événement",
    href: "/evenement",
    children: [
      { href: "/programme", label: "Programme" },
      { href: "/pass-evenement", label: "Pass Événement" },
      { href: "/pass-formation", label: "Pass Formation" },
      { href: "/pass-duo", label: "Pass Duo" },
    ],
  },
  { href: "/intervenants", label: "Intervenants" },
  {
    label: "Organisateurs & Partenaires",
    href: "/organisateurs",
    children: [
      { href: "/organisateurs", label: "Organisateurs" },
      { href: "/partenaires", label: "Partenaires" },
    ],
  },
  { href: "/contact", label: "Contact" },
]
const NAV_EN = [
  { href: "/", label: "Home" },
  {
    label: "Event",
    href: "/evenement",
    children: [
      { href: "/programme", label: "Programme" },
      { href: "/pass-evenement", label: "Event Pass" },
      { href: "/pass-formation", label: "Training Pass" },
      { href: "/pass-duo", label: "Duo Pass" },
    ],
  },
  { href: "/intervenants", label: "Speakers" },
  {
    label: "Organizers & Partners",
    href: "/organisateurs",
    children: [
      { href: "/organisateurs", label: "Organizers" },
      { href: "/partenaires", label: "Partners" },
    ],
  },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader({ locale, onLocaleChange, registrationEnabled, logo }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu on route change (pathname changes via Link clicks)
  useEffect(() => {
    if (!mobileOpen) return
    // when the route changes, the Sheet onOpenChange will handle closing;
    // this is a safety net for back/forward navigation
    const handler = () => setMobileOpen(false)
    window.addEventListener("popstate", handler)
    return () => window.removeEventListener("popstate", handler)
  }, [pathname, mobileOpen])

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

  // Determine if a link is active
  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  // Determine if any child of a dropdown is active
  function isDropdownActive(children?: { href: string }[]) {
    if (!children) return false
    return children.some((c) => isActive(c.href))
  }

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled || pathname !== "/"
          ? "bg-pmo-navy-gradient/95 backdrop-blur-md shadow-premium py-3"
          : "bg-transparent py-5",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
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

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => {
            if (item.children) {
              const active = isDropdownActive(item.children) || (item.href && isActive(item.href))
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "px-3 py-2 text-sm transition-colors relative group flex items-center gap-1",
                        active ? "text-white" : "text-white/80 hover:text-white",
                      )}
                    >
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                      <span className={cn(
                        "absolute inset-x-3 -bottom-0.5 h-0.5 bg-pmo-gold transition-transform origin-left",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="bg-pmo-navy-gradient border-white/10 min-w-[200px]"
                  >
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link
                          href={child.href}
                          className={cn(
                            "flex items-center justify-between cursor-pointer text-white/80 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white",
                            isActive(child.href) && "text-pmo-gold",
                          )}
                        >
                          {child.label}
                          {isActive(child.href) && <span className="w-1.5 h-1.5 rounded-full bg-pmo-gold" />}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm transition-colors relative group",
                  active ? "text-white" : "text-white/80 hover:text-white",
                )}
              >
                {item.label}
                <span className={cn(
                  "absolute inset-x-3 -bottom-0.5 h-0.5 bg-pmo-gold transition-transform origin-left",
                  active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                )} />
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Locale toggle */}
          <div className="flex items-center gap-1 rounded-full bg-white/10 border border-white/10 p-0.5 backdrop-blur-sm">
            <Globe className="w-3.5 h-3.5 text-white/50 ml-2" />
            <button
              onClick={() => changeLocale("fr")}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold transition-all",
                locale === "fr" ? "bg-white text-pmo-navy" : "text-white/70 hover:text-white",
              )}
            >
              FR
            </button>
            <button
              onClick={() => changeLocale("en")}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold transition-all",
                locale === "en" ? "bg-white text-pmo-navy" : "text-white/70 hover:text-white",
              )}
            >
              EN
            </button>
          </div>

          {registrationEnabled && (
            <Button
              asChild
              className="hidden sm:flex bg-pmo-gold-gradient text-pmo-navy hover:opacity-90 font-semibold shadow-premium"
            >
              <Link href="/pass-duo">
                <CalendarDays className="w-4 h-4 mr-1.5" />
                {locale === "fr" ? "Je m'inscris" : "Register"}
              </Link>
            </Button>
          )}

          {/* Mobile menu */}
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
            <SheetContent side="right" className="w-[300px] p-0 bg-pmo-navy-gradient border-0 overflow-y-auto">
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
                    <div key={item.label} className="flex flex-col">
                      <Link
                        href={item.href}
                        className={cn(
                          "px-4 py-3 rounded-lg transition-colors font-medium",
                          isActive(item.href)
                            ? "bg-white/10 text-white"
                            : "text-white/80 hover:bg-white/10 hover:text-white",
                        )}
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <div className="ml-4 border-l border-white/10 pl-2 mb-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "block px-4 py-2.5 rounded-lg text-sm transition-colors",
                                isActive(child.href)
                                  ? "text-pmo-gold font-medium"
                                  : "text-white/60 hover:text-white hover:bg-white/5",
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
                {registrationEnabled && (
                  <Button
                    asChild
                    className="mt-auto bg-pmo-gold-gradient text-pmo-navy hover:opacity-90 font-semibold"
                  >
                    <Link href="/pass-duo">
                      <CalendarDays className="w-4 h-4 mr-1.5" />
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
