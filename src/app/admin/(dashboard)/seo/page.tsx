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
import { Loader2, Save, Plus, Pencil, Trash2, AlertTriangle, Map as MapIcon, Shield } from "lucide-react"
import { toast } from "sonner"

interface SeoRow {
  page: string
  titleFr: string | null
  titleEn: string | null
  descriptionFr: string | null
  descriptionEn: string | null
  ogImage: string | null
}

const PAGE_LABELS: Record<string, string> = {
  home: "Accueil",
  evenement: "Événement",
  programme: "Programme",
  contact: "Contact",
  intervenants: "Intervenants",
  organisateurs: "Organisateurs",
  partenaires: "Partenaires",
  galerie: "Galerie",
  "pass-duo": "Pass Duo",
  "pass-evenement": "Pass Événement",
  "pass-formation": "Pass Formation",
}

const PAGE_ORDER = Object.keys(PAGE_LABELS)

const SITEMAP_DEFAULT_PRIORITY: Record<string, number> = {
  home: 1, evenement: 0.9, programme: 0.9, intervenants: 0.8,
  "pass-duo": 0.8, "pass-evenement": 0.8, "pass-formation": 0.8,
  partenaires: 0.7, organisateurs: 0.6, contact: 0.5,
}

function emptyRow(page: string): SeoRow {
  return { page, titleFr: "", titleEn: "", descriptionFr: "", descriptionEn: "", ogImage: null }
}

interface SitemapEntryRow {
  page: string
  included: boolean
  priorityOverride: number | null
}

interface SitemapExtra {
  id: string
  path: string
  priority: number
  changeFreq: string
  isActive: boolean
}

interface RobotsSettings {
  extraDisallow: string | null
  extraAllow: string | null
  crawlDelay: number | null
}

export default function SeoPage() {
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<Record<string, SeoRow>>({})
  const [savingPage, setSavingPage] = useState<string | null>(null)
  const [selectedPage, setSelectedPage] = useState<string>(PAGE_ORDER[0])

  const [sitemapEntries, setSitemapEntries] = useState<Record<string, SitemapEntryRow>>({})
  const [extras, setExtras] = useState<SitemapExtra[]>([])
  const [savingSitemap, setSavingSitemap] = useState<string | null>(null)
  const [extraDialogOpen, setExtraDialogOpen] = useState(false)
  const [editingExtra, setEditingExtra] = useState<SitemapExtra | Omit<SitemapExtra, "id"> | null>(null)
  const [savingExtra, setSavingExtra] = useState(false)

  const [robots, setRobots] = useState<RobotsSettings>({ extraDisallow: "", extraAllow: "", crawlDelay: null })
  const [savingRobots, setSavingRobots] = useState(false)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const [seoRes, sitemapRes, robotsRes] = await Promise.all([
        fetch("/api/admin/seo"),
        fetch("/api/admin/sitemap"),
        fetch("/api/admin/robots"),
      ])
      const seoJson: SeoRow[] = await seoRes.json()
      const map: Record<string, SeoRow> = {}
      for (const p of PAGE_ORDER) map[p] = emptyRow(p)
      for (const r of seoJson) map[r.page] = { ...emptyRow(r.page), ...r }
      setRows(map)

      const sitemapJson = await sitemapRes.json()
      const entryMap: Record<string, SitemapEntryRow> = {}
      for (const p of PAGE_ORDER) entryMap[p] = { page: p, included: true, priorityOverride: null }
      for (const e of sitemapJson.entries ?? []) entryMap[e.page] = e
      setSitemapEntries(entryMap)
      setExtras(sitemapJson.extras ?? [])

      const robotsJson = await robotsRes.json()
      setRobots({
        extraDisallow: robotsJson.extraDisallow ?? "",
        extraAllow: robotsJson.extraAllow ?? "",
        crawlDelay: robotsJson.crawlDelay ?? null,
      })
    } catch {
      toast.error("Échec du chargement.")
    } finally {
      setLoading(false)
    }
  }

  function updateRow(page: string, patch: Partial<SeoRow>) {
    setRows((prev) => ({ ...prev, [page]: { ...prev[page], ...patch } }))
  }

  async function savePage(page: string) {
    const row = rows[page]
    if (!row) return
    setSavingPage(page)
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success(`${PAGE_LABELS[page] ?? page} enregistré.`)
      await load()
    } catch {
      toast.error("Échec de l'enregistrement.")
    } finally {
      setSavingPage(null)
    }
  }

  function updateSitemapEntry(page: string, patch: Partial<SitemapEntryRow>) {
    setSitemapEntries((prev) => ({ ...prev, [page]: { ...prev[page], ...patch } }))
  }

  async function saveSitemapEntry(page: string) {
    const entry = sitemapEntries[page]
    if (!entry) return
    setSavingSitemap(page)
    try {
      const res = await fetch("/api/admin/sitemap", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success(`${PAGE_LABELS[page] ?? page} mis à jour.`)
    } catch {
      toast.error("Échec de l'enregistrement.")
    } finally {
      setSavingSitemap(null)
    }
  }

  function startNewExtra() {
    setEditingExtra({ path: "", priority: 0.5, changeFreq: "monthly", isActive: true })
    setExtraDialogOpen(true)
  }

  function startEditExtra(e: SitemapExtra) {
    setEditingExtra(e)
    setExtraDialogOpen(true)
  }

  async function saveExtra() {
    if (!editingExtra) return
    if (!editingExtra.path.trim()) {
      toast.error("Le chemin est obligatoire.")
      return
    }
    setSavingExtra(true)
    try {
      const isEdit = "id" in editingExtra && editingExtra.id
      const res = await fetch(
        isEdit ? `/api/admin/sitemap/extras/${editingExtra.id}` : "/api/admin/sitemap/extras",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingExtra),
        },
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed")
      toast.success(isEdit ? "URL mise à jour." : "URL ajoutée.")
      setExtraDialogOpen(false)
      setEditingExtra(null)
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de l'enregistrement.")
    } finally {
      setSavingExtra(false)
    }
  }

  async function removeExtra(id: string) {
    try {
      const res = await fetch(`/api/admin/sitemap/extras/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed")
      toast.success("URL supprimée.")
      await load()
    } catch {
      toast.error("Échec de la suppression.")
    }
  }

  async function saveRobots() {
    setSavingRobots(true)
    try {
      const res = await fetch("/api/admin/robots", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(robots),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success("robots.txt enregistré.")
    } catch {
      toast.error("Échec de l'enregistrement.")
    } finally {
      setSavingRobots(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const robotsPreview = buildRobotsPreview(robots)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="SEO"
        description="Titre, description, sitemap et robots.txt pour le site public."
      />

      <Tabs defaultValue="pages">
        <TabsList className="mb-6 bg-white shadow-premium p-1">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="sitemap" className="gap-1.5">
            <MapIcon className="w-3.5 h-3.5" />
            Sitemap
          </TabsTrigger>
          <TabsTrigger value="robots" className="gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Robots.txt
          </TabsTrigger>
        </TabsList>

        {/* PAGES */}
        <TabsContent value="pages">
          <div className="mb-4 max-w-xs">
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_ORDER.map((p) => (
                  <SelectItem key={p} value={p}>
                    {PAGE_LABELS[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(() => {
            const page = selectedPage
            const row = rows[page] ?? emptyRow(page)
            return (
              <FormCard
                title={PAGE_LABELS[page]}
                description="Le titre est complété automatiquement avec « | PMO Mastery ». Laissez vide pour garder le texte par défaut."
              >
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Titre (FR)">
                      <Input
                        value={row.titleFr ?? ""}
                        onChange={(e) => updateRow(page, { titleFr: e.target.value })}
                      />
                    </Field>
                    <Field label="Title (EN)">
                      <Input
                        value={row.titleEn ?? ""}
                        onChange={(e) => updateRow(page, { titleEn: e.target.value })}
                      />
                    </Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Description (FR)">
                      <Textarea
                        value={row.descriptionFr ?? ""}
                        onChange={(e) => updateRow(page, { descriptionFr: e.target.value })}
                        rows={3}
                      />
                    </Field>
                    <Field label="Description (EN)">
                      <Textarea
                        value={row.descriptionEn ?? ""}
                        onChange={(e) => updateRow(page, { descriptionEn: e.target.value })}
                        rows={3}
                      />
                    </Field>
                  </div>
                  <ImageUploader
                    label="Image de partage (Open Graph)"
                    value={row.ogImage}
                    onChange={(url) => updateRow(page, { ogImage: url })}
                    aspectRatio="wide"
                  />
                </div>
                <SaveButton onClick={() => savePage(page)} saving={savingPage === page} />
              </FormCard>
            )
          })()}
        </TabsContent>

        {/* SITEMAP */}
        <TabsContent value="sitemap">
          <div className="space-y-6">
            <FormCard
              title="Pages du site"
              description="Choisissez quelles pages apparaissent dans le sitemap, et ajustez leur priorité si besoin (0 à 1)."
            >
              <div className="space-y-2">
                {PAGE_ORDER.map((page) => {
                  const entry = sitemapEntries[page] ?? { page, included: true, priorityOverride: null }
                  return (
                    <div key={page} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Switch
                        checked={entry.included}
                        onCheckedChange={(v) => updateSitemapEntry(page, { included: v })}
                      />
                      <span className="flex-1 text-sm font-medium">{PAGE_LABELS[page]}</span>
                      <Input
                        type="number"
                        min={0}
                        max={1}
                        step={0.1}
                        value={entry.priorityOverride ?? SITEMAP_DEFAULT_PRIORITY[page]}
                        onChange={(e) =>
                          updateSitemapEntry(page, { priorityOverride: e.target.value ? parseFloat(e.target.value) : null })
                        }
                        className="w-20 text-sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => saveSitemapEntry(page)}
                        disabled={savingSitemap === page}
                      >
                        {savingSitemap === page ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </FormCard>

            <FormCard
              title="URLs personnalisées"
              description="Ajoutez des URLs externes ou des pages non listées ci-dessus au sitemap."
            >
              <div className="flex justify-end mb-3">
                <Button size="sm" variant="outline" onClick={startNewExtra}>
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter une URL
                </Button>
              </div>
              {extras.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Aucune URL personnalisée.</p>
              ) : (
                <div className="space-y-2">
                  {extras.map((e) => (
                    <div key={e.id} className="flex items-center gap-3 p-3 rounded-lg border group">
                      <span className="flex-1 font-mono text-sm truncate">{e.path}</span>
                      <Badge variant="secondary">{e.changeFreq}</Badge>
                      <Badge variant="secondary">priorité {e.priority}</Badge>
                      {!e.isActive && <Badge variant="secondary" className="bg-muted text-muted-foreground">Inactif</Badge>}
                      <button onClick={() => startEditExtra(e)} className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-primary">
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
                            <AlertDialogTitle className="font-mono text-base truncate">{e.path}</AlertDialogTitle>
                            <AlertDialogDescription className="flex items-start gap-2 pt-2">
                              <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                              <span>Cette URL sera retirée du sitemap. Cette action est irréversible.</span>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeExtra(e.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer définitivement
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              )}
            </FormCard>
          </div>
        </TabsContent>

        {/* ROBOTS.TXT */}
        <TabsContent value="robots">
          <FormCard
            title="Robots.txt"
            description="Les pages /admin et /api sont toujours bloquées et ne peuvent pas être retirées. Ajoutez d'autres chemins ci-dessous si besoin."
          >
            <div className="space-y-5">
              <Field label="Chemins supplémentaires à bloquer" hint="Un chemin par ligne, ex. /brouillon">
                <Textarea
                  value={robots.extraDisallow ?? ""}
                  onChange={(e) => setRobots({ ...robots, extraDisallow: e.target.value })}
                  rows={4}
                  className="font-mono text-sm"
                  placeholder="/brouillon&#10;/test"
                />
              </Field>
              <Field label="Chemins à autoriser explicitement" hint="Un chemin par ligne — rarement nécessaire">
                <Textarea
                  value={robots.extraAllow ?? ""}
                  onChange={(e) => setRobots({ ...robots, extraAllow: e.target.value })}
                  rows={2}
                  className="font-mono text-sm"
                />
              </Field>
              <Field label="Délai entre requêtes (secondes)" hint="Laissez vide pour aucun délai">
                <Input
                  type="number"
                  min={0}
                  value={robots.crawlDelay ?? ""}
                  onChange={(e) => setRobots({ ...robots, crawlDelay: e.target.value ? parseInt(e.target.value, 10) : null })}
                  className="w-32"
                />
              </Field>

              <div>
                <Label className="text-sm font-medium mb-2 block">Aperçu du fichier généré</Label>
                <pre className="rounded-lg border bg-muted/30 p-4 text-xs font-mono whitespace-pre-wrap">{robotsPreview}</pre>
              </div>
            </div>
            <SaveButton onClick={saveRobots} saving={savingRobots} />
          </FormCard>
        </TabsContent>
      </Tabs>

      {/* Extra URL editor */}
      <Dialog open={extraDialogOpen} onOpenChange={setExtraDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExtra && "id" in editingExtra ? "Modifier" : "Nouvelle"} URL</DialogTitle>
          </DialogHeader>
          {editingExtra && (
            <div className="space-y-4">
              <Field label="Chemin ou URL" required>
                <Input
                  value={editingExtra.path}
                  onChange={(e) => setEditingExtra({ ...editingExtra, path: e.target.value })}
                  placeholder="/page-externe ou https://…"
                  className="font-mono text-sm"
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Fréquence de mise à jour">
                  <select
                    value={editingExtra.changeFreq}
                    onChange={(e) => setEditingExtra({ ...editingExtra, changeFreq: e.target.value })}
                    className="w-full h-9 px-3 rounded-md border bg-background text-sm"
                  >
                    {["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Priorité (0 à 1)">
                  <Input
                    type="number"
                    min={0}
                    max={1}
                    step={0.1}
                    value={editingExtra.priority}
                    onChange={(e) => setEditingExtra({ ...editingExtra, priority: parseFloat(e.target.value) || 0 })}
                  />
                </Field>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <Label className="text-sm">Active</Label>
                <Switch
                  checked={editingExtra.isActive}
                  onCheckedChange={(v) => setEditingExtra({ ...editingExtra, isActive: v })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setExtraDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={saveExtra} disabled={savingExtra} className="bg-pmo-violet-gradient text-white">
              {savingExtra ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function buildRobotsPreview(robots: RobotsSettings): string {
  const disallow = ["/admin", "/api", ...(robots.extraDisallow ?? "").split("\n").map((l) => l.trim()).filter(Boolean)]
  const extraAllow = (robots.extraAllow ?? "").split("\n").map((l) => l.trim()).filter(Boolean)
  const allowLines = ["/", ...extraAllow].map((a) => `Allow: ${a}`).join("\n")
  const disallowLines = disallow.map((d) => `Disallow: ${d}`).join("\n")
  const crawlDelayLine = robots.crawlDelay ? `Crawl-delay: ${robots.crawlDelay}\n` : ""
  return `User-Agent: *\n${allowLines}\n${disallowLines}\n${crawlDelayLine}\nSitemap: https://www.pmomastery.tn/sitemap.xml`
}

function SaveButton({ onClick, saving, label = "Enregistrer" }: { onClick: () => void; saving: boolean; label?: string }) {
  return (
    <div className="flex justify-end pt-4 mt-6 border-t">
      <Button onClick={onClick} disabled={saving} className="bg-pmo-violet-gradient text-white">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        {label}
      </Button>
    </div>
  )
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
