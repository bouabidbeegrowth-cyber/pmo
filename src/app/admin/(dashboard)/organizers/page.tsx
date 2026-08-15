"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { FormCard } from "@/components/admin/form-card"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Loader2,
  Plus,
  Save,
  Pencil,
  Trash2,
  Building2,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"

interface Organizer {
  id: string
  name: string
  logo?: string | null
  descriptionFr?: string | null
  descriptionEn?: string | null
  websiteUrl?: string | null
  linkedinUrl?: string | null
  facebookUrl?: string | null
  instagramUrl?: string | null
  founderName?: string | null
  founderTitle?: string | null
  founderPhoto?: string | null
  founderCredentials?: string | null
  isActive: boolean
  displayOrder: number
}

const EMPTY: Omit<Organizer, "id"> = {
  name: "",
  logo: null,
  descriptionFr: "",
  descriptionEn: "",
  websiteUrl: "",
  linkedinUrl: "",
  facebookUrl: "",
  instagramUrl: "",
  founderName: "",
  founderTitle: "",
  founderPhoto: null,
  founderCredentials: "",
  isActive: true,
  displayOrder: 0,
}

export default function OrganizersPage() {
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<Organizer[]>([])
  const [editing, setEditing] = useState<Organizer | (Omit<Organizer, "id"> & { id?: string }) | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/organizers")
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

  function startEdit(org: Organizer) {
    setEditing(org)
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
        isEdit ? `/api/admin/organizers/${editing.id}` : "/api/admin/organizers",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
        },
      )
      if (!res.ok) throw new Error("Failed")
      toast.success(isEdit ? "Organisateur mis à jour." : "Organisateur créé.")
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
    if (!confirm("Supprimer cet organisateur ?")) return
    try {
      await fetch(`/api/admin/organizers/${id}`, { method: "DELETE" })
      toast.success("Organisateur supprimé.")
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Organisateurs"
        description="Les organisateurs de l'événement."
        actions={
          <Button onClick={startNew} className="bg-pmo-violet-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        }
      />

      {list.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-premium flex flex-col items-center justify-center h-64 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground/50 mb-3" />
          <h3 className="font-display text-lg font-semibold">Aucun organisateur</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            Ajoutez votre premier organisateur.
          </p>
          <Button onClick={startNew} className="bg-pmo-violet-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((org) => (
            <div key={org.id} className="bg-white rounded-2xl shadow-premium p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0">
                  {org.logo ? (
                     
                    <img src={org.logo} alt={org.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold truncate">{org.name}</div>
                  {org.founderName && (
                    <div className="text-xs text-muted-foreground truncate">
                      {org.founderName}
                    </div>
                  )}
                </div>
              </div>
              {org.descriptionFr && (
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {org.descriptionFr}
                </p>
              )}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-2">
                  {org.websiteUrl && (
                    <a
                      href={org.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(org)}
                    className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-primary"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => remove(org.id)}
                    className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing && "id" in editing && editing.id ? "Modifier" : "Nouvel"} organisateur
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nom" required>
                  <Input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  />
                </Field>
                <Field label="Site web">
                  <Input
                    value={editing.websiteUrl ?? ""}
                    onChange={(e) => setEditing({ ...editing, websiteUrl: e.target.value })}
                    placeholder="https://…"
                  />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <ImageUploader
                  label="Logo"
                  value={editing.logo}
                  onChange={(url) => setEditing({ ...editing, logo: url })}
                />
                <ImageUploader
                  label="Photo du fondateur"
                  value={editing.founderPhoto}
                  onChange={(url) => setEditing({ ...editing, founderPhoto: url })}
                  aspectRatio="portrait"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nom du fondateur">
                  <Input
                    value={editing.founderName ?? ""}
                    onChange={(e) => setEditing({ ...editing, founderName: e.target.value })}
                  />
                </Field>
                <Field label="Titre du fondateur">
                  <Input
                    value={editing.founderTitle ?? ""}
                    onChange={(e) => setEditing({ ...editing, founderTitle: e.target.value })}
                  />
                </Field>
              </div>

              <Field label="Credentials / Certifications">
                <Input
                  value={editing.founderCredentials ?? ""}
                  onChange={(e) => setEditing({ ...editing, founderCredentials: e.target.value })}
                  placeholder="PgMP®, PMP®, PMO-CP, Coach Professionnelle"
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
                      rows={5}
                    />
                  </Field>
                </TabsContent>
                <TabsContent value="en">
                  <Field label="Description (EN)">
                    <Textarea
                      value={editing.descriptionEn ?? ""}
                      onChange={(e) => setEditing({ ...editing, descriptionEn: e.target.value })}
                      rows={5}
                    />
                  </Field>
                </TabsContent>
              </Tabs>

              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="LinkedIn">
                  <Input
                    value={editing.linkedinUrl ?? ""}
                    onChange={(e) => setEditing({ ...editing, linkedinUrl: e.target.value })}
                  />
                </Field>
                <Field label="Facebook">
                  <Input
                    value={editing.facebookUrl ?? ""}
                    onChange={(e) => setEditing({ ...editing, facebookUrl: e.target.value })}
                  />
                </Field>
                <Field label="Instagram">
                  <Input
                    value={editing.instagramUrl ?? ""}
                    onChange={(e) => setEditing({ ...editing, instagramUrl: e.target.value })}
                  />
                </Field>
              </div>

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
