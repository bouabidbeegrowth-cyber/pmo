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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Plus, Save, Pencil, Trash2, Handshake, ExternalLink, AlertTriangle, GripVertical } from "lucide-react"
import { toast } from "sonner"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"

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
  BRONZE: { label: "Bronze", color: "bg-orange-100 text-orange-700" },
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
    try {
      const res = await fetch(`/api/admin/partners/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed")
      toast.success("Partenaire supprimé.")
      await load()
    } catch {
      toast.error("Échec de la suppression.")
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const filtered = list.filter((p) => filter === "all" || p.category === filter)

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = filtered.findIndex((p) => p.id === active.id)
    const newIndex = filtered.findIndex((p) => p.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    const reordered = arrayMove(filtered, oldIndex, newIndex).map((p, idx) => ({
      ...p,
      displayOrder: idx,
    }))

    // Optimistic update: splice the reordered subset back into the full
    // list, then re-sort so it matches what the API would return.
    setList((prev) => {
      const byId = new Map(reordered.map((p) => [p.id, p]))
      const merged = prev.map((p) => byId.get(p.id) ?? p)
      return [...merged].sort(
        (a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name),
      )
    })

    await Promise.all(
      reordered.map((p) =>
        fetch(`/api/admin/partners/${p.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        }),
      ),
    )
  }

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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={filtered.map((p) => p.id)} strategy={rectSortingStrategy}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <SortablePartnerCard
                  key={p.id}
                  partner={p}
                  category={CATEGORIES[p.category] ?? CATEGORIES.PARTNER}
                  onEdit={() => startEdit(p)}
                  onDelete={() => remove(p.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Editor */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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

              <Tabs defaultValue="fr">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="fr">🇫🇷 FR</TabsTrigger>
                  <TabsTrigger value="en">🇬🇧 EN</TabsTrigger>
                </TabsList>
                <TabsContent value="fr">
                  <Field label="Description (FR)">
                    <Textarea
                      value={editing.descriptionFr ?? ""}
                      onChange={(e) => setEditing({ ...editing, descriptionFr: e.target.value })}
                      rows={3}
                    />
                  </Field>
                </TabsContent>
                <TabsContent value="en">
                  <Field label="Description (EN)">
                    <Textarea
                      value={editing.descriptionEn ?? ""}
                      onChange={(e) => setEditing({ ...editing, descriptionEn: e.target.value })}
                      rows={3}
                    />
                  </Field>
                </TabsContent>
              </Tabs>

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

function SortablePartnerCard({
  partner: p,
  category: cat,
  onEdit,
  onDelete,
}: {
  partner: Partner
  category: { label: string; color: string }
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: p.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white rounded-2xl shadow-premium p-5 group relative",
        isDragging && "opacity-50 shadow-premium-lg ring-2 ring-primary z-10",
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1">
          <button
            {...attributes}
            {...listeners}
            className="p-1 -ml-1 rounded-md text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing touch-none opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Réordonner"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <Badge className={cat.color} variant="secondary">
            {cat.label}
          </Badge>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-primary"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="p-1 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <div className="mx-auto sm:mx-0 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                    {p.logo ? (

                      <img src={p.logo} alt={p.name} className="w-full h-full object-contain p-1.5" />
                    ) : (
                      <Handshake className="w-6 h-6 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <AlertDialogTitle className="truncate">{p.name}</AlertDialogTitle>
                    <Badge className={cat.color} variant="secondary">
                      {cat.label}
                    </Badge>
                  </div>
                </div>
                <AlertDialogDescription className="flex items-start gap-2 pt-2">
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <span>
                    Ce partenaire sera définitivement supprimé{p.logo ? ", ainsi que son logo" : ""}.
                    Cette action est irréversible.
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer définitivement
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
}
