"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
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
import { Loader2, Plus, Save, Pencil, Trash2, ArrowRightLeft, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface Redirect {
  id: string
  fromPath: string
  toPath: string
  permanent: boolean
  isActive: boolean
  hits: number
}

const EMPTY: Omit<Redirect, "id" | "hits"> = {
  fromPath: "",
  toPath: "",
  permanent: true,
  isActive: true,
}

export default function RedirectsPage() {
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<Redirect[]>([])
  const [editing, setEditing] = useState<Redirect | (Omit<Redirect, "id" | "hits"> & { id?: string }) | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/redirects")
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

  function startEdit(r: Redirect) {
    setEditing(r)
    setOpen(true)
  }

  async function save() {
    if (!editing) return
    if (!editing.fromPath.trim().startsWith("/")) {
      toast.error("Le chemin source doit commencer par /.")
      return
    }
    if (!editing.toPath.trim()) {
      toast.error("La destination est obligatoire.")
      return
    }
    setSaving(true)
    try {
      const isEdit = "id" in editing && editing.id
      const res = await fetch(
        isEdit ? `/api/admin/redirects/${editing.id}` : "/api/admin/redirects",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
        },
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed")
      toast.success(isEdit ? "Redirection mise à jour." : "Redirection créée.")
      setOpen(false)
      setEditing(null)
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de l'enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/admin/redirects/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed")
      toast.success("Redirection supprimée.")
      await load()
    } catch {
      toast.error("Échec de la suppression.")
    }
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
        title="Redirections"
        description="Redirigez une ancienne URL vers une nouvelle — utile quand une page a été renommée ou déplacée."
        actions={
          <Button onClick={startNew} className="bg-pmo-violet-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        }
      />

      {list.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-premium flex flex-col items-center justify-center h-64 text-center">
          <ArrowRightLeft className="w-12 h-12 text-muted-foreground/50 mb-3" />
          <h3 className="font-display text-lg font-semibold">Aucune redirection</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            Ajoutez votre première redirection.
          </p>
          <Button onClick={startNew} className="bg-pmo-violet-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl shadow-premium p-4 flex items-center gap-3 group">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap text-sm font-mono">
                  <span className="truncate">{r.fromPath}</span>
                  <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate text-primary">{r.toPath}</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="secondary" className={r.permanent ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}>
                    {r.permanent ? "301 Permanent" : "302 Temporaire"}
                  </Badge>
                  {!r.isActive && (
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                      Inactif
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">{r.hits} visite{r.hits > 1 ? "s" : ""}</span>
                </div>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => startEdit(r)}
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
                      <AlertDialogTitle className="font-mono text-base truncate">{r.fromPath}</AlertDialogTitle>
                      <AlertDialogDescription className="flex items-start gap-2 pt-2">
                        <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                        <span>
                          Cette redirection sera définitivement supprimée. Les visiteurs qui accèdent à{" "}
                          <span className="font-mono">{r.fromPath}</span> ne seront plus redirigés. Cette action est
                          irréversible.
                        </span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => remove(r.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing && "id" in editing && editing.id ? "Modifier" : "Nouvelle"} redirection
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <Field label="Depuis (chemin source)" required>
                <Input
                  value={editing.fromPath}
                  onChange={(e) => setEditing({ ...editing, fromPath: e.target.value })}
                  placeholder="/ancienne-page"
                  className="font-mono text-sm"
                />
              </Field>
              <Field label="Vers (destination)" required>
                <Input
                  value={editing.toPath}
                  onChange={(e) => setEditing({ ...editing, toPath: e.target.value })}
                  placeholder="/nouvelle-page ou https://…"
                  className="font-mono text-sm"
                />
              </Field>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label className="text-sm">Redirection permanente (301)</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Désactivez pour une redirection temporaire (302).
                  </p>
                </div>
                <Switch
                  checked={editing.permanent}
                  onCheckedChange={(v) => setEditing({ ...editing, permanent: v })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <Label className="text-sm">Active</Label>
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
