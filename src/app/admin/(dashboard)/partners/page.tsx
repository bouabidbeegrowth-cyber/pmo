"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2, Plus, Save, Pencil, Trash2, Handshake, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface Partner {
  id: string
  name: string
  logo?: string | null
  category: string
  websiteUrl?: string | null
  descriptionFr?: string | null
  descriptionEn?: string | null
  isActive: boolean
  displayOrder: number
}

const CATEGORIES: Record<string, { label: string; color: string }> = {
  STRATEGIC: { label: "Stratégique", color: "bg-violet-100 text-violet-700" },
  DIAMOND: { label: "Diamond", color: "bg-cyan-100 text-cyan-700" },
  GOLD: { label: "Gold", color: "bg-amber-100 text-amber-700" },
  SILVER: { label: "Silver", color: "bg-zinc-100 text-zinc-700" },
  MEDIA: { label: "Média", color: "bg-blue-100 text-blue-700" },
  INSTITUTIONAL: { label: "Institutionnel", color: "bg-emerald-100 text-emerald-700" },
  PARTNER: { label: "Partenaire", color: "bg-zinc-100 text-zinc-700" },
}

const EMPTY: Omit<Partner, "id"> = {
  name: "",
  logo: null,
  category: "PARTNER",
  websiteUrl: "",
  descriptionFr: "",
  descriptionEn: "",
  isActive: true,
  displayOrder: 0,
}

export default function PartnersPage() {
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<Partner[]>([])
  const [editing, setEditing] = useState<Partner | (Omit<Partner, "id"> & { id?: string }) | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/partners")
      const json = await res.json()
      setList(json)
    } catch {
      toast.error("Échec du chargement.")
    } finally {
      setLoading(false)
    }
  }

  function startNew() {
    setEditing({ ...EMPTY })
    setOpen(true)
  }

  function startEdit(p: Partner) {
    setEditing(p)
    setOpen(true)
  }

  async function save() {
    if (!editing) return
    if (!editing.name) {
      toast.error("Le nom est obligatoire.")
      return
    }
    setSaving(true)
    try {
      const isEdit = "id" in editing && editing.id
      const res = await fetch(
        isEdit ? `/api/admin/partners/${editing.id}` : "/api/admin/partners",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
        },
      )
      if (!res.ok) throw new Error("Failed")
      toast.success(isEdit ? "Partenaire mis à jour." : "Partenaire créé.")
      setOpen(false)
      setEditing(null)
      await load()
    } catch {
      toast.error("Échec de l'enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce partenaire ?")) return
    try {
      await fetch(`/api/admin/partners/${id}`, { method: "DELETE" })
      toast.success("Partenaire supprimé.")
      await load()
    } catch {
      toast.error("Échec de la suppression.")
    }
  }

  const filtered = list.filter((p) => filter === "all" || p.category === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Partenaires"
        description={`${list.length} partenaire${list.length > 1 ? "s" : ""}.`}
        actions={
          <Button onClick={startNew} className="bg-pmo-violet-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        }
      />

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            filter === "all" ? "bg-primary text-primary-foreground" : "bg-white text-muted-foreground hover:text-foreground shadow-premium"
          }`}
        >
          Tous ({list.length})
        </button>
        {Object.entries(CATEGORIES).map(([k, v]) => {
          const count = list.filter((p) => p.category === k).length
          if (count === 0) return null
          return (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                filter === k ? "bg-primary text-primary-foreground" : "bg-white text-muted-foreground hover:text-foreground shadow-premium"
              }`}
            >
              {v.label} ({count})
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-premium flex flex-col items-center justify-center h-64 text-center">
          <Handshake className="w-12 h-12 text-muted-foreground/50 mb-3" />
          <h3 className="font-display text-lg font-semibold">Aucun partenaire</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            Ajoutez votre premier partenaire.
          </p>
          <Button onClick={startNew} className="bg-pmo-violet-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => {
            const cat = CATEGORIES[p.category] ?? CATEGORIES.PARTNER
            return (
              <div key={p.id} className="bg-white rounded-2xl shadow-premium p-5 group">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={cat.color} variant="secondary">
                    {cat.label}
                  </Badge>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(p)}
                      className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-primary"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="p-1 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="aspect-[3/2] bg-muted rounded-lg overflow-hidden flex items-center justify-center mb-3">
                  {p.logo ? (
                     
                    <img src={p.logo} alt={p.name} className="w-full h-full object-contain p-3" />
                  ) : (
                    <Handshake className="w-8 h-8 text-muted-foreground/50" />
                  )}
                </div>
                <div className="font-display font-semibold text-center truncate">{p.name}</div>
                {p.websiteUrl && (
                  <a
                    href={p.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center justify-center gap-1 mt-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Site web
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Editor */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing && "id" in editing && editing.id ? "Modifier" : "Nouveau"} partenaire
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nom" required>
                  <Input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  />
                </Field>
                <Field label="Catégorie">
                  <Select
                    value={editing.category}
                    onValueChange={(v) => setEditing({ ...editing, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORIES).map(([k, v]) => (
                        <SelectItem key={k} value={k}>
                          {v.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <ImageUploader
                label="Logo"
                value={editing.logo}
                onChange={(url) => setEditing({ ...editing, logo: url })}
                aspectRatio="video"
              />

              <Field label="Site web">
                <Input
                  value={editing.websiteUrl ?? ""}
                  onChange={(e) => setEditing({ ...editing, websiteUrl: e.target.value })}
                  placeholder="https://…"
                />
              </Field>

              <Field label="Description (FR)">
                <Textarea
                  value={editing.descriptionFr ?? ""}
                  onChange={(e) => setEditing({ ...editing, descriptionFr: e.target.value })}
                  rows={3}
                />
              </Field>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <Label className="text-sm">Actif</Label>
                <Switch
                  checked={editing.isActive}
                  onCheckedChange={(v) => setEditing({ ...editing, isActive: v })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={save} disabled={saving} className="bg-pmo-violet-gradient text-white">
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
    </div>
  )
}
