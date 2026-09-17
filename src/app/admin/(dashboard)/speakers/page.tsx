"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  Users,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Speaker {
  id: string
  slug: string
  firstName: string
  lastName: string
  photo?: string | null
  positionFr?: string | null
  positionEn?: string | null
  company?: string | null
  country?: string | null
  isFeatured: boolean
  isActive: boolean
  displayOrder: number
}

export default function SpeakersListPage() {
  const [loading, setLoading] = useState(true)
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "hidden">("all")
  const [toDelete, setToDelete] = useState<Speaker | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/speakers")
      const json = await res.json()
      setSpeakers(json)
    } catch {
      toast.error("Échec du chargement.")
    } finally {
      setLoading(false)
    }
  }

  async function toggleActive(sp: Speaker) {
    const next = !sp.isActive
    setSpeakers((prev) =>
      prev.map((s) => (s.id === sp.id ? { ...s, isActive: next } : s)),
    )
    try {
      await fetch(`/api/admin/speakers/${sp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sp, isActive: next }),
      })
      toast.success(next ? "Speaker activé." : "Speaker masqué.")
    } catch {
      toast.error("Échec de la mise à jour.")
      setSpeakers((prev) => prev.map((s) => (s.id === sp.id ? { ...s, isActive: !next } : s)))
    }
  }

  async function move(sp: Speaker, direction: -1 | 1) {
    const sorted = [...speakers].sort((a, b) => a.displayOrder - b.displayOrder)
    const idx = sorted.findIndex((s) => s.id === sp.id)
    const swapWith = sorted[idx + direction]
    if (!swapWith) return
    // Swap displayOrders
    await Promise.all([
      fetch(`/api/admin/speakers/${sp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sp, displayOrder: swapWith.displayOrder }),
      }),
      fetch(`/api/admin/speakers/${swapWith.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...swapWith, displayOrder: sp.displayOrder }),
      }),
    ])
    await load()
  }

  async function confirmDelete() {
    if (!toDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/speakers/${toDelete.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed")
      toast.success("Speaker supprimé.")
      setToDelete(null)
      await load()
    } catch {
      toast.error("Échec de la suppression.")
    } finally {
      setDeleting(false)
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return speakers
      .filter((s) => {
        if (filter === "active" && !s.isActive) return false
        if (filter === "hidden" && s.isActive) return false
        if (!q) return true
        const full = `${s.firstName} ${s.lastName} ${s.positionFr ?? ""} ${s.company ?? ""}`.toLowerCase()
        return full.includes(q)
      })
      .sort((a, b) => a.displayOrder - b.displayOrder)
  }, [speakers, search, filter])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Speakers"
        description={`${speakers.length} intervenant${speakers.length > 1 ? "s" : ""} au total.`}
        actions={
          <Button asChild className="bg-pmo-violet-gradient text-white">
            <Link href="/admin/speakers/new">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Link>
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un speaker…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-white shadow-premium"
          />
        </div>
        <div className="flex gap-1 bg-white rounded-lg p-1 shadow-premium">
          {([
            ["all", "Tous"],
            ["active", "Actifs"],
            ["hidden", "Masqués"],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-premium overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Users className="w-12 h-12 text-muted-foreground/50 mb-3" />
            <h3 className="font-display text-lg font-semibold">Aucun speaker</h3>
            <p className="text-muted-foreground text-sm mt-1 mb-4">
              {search || filter !== "all"
                ? "Aucun résultat pour ces filtres."
                : "Commencez par ajouter votre premier intervenant."}
            </p>
            <Button asChild className="bg-pmo-violet-gradient text-white">
              <Link href="/admin/speakers/new">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un speaker
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3 w-12">Ordre</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3">Speaker</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3 hidden md:table-cell">Position</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3 hidden lg:table-cell">Entreprise</th>
                  <th className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3">Actif</th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((sp, idx) => (
                  <tr key={sp.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => move(sp, -1)}
                          disabled={idx === 0}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => move(sp, 1)}
                          disabled={idx === filtered.length - 1}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                          {sp.photo ? (
                             
                            <img src={sp.photo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-semibold bg-pmo-violet-gradient text-white">
                              {sp.firstName.charAt(0)}
                              {sp.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/speakers/${sp.id}`}
                            className="font-medium text-sm hover:text-primary truncate block"
                          >
                            {sp.firstName} {sp.lastName}
                          </Link>
                          {sp.country && (
                            <div className="text-xs text-muted-foreground">{sp.country}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {sp.positionFr ?? "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="text-sm text-muted-foreground truncate max-w-[160px]">
                        {sp.company ?? "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Switch checked={sp.isActive} onCheckedChange={() => toggleActive(sp)} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/speakers/${sp.id}`}
                          className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-primary"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setToDelete(sp)}
                          className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce speaker ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le speaker{" "}
              <strong>
                {toDelete?.firstName} {toDelete?.lastName}
              </strong>{" "}
              sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Suppression…" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
