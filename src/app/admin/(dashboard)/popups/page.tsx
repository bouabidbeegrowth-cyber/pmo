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
import { Loader2, Plus, Save, Pencil, Trash2, MessageSquareText, AlertTriangle, GripVertical } from "lucide-react"
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"

interface Popup {
  id: string
  name: string
  photo?: string | null
  messageFr: string
  messageEn?: string | null
  ctaUrl?: string | null
  isActive: boolean
  displayOrder: number
}

const EMPTY: Omit<Popup, "id"> = {
  name: "",
  photo: null,
  messageFr: "",
  messageEn: "",
  ctaUrl: "",
  isActive: true,
  displayOrder: 0,
}

export default function PopupsPage() {
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<Popup[]>([])
  const [editing, setEditing] = useState<Popup | (Omit<Popup, "id"> & { id?: string }) | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/popups")
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

  function startEdit(p: Popup) {
    setEditing(p)
    setOpen(true)
  }

  async function save() {
    if (!editing) return
    if (!editing.name.trim()) {
      toast.error("Le nom est obligatoire.")
      return
    }
    if (!editing.messageFr.trim()) {
      toast.error("Le message (FR) est obligatoire.")
      return
    }
    setSaving(true)
    try {
      const isEdit = "id" in editing && editing.id
      const res = await fetch(
        isEdit ? `/api/admin/popups/${editing.id}` : "/api/admin/popups",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
        },
      )
      if (!res.ok) throw new Error("Failed")
      toast.success(isEdit ? "Popup mis à jour." : "Popup créé.")
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
      const res = await fetch(`/api/admin/popups/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed")
      toast.success("Popup supprimé.")
      await load()
    } catch {
      toast.error("Échec de la suppression.")
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = list.findIndex((p) => p.id === active.id)
    const newIndex = list.findIndex((p) => p.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    const reordered = arrayMove(list, oldIndex, newIndex).map((p, idx) => ({
      ...p,
      displayOrder: idx,
    }))
    setList(reordered)

    await Promise.all(
      reordered.map((p) =>
        fetch(`/api/admin/popups/${p.id}`, {
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Popups"
        description="Bulles d'annonce (photo, nom, message) qui apparaissent tour à tour sur le site public."
        actions={
          <Button onClick={startNew} className="bg-pmo-violet-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        }
      />

      {list.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-premium flex flex-col items-center justify-center h-64 text-center">
          <MessageSquareText className="w-12 h-12 text-muted-foreground/50 mb-3" />
          <h3 className="font-display text-lg font-semibold">Aucun popup</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            Ajoutez votre premier popup.
          </p>
          <Button onClick={startNew} className="bg-pmo-violet-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={list.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {list.map((p) => (
                <SortablePopupRow
                  key={p.id}
                  popup={p}
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
              {editing && "id" in editing && editing.id ? "Modifier" : "Nouveau"} popup
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <Field label="Nom" required>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="Yosra Torjmen"
                />
              </Field>

              <ImageUploader
                label="Photo"
                value={editing.photo}
                onChange={(url) => setEditing({ ...editing, photo: url })}
                aspectRatio="square"
              />

              <Field label="Lien (optionnel)">
                <Input
                  value={editing.ctaUrl ?? ""}
                  onChange={(e) => setEditing({ ...editing, ctaUrl: e.target.value })}
                  placeholder="/passes"
                />
              </Field>

              <Tabs defaultValue="fr">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="fr">🇫🇷 FR</TabsTrigger>
                  <TabsTrigger value="en">🇬🇧 EN</TabsTrigger>
                </TabsList>
                <TabsContent value="fr">
                  <Field label="Message (FR)" required>
                    <Textarea
                      value={editing.messageFr}
                      onChange={(e) => setEditing({ ...editing, messageFr: e.target.value })}
                      rows={2}
                      placeholder="Ne manquez pas cet atelier PMO exclusif !"
                    />
                  </Field>
                </TabsContent>
                <TabsContent value="en">
                  <Field label="Message (EN)">
                    <Textarea
                      value={editing.messageEn ?? ""}
                      onChange={(e) => setEditing({ ...editing, messageEn: e.target.value })}
                      rows={2}
                      placeholder="Don't miss this exclusive PMO workshop!"
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

function SortablePopupRow({
  popup: p,
  onEdit,
  onDelete,
}: {
  popup: Popup
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
        "bg-white rounded-2xl shadow-premium p-4 flex items-center gap-3 group",
        isDragging && "opacity-50 shadow-premium-lg ring-2 ring-primary z-10",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 rounded-md text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing touch-none shrink-0"
        aria-label="Réordonner"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-muted flex items-center justify-center">
        {p.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-display font-bold text-muted-foreground">{p.name.charAt(0)}</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold truncate">{p.name}</span>
          {!p.isActive && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Inactif
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{p.messageFr}</p>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-primary"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="mx-auto sm:mx-0 flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                  {p.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <MessageSquareText className="w-6 h-6 text-muted-foreground/50" />
                  )}
                </div>
                <div className="min-w-0">
                  <AlertDialogTitle className="truncate">{p.name}</AlertDialogTitle>
                </div>
              </div>
              <AlertDialogDescription className="flex items-start gap-2 pt-2">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <span>
                  Ce popup sera définitivement supprimé{p.photo ? ", ainsi que sa photo" : ""}.
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
  )
}
