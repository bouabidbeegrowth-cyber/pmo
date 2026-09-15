"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
  Clock3,
  Trash2,
  Pencil,
  Calendar,
  Users,
  GripVertical,
  AlertTriangle,
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
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

interface SpeakerLite {
  id: string
  firstName: string
  lastName: string
  photo?: string | null
  positionFr?: string | null
}

interface Session {
  id: string
  startTime: string
  endTime?: string | null
  titleFr: string
  titleEn?: string | null
  titleAr?: string | null
  descriptionFr?: string | null
  descriptionEn?: string | null
  sessionType: string
  language?: string | null
  room?: string | null
  topic?: string | null
  displayOrder: number
  isActive: boolean
  speakers: { speaker: SpeakerLite }[]
  moderator?: SpeakerLite | null
}

interface Day {
  id: string
  nameFr: string
  nameEn?: string | null
  date: string
  isActive: boolean
  displayOrder: number
  sessions: Session[]
}

const SESSION_TYPES: Record<string, { label: string; color: string }> = {
  KEYNOTE: { label: "Keynote", color: "bg-violet-100 text-violet-700" },
  PANEL: { label: "Panel", color: "bg-blue-100 text-blue-700" },
  BREAK: { label: "Pause", color: "bg-amber-100 text-amber-700" },
  NETWORKING: { label: "Networking", color: "bg-emerald-100 text-emerald-700" },
  CLOSING: { label: "Clôture", color: "bg-rose-100 text-rose-700" },
  WORKSHOP: { label: "Atelier", color: "bg-cyan-100 text-cyan-700" },
  SESSION: { label: "Session", color: "bg-zinc-100 text-zinc-700" },
  PMO_TALKS: { label: "PMO Talks", color: "bg-indigo-100 text-indigo-700" },
  MASTERCLASS: { label: "Masterclass", color: "bg-fuchsia-100 text-fuchsia-700" },
}

export default function ProgrammePage() {
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState<Day[]>([])
  const [speakers, setSpeakers] = useState<SpeakerLite[]>([])
  const [activeDayId, setActiveDayId] = useState<string>("")
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false)
  const [dayDialogOpen, setDayDialogOpen] = useState(false)
  const [newDay, setNewDay] = useState({ nameFr: "", nameEn: "", date: "" })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/programme")
      const json = await res.json()
      setDays(json.days ?? [])
      setSpeakers(json.speakers ?? [])
      if (json.days?.length > 0 && !activeDayId) {
        setActiveDayId(json.days[0].id)
      }
    } catch {
      toast.error("Échec du chargement du programme.")
    } finally {
      setLoading(false)
    }
  }

  async function createDay() {
    if (!newDay.nameFr || !newDay.date) {
      toast.error("Nom et date requis.")
      return
    }
    try {
      const res = await fetch("/api/admin/programme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "day",
          ...newDay,
          date: new Date(newDay.date).toISOString(),
          displayOrder: days.length,
        }),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success("Jour créé.")
      setNewDay({ nameFr: "", nameEn: "", date: "" })
      setDayDialogOpen(false)
      await load()
    } catch {
      toast.error("Échec de la création.")
    }
  }

  async function deleteDay(id: string) {
    try {
      await fetch(`/api/admin/programme/days/${id}`, { method: "DELETE" })
      toast.success("Jour supprimé.")
      if (activeDayId === id) setActiveDayId("")
      await load()
    } catch {
      toast.error("Échec de la suppression.")
    }
  }

  async function createSession(dayId: string) {
    const day = days.find((d) => d.id === dayId)
    if (!day) return
    const order = day.sessions.length
    try {
      const res = await fetch("/api/admin/programme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "session",
          programmeDayId: dayId,
          startTime: "09:00",
          endTime: "09:30",
          titleFr: "Nouvelle session",
          sessionType: "SESSION",
          displayOrder: order,
          isActive: true,
        }),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success("Session créée.")
      await load()
    } catch {
      toast.error("Échec de la création.")
    }
  }

  async function deleteSession(id: string) {
    try {
      await fetch(`/api/admin/programme/sessions/${id}`, { method: "DELETE" })
      toast.success("Session supprimée.")
      await load()
    } catch {
      toast.error("Échec de la suppression.")
    }
  }

  function openSessionEditor(session: Session) {
    setEditingSession(session)
    setSessionDialogOpen(true)
  }

  async function saveSession(updated: Session, speakerIds: string[], moderatorId: string | null) {
    try {
      const res = await fetch(`/api/admin/programme/sessions/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updated, speakerIds, moderatorId }),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success("Session enregistrée.")
      setSessionDialogOpen(false)
      setEditingSession(null)
      await load()
    } catch {
      toast.error("Échec de l'enregistrement.")
    }
  }

  async function onDragEnd(dayId: string, event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const day = days.find((d) => d.id === dayId)
    if (!day) return
    const oldIndex = day.sessions.findIndex((s) => s.id === active.id)
    const newIndex = day.sessions.findIndex((s) => s.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return
    const newSessions = arrayMove(day.sessions, oldIndex, newIndex)
    // Optimistic update
    setDays((prev) =>
      prev.map((d) =>
        d.id === dayId ? { ...d, sessions: newSessions } : d,
      ),
    )
    // Persist new orders
    await Promise.all(
      newSessions.map((s, idx) =>
        fetch(`/api/admin/programme/sessions/${s.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...s, displayOrder: idx }),
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
        title="Programme"
        description="Organisez les journées et sessions de l'événement."
        actions={
          <Button onClick={() => setDayDialogOpen(true)} className="bg-pmo-violet-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un jour
          </Button>
        }
      />

      {days.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-premium flex flex-col items-center justify-center h-64 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground/50 mb-3" />
          <h3 className="font-display text-lg font-semibold">Aucune journée</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            Créez votre première journée de programme.
          </p>
          <Button onClick={() => setDayDialogOpen(true)} className="bg-pmo-violet-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un jour
          </Button>
        </div>
      ) : (
        <Tabs value={activeDayId} onValueChange={setActiveDayId}>
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
            <TabsList className="bg-white shadow-premium h-auto p-1">
              {days.map((day) => {
                const isActive = day.id === activeDayId
                return (
                  <TabsTrigger
                    key={day.id}
                    value={day.id}
                    className={cn(
                      "px-4 py-2",
                      isActive ? "bg-pmo-violet-gradient" : "bg-transparent",
                    )}
                  >
                    <div className="text-left">
                      <div className={cn("font-medium text-sm", isActive ? "text-white" : "text-foreground")}>
                        {day.nameFr}
                      </div>
                      <div className={cn("text-xs", isActive ? "text-white/80" : "text-muted-foreground")}>
                        {format(new Date(day.date), "dd MMM yyyy")}
                      </div>
                    </div>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          {days.map((day) => (
            <TabsContent key={day.id} value={day.id} className="space-y-4">
              <div className="flex items-center justify-between bg-white rounded-xl shadow-premium p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-display font-semibold">{day.nameFr}</div>
                    <div className="text-xs text-muted-foreground">
                      {day.sessions.length} session{day.sessions.length > 1 ? "s" : ""} ·{" "}
                      {format(new Date(day.date), "EEEE dd MMMM yyyy")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => createSession(day.id)} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Session
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <div className="mx-auto sm:mx-0 flex items-center gap-3">
                          <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <AlertDialogTitle className="truncate">{day.nameFr}</AlertDialogTitle>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(day.date), "dd MMMM yyyy")}
                            </div>
                          </div>
                        </div>
                        <AlertDialogDescription className="flex items-start gap-2 pt-2">
                          <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                          <span>
                            Cette journée et {day.sessions.length === 0
                              ? "toutes ses sessions"
                              : `${day.sessions.length} session${day.sessions.length > 1 ? "s" : ""}`}{" "}
                            seront définitivement supprimées. Cette action est irréversible.
                          </span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteDay(day.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Supprimer définitivement
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {day.sessions.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-premium p-8 text-center text-muted-foreground">
                  Aucune session pour cette journée.
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => onDragEnd(day.id, e)}
                >
                  <SortableContext
                    items={day.sessions.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {day.sessions.map((session) => (
                        <SortableSession
                          key={session.id}
                          session={session}
                          onEdit={() => openSessionEditor(session)}
                          onDelete={() => deleteSession(session.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Day dialog */}
      <Dialog open={dayDialogOpen} onOpenChange={setDayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle journée</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Nom (FR)</Label>
              <Input
                value={newDay.nameFr}
                onChange={(e) => setNewDay({ ...newDay, nameFr: e.target.value })}
                placeholder="Jour 1 — Formation"
              />
            </div>
            <div>
              <Label className="text-sm">Nom (EN)</Label>
              <Input
                value={newDay.nameEn}
                onChange={(e) => setNewDay({ ...newDay, nameEn: e.target.value })}
                placeholder="Day 1 — Training"
              />
            </div>
            <div>
              <Label className="text-sm">Date</Label>
              <Input
                type="date"
                value={newDay.date}
                onChange={(e) => setNewDay({ ...newDay, date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDayDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={createDay} className="bg-pmo-violet-gradient text-white">
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session editor — keyed by session id so it remounts with fresh state */}
      {editingSession && (
        <SessionEditor
          key={editingSession.id}
          session={editingSession}
          speakers={speakers}
          open={sessionDialogOpen}
          onOpenChange={setSessionDialogOpen}
          onSave={saveSession}
        />
      )}
    </div>
  )
}

function SortableSession({
  session,
  onEdit,
  onDelete,
}: {
  session: Session
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: session.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const typeMeta = SESSION_TYPES[session.sessionType] ?? SESSION_TYPES.SESSION

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white rounded-xl shadow-premium p-4 flex items-center gap-4 group",
        isDragging && "opacity-50 shadow-premium-lg ring-2 ring-primary",
        !session.isActive && "opacity-60",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      <div className="flex flex-col items-center min-w-[80px]">
        <div className="font-display text-lg font-bold tabular-nums">{session.startTime}</div>
        <div className="text-xs text-muted-foreground">
          {session.endTime ?? "—"}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge className={typeMeta.color} variant="secondary">
            {typeMeta.label}
          </Badge>
          {session.language && (
            <Badge variant="outline" className="text-xs">
              {session.language}
            </Badge>
          )}
          {session.room && (
            <span className="text-xs text-muted-foreground">📍 {session.room}</span>
          )}
        </div>
        <div className="font-medium truncate">{session.titleFr}</div>
        {session.speakers.length > 0 && (
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            {session.speakers.map((s) => `${s.speaker.firstName} ${s.speaker.lastName}`).join(", ")}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-primary"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="p-2 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="mx-auto sm:mx-0 flex items-center gap-3">
                <div className={cn("w-14 h-14 rounded-lg flex items-center justify-center shrink-0", typeMeta.color)}>
                  <Clock3 className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <AlertDialogTitle className="truncate">{session.titleFr}</AlertDialogTitle>
                  <div className="text-xs text-muted-foreground">
                    {session.startTime}
                    {session.endTime ? ` – ${session.endTime}` : ""}
                  </div>
                </div>
              </div>
              <AlertDialogDescription className="flex items-start gap-2 pt-2">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <span>Cette session sera définitivement supprimée. Cette action est irréversible.</span>
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

function SessionEditor({
  session,
  speakers,
  open,
  onOpenChange,
  onSave,
}: {
  session: Session
  speakers: SpeakerLite[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (session: Session, speakerIds: string[], moderatorId: string | null) => void
}) {
  const [data, setData] = useState<Session>(session)
  const [speakerIds, setSpeakerIds] = useState<string[]>(
    session.speakers.map((s) => s.speaker.id),
  )
  const [moderatorId, setModeratorId] = useState<string | null>(session.moderator?.id ?? null)

  function update<K extends keyof Session>(key: K, value: Session[K]) {
    setData((d) => ({ ...d, [key]: value }))
  }

  function toggleSpeaker(id: string) {
    setSpeakerIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la session</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Heure de début</Label>
              <Input
                type="time"
                value={data.startTime}
                onChange={(e) => update("startTime", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm">Heure de fin</Label>
              <Input
                type="time"
                value={data.endTime ?? ""}
                onChange={(e) => update("endTime", e.target.value || null)}
              />
            </div>
          </div>

          <div>
            <Label className="text-sm">Titre (FR)</Label>
            <Input value={data.titleFr} onChange={(e) => update("titleFr", e.target.value)} />
          </div>

          <div>
            <Label className="text-sm">Titre (EN)</Label>
            <Input
              value={data.titleEn ?? ""}
              onChange={(e) => update("titleEn", e.target.value || null)}
            />
          </div>

          <div>
            <Label className="text-sm">Description (FR)</Label>
            <Textarea
              value={data.descriptionFr ?? ""}
              onChange={(e) => update("descriptionFr", e.target.value || null)}
              rows={3}
            />
          </div>

          <div>
            <Label className="text-sm">Description (EN)</Label>
            <Textarea
              value={data.descriptionEn ?? ""}
              onChange={(e) => update("descriptionEn", e.target.value || null)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Type de session</Label>
              <Select
                value={data.sessionType}
                onValueChange={(v) => update("sessionType", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SESSION_TYPES).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Langue</Label>
              <Select
                value={data.language ?? ""}
                onValueChange={(v) => update("language", v || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FR">Français</SelectItem>
                  <SelectItem value="EN">English</SelectItem>
                  <SelectItem value="AR">العربية</SelectItem>
                  <SelectItem value="MIXED">Mixte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm">Salle / Lieu</Label>
            <Input
              value={data.room ?? ""}
              onChange={(e) => update("room", e.target.value || null)}
            />
          </div>

          <div>
            <Label className="text-sm">Modérateur</Label>
            <Select
              value={moderatorId ?? ""}
              onValueChange={(v) => setModeratorId(v || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Aucun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun</SelectItem>
                {speakers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.firstName} {s.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Intervenants</Label>
            <div className="max-h-48 overflow-y-auto border rounded-lg p-2 space-y-1">
              {speakers.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">
                  Aucun speaker. Ajoutez-en d'abord.
                </div>
              ) : (
                speakers.map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={speakerIds.includes(s.id)}
                      onChange={() => toggleSpeaker(s.id)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {s.firstName} {s.lastName}
                      </div>
                      {s.positionFr && (
                        <div className="text-xs text-muted-foreground">{s.positionFr}</div>
                      )}
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <Label className="text-sm">Session active</Label>
            <Switch
              checked={data.isActive}
              onCheckedChange={(v) => update("isActive", v)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={() => onSave(data, speakerIds, moderatorId)}
            className="bg-pmo-violet-gradient text-white"
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
