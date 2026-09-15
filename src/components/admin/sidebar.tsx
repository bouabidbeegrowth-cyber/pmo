"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Clock3,
  Ticket,
  Building2,
  Handshake,
  FileText,
  UserCog,
  Search,
  MessageSquareText,
  ArrowRightLeft,
  Images,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Pilotage",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Événement", href: "/admin/event", icon: CalendarDays },
    ],
  },
  {
    label: "Contenu",
    items: [
      { label: "Speakers", href: "/admin/speakers", icon: Users },
      { label: "Programme", href: "/admin/programme", icon: Clock3 },
      { label: "Passes", href: "/admin/passes", icon: Ticket },
      { label: "Galerie", href: "/admin/gallery", icon: Images },
      { label: "CMS", href: "/admin/content", icon: FileText },
      { label: "SEO", href: "/admin/seo", icon: Search },
      { label: "Redirections", href: "/admin/redirects", icon: ArrowRightLeft },
    ],
  },
  {
    label: "Organisation",
    items: [
      { label: "Organisateurs", href: "/admin/organizers", icon: Building2 },
      { label: "Partenaires", href: "/admin/partners", icon: Handshake },
      { label: "Popups", href: "/admin/popups", icon: MessageSquareText },
    ],
  },
  {
    label: "Système",
    items: [{ label: "Utilisateurs", href: "/admin/users", icon: UserCog }],
  },
]

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-72 flex-col bg-pmo-navy-gradient text-white">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-white/5 shrink-0">
        <Link href="/admin" className="flex items-center gap-3 group" onClick={onNavigate}>
          <div className="w-9 h-9 rounded-xl bg-pmo-violet-gradient flex items-center justify-center font-display font-bold text-base shadow-premium group-hover:scale-105 transition-transform">
            P
          </div>
          <div className="leading-tight">
            <div className="font-display font-semibold text-base tracking-tight">PMO Mastery</div>
            <div className="text-[10px] text-white/50 uppercase tracking-widest">Back Office</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href))
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                      active
                        ? "bg-pmo-violet-gradient text-white shadow-premium"
                        : "text-white/70 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 font-medium">{item.label}</span>
                    {active && <ChevronRight className="w-4 h-4 opacity-70" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/5 p-3 shrink-0 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Voir le site
        </Link>
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full justify-start text-white/60 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Déconnexion
        </Button>
      </div>
    </aside>
  )
}
