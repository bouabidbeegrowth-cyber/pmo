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
import {
  Loader2,
  Plus,
  Save,
  Pencil,
  Trash2,
  Images,
  AlertTriangle,
  GripVertical,
  Video,
  ImageIcon,
  Play,
} from "lucide-react"
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
import { parseVideoUrl } from "@/lib/video"

interface GalleryItem {
  id: string
  eventId: string
  type: "IMAGE" | "VIDEO"
  imageUrl?: string | null
  videoUrl?: string | null
  thumbnail?: string | null
  captionFr?: string | null
  captionEn?: string | null
  isActive: boolean
  displayOrder: number
}

interface EditionOption {
  id: string
  editionName: string
  titleFr: string
  startDate: string
  isActive: boolean
}

function emptyItem(eventId: string): Omit<GalleryItem, "id"> {
  return {
    eventId,
    type: "IMAGE",
    imageUrl: null,
    videoUrl: "",
    thumbnail: null,
    captionFr: "",
    captionEn: "",
    isActive: true,
    displayOrder: 0,
  }
}

export default function GalleryAdminPage() {
  const [loading, setLoading] = useState(true)
  const [editions, setEditions] = useState<EditionOption[]>([])
  const [eventId, setEventId] = useState<string>("")
  const [list, setList] = useState<GalleryItem[]>([])
  const [editing, setEditing] = useState<GalleryItem | (Omit<GalleryItem, "id"> & { id?: string }) | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void loadEditions()
  }, [])

  useEffect(() => {
    if (eventId) void loadItems(eventId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  async function loadEditions() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/event")
      const json = await res.json()
      const all: EditionOption[] = json.all ?? []
      setEditions(all)
      const active = all.find((e) => e.isActive) ?? all[0]
      if (active) setEventId(active.id)
      else setLoading(false)
    } catch {
      toast.error("Échec du chargement des éditions.")
      setLoading(false)
    }
  }

  async function loadItems(id: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/gallery?eventId=${id}`)
      const json = await res.json()
      setList(json)
    } catch {
      toast.error("Échec du chargement de la galerie.")
    } finally {
      setLoading(false)
    }
  }

  function startNew() {
    setEditing({ ...emptyItem(eventId), displayOrder: list.length })
    setOpen(true)
  }

  function startEdit(item: GalleryItem) {
    setEditing(item)
    setOpen(true)
  }

  async function save() {
    if (!editing) return
    if (editing.type === "IMAGE" && !editing.imageUrl) {
      toast.error("Ajoutez une image.")
      return
    }
    if (editing.type === "VIDEO" && !editing.videoUrl?.trim()) {
      toast.error("Le lien vidéo est obligatoire.")
      return
    }
    setSaving(true)
    try {
      const isEdit = "id" in editing && editing.id
      const res = await fetch(
        isEdit ? `/api/admin/gallery/${editing.id}` : "/api/admin/gallery",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
        },
      )
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error ?? "Failed")
      }
      toast.success(isEdit ? "Élément mis à jour." : "Élément ajouté.")
      setOpen(false)
      setEditing(null)
      await loadItems(eventId)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de l'enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed")
      toast.success("Élément supprimé.")
      await loadItems(eventId)
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
        fetch(`/api/admin/gallery/${p.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        }),
      ),
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Galerie"
        description="Photos et vidéos par édition de l'événement."
        actions={
          <Button onClick={startNew} disabled={!eventId} className="bg-pmo-violet-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        }
      />

      {editions.length > 0 && (
        <div className="flex items-center gap-3">
          <Label className="text-sm text-muted-foreground shrink-0">Édition</Label>
          <Select value={eventId} onValueChange={setEventId}>
            <SelectTrigger className="w-[280px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {editions.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.editionName} {e.isActive ? "(active)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-premium flex flex-col items-center justify-center h-64 text-center">
          <Images className="w-12 h-12 text-muted-foreground/50 mb-3" />
          <h3 className="font-display text-lg font-semibold">Aucun média</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            Ajoutez la première photo ou vidéo de cette édition.
          </p>
          <Button onClick={startNew} className="bg-pmo-violet-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={list.map((p) => p.id)} strategy={rectSortingStrategy}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {list.map((item) => (
                <SortableGalleryCard
                  key={item.id}
                  item={item}
                  onEdit={() => startEdit(item)}
                  onDelete={() => remove(item.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Editor */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing && "id" in editing && editing.id ? "Modifier" : "Nouveau"} média
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <Tabs
                value={editing.type}
                onValueChange={(v) => setEditing({ ...editing, type: v as "IMAGE" | "VIDEO" })}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="IMAGE">
                    <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                    Image
                  </TabsTrigger>
                  <TabsTrigger value="VIDEO">
                    <Video className="w-3.5 h-3.5 mr-1.5" />
                    Vidéo
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="IMAGE" className="pt-2">
                  <ImageUploader
                    label="Photo"
                    value={editing.imageUrl}
                    onChange={(url) => setEditing({ ...editing, imageUrl: url })}
                    aspectRatio="wide"
                  />
                </TabsContent>
                <TabsContent value="VIDEO" className="pt-2 space-y-4">
                  <Field label="Lien YouTube ou Vimeo" required>
                    <Input
                      value={editing.videoUrl ?? ""}
                      onChange={(e) => setEditing({ ...editing, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </Field>
                  <ImageUploader
                    label="Vignette personnalisée (optionnel)"
                    value={editing.thumbnail}
                    onChange={(url) => setEditing({ ...editing, thumbnail: url })}
                    aspectRatio="wide"
                  />
                </TabsContent>
              </Tabs>

              <Tabs defaultValue="fr">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="fr">🇫🇷 FR</TabsTrigger>
                  <TabsTrigger value="en">🇬🇧 EN</TabsTrigger>
                </TabsList>
                <TabsContent value="fr">
                  <Field label="Légende (FR)">
                    <Textarea
                      value={editing.captionFr ?? ""}
                      onChange={(e) => setEditing({ ...editing, captionFr: e.target.value })}
                      rows={2}
                      placeholder="Cérémonie d'ouverture — PMO Mastery 2025"
                    />
                  </Field>
                </TabsContent>
                <TabsContent value="en">
                  <Field label="Légende (EN)">
                    <Textarea
                      value={editing.captionEn ?? ""}
                      onChange={(e) => setEditing({ ...editing, captionEn: e.target.value })}
                      rows={2}
                      placeholder="Opening ceremony — PMO Mastery 2025"
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

function SortableGalleryCard({
  item,
  onEdit,
  onDelete,
}: {
  item: GalleryItem
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const autoThumb = item.type === "VIDEO" && item.videoUrl ? parseVideoUrl(item.videoUrl)?.thumbnailUrl : null
  const thumb = item.type === "IMAGE" ? item.imageUrl : item.thumbnail ?? autoThumb

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group bg-white rounded-2xl shadow-premium overflow-hidden",
        isDragging && "opacity-50 shadow-premium-lg ring-2 ring-primary z-10",
      )}
    >
      <div className="relative aspect-video bg-muted">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {item.type === "VIDEO" ? (
              <Video className="w-8 h-8 text-muted-foreground/40" />
            ) : (
              <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
            )}
          </div>
        )}
        {item.type === "VIDEO" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="w-4 h-4 text-pmo-navy fill-pmo-navy ml-0.5" />
            </div>
          </div>
        )}
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 p-1.5 rounded-md bg-black/40 text-white cursor-grab active:cursor-grabbing touch-none opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Réordonner"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        {!item.isActive && (
          <Badge variant="secondary" className="absolute top-2 right-2 bg-white/90 text-muted-foreground">
            Inactif
          </Badge>
        )}
      </div>
      <div className="p-3 flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground truncate flex-1">
          {item.captionFr || (item.type === "VIDEO" ? "Vidéo" : "Photo")}
        </p>
        <div className="flex gap-1 shrink-0">
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
                <AlertDialogTitle>Supprimer ce média ?</AlertDialogTitle>
                <AlertDialogDescription className="flex items-start gap-2 pt-2">
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <span>
                    Ce {item.type === "VIDEO" ? "lien vidéo" : "média"} sera définitivement supprimé.
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
    </div>
  )
}
