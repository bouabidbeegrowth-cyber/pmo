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
  Ticket,
  ExternalLink,
  Star,
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
import { formatPrice } from "@/lib/utils"

const CATEGORY_LABELS: Record<string, string> = {
  EVENEMENT: "Pass Événement",
  FORMATION: "Pass Formation",
  DUO: "Pass Duo",
  ETUDIANT: "Pass Étudiant",
  AUTRE: "Autre",
}
const CATEGORY_ORDER = ["EVENEMENT", "FORMATION", "DUO", "ETUDIANT", "AUTRE"]

interface Pass {
  id: string
  slug: string
  category: string
  nameFr: string
  nameEn?: string | null
  image?: string | null
  price: number
  currency: string
  vatRate: number
  paymentUrl?: string | null
  minQuantity: number
  isFeatured: boolean
  isActive: boolean
  displayOrder: number
}

export default function PassesListPage() {
  const [loading, setLoading] = useState(true)
  const [passes, setPasses] = useState<Pass[]>([])
  const [search, setSearch] = useState("")
  const [toDelete, setToDelete] = useState<Pass | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/passes")
      const json = await res.json()
      setPasses(json)
    } catch {
      toast.error("Échec du chargement.")
    } finally {
      setLoading(false)
    }
  }

  async function toggleActive(p: Pass) {
    const next = !p.isActive
    setPasses((prev) => prev.map((x) => (x.id === p.id ? { ...x, isActive: next } : x)))
    try {
      await fetch(`/api/admin/passes/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, isActive: next }),
      })
    } catch {
      toast.error("Échec de la mise à jour.")
      setPasses((prev) => prev.map((x) => (x.id === p.id ? { ...x, isActive: !next } : x)))
    }
  }

  async function toggleFeatured(p: Pass) {
    const next = !p.isFeatured
    setPasses((prev) => prev.map((x) => (x.id === p.id ? { ...x, isFeatured: next } : x)))
    try {
      await fetch(`/api/admin/passes/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, isFeatured: next }),
      })
    } catch {
      toast.error("Échec de la mise à jour.")
    }
  }

  async function confirmDelete() {
    if (!toDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/passes/${toDelete.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed")
      toast.success("Pass supprimé.")
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
    return passes.filter((p) => !q || p.nameFr.toLowerCase().includes(q) || p.slug.includes(q))
  }, [passes, search])

  const grouped = useMemo(() => {
    const map = new Map<string, Pass[]>()
    for (const p of filtered) {
      const key = p.category || "AUTRE"
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(p)
    }
    return CATEGORY_ORDER.filter((k) => map.has(k)).map((k) => ({ key: k, label: CATEGORY_LABELS[k], items: map.get(k)! }))
  }, [filtered])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Passes"
        description={`${passes.length} pass configuré${passes.length > 1 ? "s" : ""}.`}
        actions={
          <Button asChild className="bg-pmo-violet-gradient text-white">
            <Link href="/admin/passes/new">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Link>
          </Button>
        }
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un pass…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10 bg-white shadow-premium"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-premium flex flex-col items-center justify-center h-64 text-center">
          <Ticket className="w-12 h-12 text-muted-foreground/50 mb-3" />
          <h3 className="font-display text-lg font-semibold">Aucun pass</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            Créez votre premier pass avec son lien de paiement.
          </p>
          <Button asChild className="bg-pmo-violet-gradient text-white">
            <Link href="/admin/passes/new">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un pass
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map((group) => (
            <div key={group.key}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold flex items-center gap-2">
                  {group.label}
                  <Badge variant="secondary" className="text-xs font-normal">
                    {group.items.length}
                  </Badge>
                </h2>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/passes/new?category=${group.key}`}>
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Ajouter dans cette catégorie
                  </Link>
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl shadow-premium p-5 flex flex-col relative overflow-hidden"
                  >
                    {p.isFeatured && (
                      <div className="absolute top-0 right-0 bg-pmo-gold-gradient text-pmo-navy text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg z-10">
                        Recommandé
                      </div>
                    )}
                    {p.image && (
                      <div className="-m-5 mb-3 aspect-video overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-display font-bold text-lg">{p.nameFr}</div>
                        {p.nameEn && <div className="text-xs text-muted-foreground">{p.nameEn}</div>}
                      </div>
                      <button
                        onClick={() => toggleFeatured(p)}
                        className={`p-1.5 rounded-md transition-colors ${
                          p.isFeatured ? "text-pmo-gold bg-pmo-gold/10" : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Star className={`w-4 h-4 ${p.isFeatured ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    <div className="font-display text-3xl font-bold mb-1">
                      {formatPrice(p.price, p.currency)}
                    </div>
                    <div className="text-xs text-muted-foreground mb-4">
                      +{Math.round(p.vatRate * 100)}% TVA · Qté min. {p.minQuantity}
                    </div>

                    <div className="space-y-2 mb-4 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Paiement :</span>
                        {p.paymentUrl ? (
                          <a
                            href={p.paymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 truncate max-w-[200px]"
                          >
                            Lien configuré
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Non configuré
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Switch checked={p.isActive} onCheckedChange={() => toggleActive(p)} />
                        <span className="text-xs text-muted-foreground">
                          {p.isActive ? "Actif" : "Masqué"}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Link
                          href={`/admin/passes/${p.id}`}
                          className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-primary"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setToDelete(p)}
                          className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce pass ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le pass <strong>{toDelete?.nameFr}</strong> sera définitivement supprimé.
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
