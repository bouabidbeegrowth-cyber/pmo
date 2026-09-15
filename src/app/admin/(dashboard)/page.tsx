import Link from "next/link"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  Users,
  Clock3,
  Ticket,
  Handshake,
  Building2,
  ArrowRight,
  TrendingUp,
  Plus,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

export const dynamic = "force-dynamic"

async function getDashboardData() {
  const [activeEvent, speakerCount, sessionCount, passCount, partnerCount, organizerCount] =
    await Promise.all([
      db.event.findFirst({
        where: { isActive: true },
        orderBy: { startDate: "desc" },
      }),
      db.speaker.count(),
      db.programmeSession.count(),
      db.pass.count(),
      db.partner.count(),
      db.organizer.count(),
    ])

  const recentSpeakers = await db.speaker.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return {
    activeEvent,
    speakerCount,
    sessionCount,
    passCount,
    partnerCount,
    organizerCount,
    recentSpeakers,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  const event = data.activeEvent

  const now = new Date()
  const countdownTarget = event?.countdownTarget ?? event?.startDate
  const eventState: "upcoming" | "live" | "ended" =
    event && event.endDate && event.endDate < now
      ? "ended"
      : event && event.startDate <= now && (!event.endDate || event.endDate >= now)
        ? "live"
        : "upcoming"

  const stats = [
    {
      label: "Speakers",
      value: data.speakerCount,
      icon: Users,
      href: "/admin/speakers",
      color: "from-violet-500 to-purple-600",
    },
    {
      label: "Sessions",
      value: data.sessionCount,
      icon: Clock3,
      href: "/admin/programme",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Passes",
      value: data.passCount,
      icon: Ticket,
      href: "/admin/passes",
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Partenaires",
      value: data.partnerCount,
      icon: Handshake,
      href: "/admin/partners",
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Organisateurs",
      value: data.organizerCount,
      icon: Building2,
      href: "/admin/organizers",
      color: "from-pink-500 to-rose-500",
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble de votre événement PMO Mastery.
          </p>
        </div>
        <Button asChild className="bg-pmo-violet-gradient text-white shadow-premium">
          <Link href="/admin/event">
            <Plus className="w-4 h-4 mr-2" />
            Gérer l'événement
          </Link>
        </Button>
      </div>

      {/* Active event banner */}
      {event ? (
        <Card className="overflow-hidden border-0 shadow-premium">
          <div className="relative bg-pmo-navy-gradient text-white p-6 sm:p-8">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-pmo-violet/30 blur-3xl" />
            <div className="relative grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge
                    className={
                      eventState === "live"
                        ? "bg-emerald-500 text-white"
                        : eventState === "ended"
                          ? "bg-zinc-500 text-white"
                          : "bg-pmo-gold text-pmo-navy"
                    }
                  >
                    {eventState === "live"
                      ? "En cours"
                      : eventState === "ended"
                        ? "Terminé"
                        : "À venir"}
                  </Badge>
                  <span className="text-white/70 text-sm">{event.editionName}</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                  {event.titleFr}
                </h2>
                {event.subtitleFr && (
                  <p className="text-white/70 text-base">{event.subtitleFr}</p>
                )}
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    {format(event.startDate, "dd MMMM yyyy", { locale: fr })}
                    {event.endDate && ` → ${format(event.endDate, "dd MMMM yyyy", { locale: fr })}`}
                  </div>
                  {event.venue && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {event.venue}
                      {event.city ? `, ${event.city}` : ""}
                    </div>
                  )}
                </div>
              </div>

              {countdownTarget && eventState === "upcoming" && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="text-xs uppercase tracking-widest text-white/60 mb-1">
                    Compte à rebours
                  </div>
                  <div className="font-display text-3xl font-bold tabular-nums">
                    {Math.max(0, Math.ceil((countdownTarget.getTime() - now.getTime()) / 86400000))}
                  </div>
                  <div className="text-sm text-white/70 mt-1">jours restants</div>
                </div>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="border-dashed border-2 bg-amber-50/50">
          <CardContent className="p-8 text-center">
            <CalendarDays className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="font-display text-lg font-semibold">Aucun événement actif</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              Créez votre premier événement PMO Mastery pour commencer.
            </p>
            <Button asChild className="bg-pmo-violet-gradient text-white">
              <Link href="/admin/event">
                <Plus className="w-4 h-4 mr-2" />
                Créer un événement
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group bg-white rounded-2xl p-4 sm:p-5 shadow-premium hover:shadow-premium-lg transition-all hover:-translate-y-0.5"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3 shadow-sm`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold tabular-nums">
                {s.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</div>
            </Link>
          )
        })}
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-premium">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="font-display text-lg">Speakers récents</CardTitle>
            <Link
              href="/admin/speakers"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              Voir tout
              <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentSpeakers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Aucun speaker pour le moment.
              </div>
            ) : (
              <div className="divide-y">
                {data.recentSpeakers.map((sp) => (
                  <Link
                    key={sp.id}
                    href={`/admin/speakers/${sp.id}`}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-muted/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                      {sp.photo ? (
                         
                        <img
                          src={sp.photo}
                          alt={sp.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-semibold bg-pmo-violet-gradient text-white">
                          {sp.firstName.charAt(0)}
                          {sp.lastName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {sp.firstName} {sp.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {sp.positionFr ?? sp.positionEn ?? "—"}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {formatDistanceToNow(sp.createdAt, { addSuffix: true, locale: fr })}
                    </div>
                    <Badge variant={sp.isActive ? "default" : "secondary"} className="text-xs">
                      {sp.isActive ? "Actif" : "Masqué"}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-premium">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Accès rapide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Ajouter un speaker", href: "/admin/speakers/new", icon: Users },
              { label: "Ajouter une session", href: "/admin/programme", icon: Clock3 },
              { label: "Gérer les passes", href: "/admin/passes", icon: Ticket },
              { label: "Ajouter un partenaire", href: "/admin/partners", icon: Handshake },
              { label: "Modifier le contenu", href: "/admin/content", icon: Building2 },
            ].map((a) => {
              const Icon = a.icon
              return (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium flex-1">{a.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
