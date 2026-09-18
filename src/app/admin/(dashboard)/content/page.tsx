"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/admin/page-header"
import { FormCard } from "@/components/admin/form-card"
import { ImageUploader } from "@/components/admin/image-uploader"
import { VideoUploader } from "@/components/admin/video-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Loader2, Save, Plus, Trash2, GripVertical, Phone, Mail, MapPin, Clock3, ArrowRight, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface Section {
  id: string
  sectionKey: string
  titleFr?: string | null
  titleEn?: string | null
  subtitleFr?: string | null
  subtitleEn?: string | null
  descriptionFr?: string | null
  descriptionEn?: string | null
  ctaTextFr?: string | null
  ctaTextEn?: string | null
  ctaUrl?: string | null
  backgroundImage?: string | null
  isActive: boolean
  benefits?: Benefit[]
}

interface Benefit {
  id?: string
  icon?: string | null
  titleFr: string
  titleEn?: string | null
  descriptionFr?: string | null
  descriptionEn?: string | null
  displayOrder: number
  isActive: boolean
}

interface ContactInfo {
  id?: string
  email?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  mapUrl?: string | null
  linkedinUrl?: string | null
  facebookUrl?: string | null
  instagramUrl?: string | null
  youtubeUrl?: string | null
  websiteUrl?: string | null
}

const ICON_OPTIONS = [
  "Sparkles",
  "Rocket",
  "Users",
  "TrendingUp",
  "Target",
  "Award",
  "Lightbulb",
  "Globe",
  "Network",
  "Brain",
  "Zap",
  "Compass",
]

const SECTION_LABELS: Record<string, string> = {
  HERO: "Hero",
  WHY_PARTICIPATE: "Pourquoi y participer",
  ABOUT: "À propos",
  CHAIRMAN_MESSAGE: "Message du/de la Président(e)",
  GALLERY_HERO: "Hero Galerie",
  PASSES_HERO: "Hero Pass",
  COUNTDOWN: "Compte à rebours",
  FOOTER: "Footer",
}

export default function ContentPage() {
  const [loading, setLoading] = useState(true)
  const [sections, setSections] = useState<Record<string, Section>>({})
  const [contact, setContact] = useState<ContactInfo>({})
  const [savingKey, setSavingKey] = useState<string | null>(null)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    try {
      const res = await fetch("/api/admin/content")
      const json = await res.json()
      const map: Record<string, Section> = {}
      for (const s of json.sections ?? []) {
        map[s.sectionKey] = s
      }
      // Ensure all sections exist locally (even if not in DB yet)
      for (const k of ["HERO", "WHY_PARTICIPATE", "ABOUT", "CHAIRMAN_MESSAGE", "GALLERY_HERO", "PASSES_HERO", "COUNTDOWN", "FOOTER"]) {
        if (!map[k]) {
          map[k] = {
            id: "",
            sectionKey: k,
            titleFr: "",
            titleEn: "",
            subtitleFr: "",
            subtitleEn: "",
            descriptionFr: "",
            descriptionEn: "",
            ctaTextFr: "",
            ctaTextEn: "",
            ctaUrl: "",
            backgroundImage: null,
            isActive: true,
            benefits: k === "WHY_PARTICIPATE" ? [] : undefined,
          }
        }
      }
      setSections(map)
      setContact(json.contactInfo ?? {})
    } catch {
      toast.error("Échec du chargement.")
    } finally {
      setLoading(false)
    }
  }

  async function saveSection(key: string) {
    const section = sections[key]
    if (!section) return
    setSavingKey(key)
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...section,
          sectionKey: key,
          benefits: section.benefits,
        }),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success(`${SECTION_LABELS[key]} enregistré.`)
      await load()
    } catch {
      toast.error("Échec de l'enregistrement.")
    } finally {
      setSavingKey(null)
    }
  }

  async function saveContact() {
    setSavingKey("contact")
    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success("Coordonnées enregistrées.")
    } catch {
      toast.error("Échec de l'enregistrement.")
    } finally {
      setSavingKey(null)
    }
  }

  function updateSection(key: string, patch: Partial<Section>) {
    setSections((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }))
  }

  function updateBenefit(sectionKey: string, idx: number, patch: Partial<Benefit>) {
    setSections((prev) => {
      const sec = prev[sectionKey]
      if (!sec || !sec.benefits) return prev
      const next = [...sec.benefits]
      next[idx] = { ...next[idx], ...patch }
      return { ...prev, [sectionKey]: { ...sec, benefits: next } }
    })
  }

  function addBenefit(sectionKey: string) {
    setSections((prev) => {
      const sec = prev[sectionKey]
      if (!sec) return prev
      const benefits = sec.benefits ?? []
      return {
        ...prev,
        [sectionKey]: {
          ...sec,
          benefits: [
            ...benefits,
            {
              titleFr: "Nouvel avantage",
              icon: "Sparkles",
              descriptionFr: "",
              displayOrder: benefits.length,
              isActive: true,
            },
          ],
        },
      }
    })
  }

  function removeBenefit(sectionKey: string, idx: number) {
    setSections((prev) => {
      const sec = prev[sectionKey]
      if (!sec || !sec.benefits) return prev
      return {
        ...prev,
        [sectionKey]: { ...sec, benefits: sec.benefits.filter((_, i) => i !== idx) },
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Contenu du site"
        description="Éditez les sections textuelles du site public."
      />

      <Tabs defaultValue="HERO">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-9 mb-6">
          <TabsTrigger value="HERO">Hero</TabsTrigger>
          <TabsTrigger value="WHY_PARTICIPATE">Pourquoi</TabsTrigger>
          <TabsTrigger value="ABOUT">À propos</TabsTrigger>
          <TabsTrigger value="CHAIRMAN_MESSAGE">Message</TabsTrigger>
          <TabsTrigger value="GALLERY_HERO">Hero Galerie</TabsTrigger>
          <TabsTrigger value="PASSES_HERO">Hero Pass</TabsTrigger>
          <TabsTrigger value="COUNTDOWN">Compte à rebours</TabsTrigger>
          <TabsTrigger value="FOOTER">Footer</TabsTrigger>
          <TabsTrigger value="CONTACT">Contact</TabsTrigger>
        </TabsList>

        {/* HERO */}
        <TabsContent value="HERO">
          <FormCard title="Section Hero" description="Bannière d'accueil du site.">
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Titre (FR)">
                  <Input
                    value={sections.HERO?.titleFr ?? ""}
                    onChange={(e) => updateSection("HERO", { titleFr: e.target.value })}
                  />
                </Field>
                <Field label="Title (EN)">
                  <Input
                    value={sections.HERO?.titleEn ?? ""}
                    onChange={(e) => updateSection("HERO", { titleEn: e.target.value })}
                  />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Sous-titre (FR)">
                  <Input
                    value={sections.HERO?.subtitleFr ?? ""}
                    onChange={(e) => updateSection("HERO", { subtitleFr: e.target.value })}
                  />
                </Field>
                <Field label="Subtitle (EN)">
                  <Input
                    value={sections.HERO?.subtitleEn ?? ""}
                    onChange={(e) => updateSection("HERO", { subtitleEn: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Description (FR)">
                <Textarea
                  value={sections.HERO?.descriptionFr ?? ""}
                  onChange={(e) => updateSection("HERO", { descriptionFr: e.target.value })}
                  rows={3}
                />
              </Field>
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="CTA (FR)">
                  <Input
                    value={sections.HERO?.ctaTextFr ?? ""}
                    onChange={(e) => updateSection("HERO", { ctaTextFr: e.target.value })}
                    placeholder="Je m'inscris"
                  />
                </Field>
                <Field label="CTA (EN)">
                  <Input
                    value={sections.HERO?.ctaTextEn ?? ""}
                    onChange={(e) => updateSection("HERO", { ctaTextEn: e.target.value })}
                    placeholder="Register now"
                  />
                </Field>
                <Field label="URL du CTA">
                  <Input
                    value={sections.HERO?.ctaUrl ?? ""}
                    onChange={(e) => updateSection("HERO", { ctaUrl: e.target.value })}
                    placeholder="#pricing"
                  />
                </Field>
              </div>
              <ImageUploader
                label="Image de fond Hero"
                value={sections.HERO?.backgroundImage}
                onChange={(url) => updateSection("HERO", { backgroundImage: url })}
                aspectRatio="wide"
              />
            </div>
            <SaveButton onClick={() => saveSection("HERO")} saving={savingKey === "HERO"} />
          </FormCard>
        </TabsContent>

        {/* WHY PARTICIPATE */}
        <TabsContent value="WHY_PARTICIPATE">
          <FormCard title="Pourquoi y participer ?" description="Section benefits + texte d'intro.">
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Titre (FR)">
                  <Input
                    value={sections.WHY_PARTICIPATE?.titleFr ?? ""}
                    onChange={(e) => updateSection("WHY_PARTICIPATE", { titleFr: e.target.value })}
                    placeholder="Pourquoi y participer ?"
                  />
                </Field>
                <Field label="Title (EN)">
                  <Input
                    value={sections.WHY_PARTICIPATE?.titleEn ?? ""}
                    onChange={(e) => updateSection("WHY_PARTICIPATE", { titleEn: e.target.value })}
                    placeholder="Why participate?"
                  />
                </Field>
              </div>
              <Field label="Description (FR)">
                <Textarea
                  value={sections.WHY_PARTICIPATE?.descriptionFr ?? ""}
                  onChange={(e) => updateSection("WHY_PARTICIPATE", { descriptionFr: e.target.value })}
                  rows={3}
                />
              </Field>
              <Field label="Description (EN)">
                <Textarea
                  value={sections.WHY_PARTICIPATE?.descriptionEn ?? ""}
                  onChange={(e) => updateSection("WHY_PARTICIPATE", { descriptionEn: e.target.value })}
                  rows={3}
                />
              </Field>
              <ImageUploader
                label="Image"
                value={sections.WHY_PARTICIPATE?.backgroundImage}
                onChange={(url) => updateSection("WHY_PARTICIPATE", { backgroundImage: url })}
                aspectRatio="portrait"
              />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Avantages ({sections.WHY_PARTICIPATE?.benefits?.length ?? 0})
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBenefit("WHY_PARTICIPATE")}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
                <div className="space-y-3">
                  {(sections.WHY_PARTICIPATE?.benefits ?? []).map((b, idx) => (
                    <div key={idx} className="rounded-xl border p-4 bg-muted/20">
                      <div className="flex items-start gap-3">
                        <GripVertical className="w-4 h-4 text-muted-foreground mt-2" />
                        <div className="flex-1 grid sm:grid-cols-2 gap-3">
                          <Field label="Icône">
                            <Select
                              value={b.icon ?? "Sparkles"}
                              onValueChange={(v) => updateBenefit("WHY_PARTICIPATE", idx, { icon: v })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ICON_OPTIONS.map((ic) => (
                                  <SelectItem key={ic} value={ic}>
                                    {ic}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                          <Field label="Titre (FR)">
                            <Input
                              value={b.titleFr}
                              onChange={(e) => updateBenefit("WHY_PARTICIPATE", idx, { titleFr: e.target.value })}
                            />
                          </Field>
                          <Field label="Titre (EN)">
                            <Input
                              value={b.titleEn ?? ""}
                              onChange={(e) => updateBenefit("WHY_PARTICIPATE", idx, { titleEn: e.target.value })}
                            />
                          </Field>
                          <Field label="Description (FR)">
                            <Input
                              value={b.descriptionFr ?? ""}
                              onChange={(e) => updateBenefit("WHY_PARTICIPATE", idx, { descriptionFr: e.target.value })}
                            />
                          </Field>
                          <div className="sm:col-span-2">
                            <Field label="Description (EN)">
                              <Input
                                value={b.descriptionEn ?? ""}
                                onChange={(e) => updateBenefit("WHY_PARTICIPATE", idx, { descriptionEn: e.target.value })}
                              />
                            </Field>
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="truncate">
                                {b.titleFr || "Cet avantage"}
                              </AlertDialogTitle>
                              <AlertDialogDescription className="flex items-start gap-2 pt-2">
                                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                                <span>
                                  Cet avantage sera retiré de la liste. Cliquez « Enregistrer » pour rendre la
                                  suppression définitive.
                                </span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => removeBenefit("WHY_PARTICIPATE", idx)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Retirer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <SaveButton onClick={() => saveSection("WHY_PARTICIPATE")} saving={savingKey === "WHY_PARTICIPATE"} />
          </FormCard>
        </TabsContent>

        {/* ABOUT */}
        <TabsContent value="ABOUT">
          <FormCard title="À propos de l'événement">
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Titre (FR)">
                  <Input
                    value={sections.ABOUT?.titleFr ?? ""}
                    onChange={(e) => updateSection("ABOUT", { titleFr: e.target.value })}
                  />
                </Field>
                <Field label="Title (EN)">
                  <Input
                    value={sections.ABOUT?.titleEn ?? ""}
                    onChange={(e) => updateSection("ABOUT", { titleEn: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Description (FR)">
                <Textarea
                  value={sections.ABOUT?.descriptionFr ?? ""}
                  onChange={(e) => updateSection("ABOUT", { descriptionFr: e.target.value })}
                  rows={6}
                />
              </Field>
              <Field label="Description (EN)">
                <Textarea
                  value={sections.ABOUT?.descriptionEn ?? ""}
                  onChange={(e) => updateSection("ABOUT", { descriptionEn: e.target.value })}
                  rows={6}
                />
              </Field>
              <ImageUploader
                label="Image"
                value={sections.ABOUT?.backgroundImage}
                onChange={(url) => updateSection("ABOUT", { backgroundImage: url })}
                aspectRatio="wide"
              />
            </div>
            <SaveButton onClick={() => saveSection("ABOUT")} saving={savingKey === "ABOUT"} />
          </FormCard>
        </TabsContent>

        {/* CHAIRMAN MESSAGE */}
        <TabsContent value="CHAIRMAN_MESSAGE">
          <FormCard
            title="Message du/de la Président(e)"
            description="Message personnel avec photo, affiché sur la page d'accueil."
          >
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Titre (FR)">
                  <Input
                    value={sections.CHAIRMAN_MESSAGE?.titleFr ?? ""}
                    onChange={(e) => updateSection("CHAIRMAN_MESSAGE", { titleFr: e.target.value })}
                    placeholder="Mon message, ma vision"
                  />
                </Field>
                <Field label="Title (EN)">
                  <Input
                    value={sections.CHAIRMAN_MESSAGE?.titleEn ?? ""}
                    onChange={(e) => updateSection("CHAIRMAN_MESSAGE", { titleEn: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Message (FR)">
                <Textarea
                  value={sections.CHAIRMAN_MESSAGE?.descriptionFr ?? ""}
                  onChange={(e) => updateSection("CHAIRMAN_MESSAGE", { descriptionFr: e.target.value })}
                  rows={8}
                />
              </Field>
              <Field label="Message (EN)">
                <Textarea
                  value={sections.CHAIRMAN_MESSAGE?.descriptionEn ?? ""}
                  onChange={(e) => updateSection("CHAIRMAN_MESSAGE", { descriptionEn: e.target.value })}
                  rows={8}
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nom (FR)">
                  <Input
                    value={sections.CHAIRMAN_MESSAGE?.subtitleFr ?? ""}
                    onChange={(e) => updateSection("CHAIRMAN_MESSAGE", { subtitleFr: e.target.value })}
                    placeholder="Yosra Torjmen"
                  />
                </Field>
                <Field label="Nom (EN)">
                  <Input
                    value={sections.CHAIRMAN_MESSAGE?.subtitleEn ?? ""}
                    onChange={(e) => updateSection("CHAIRMAN_MESSAGE", { subtitleEn: e.target.value })}
                  />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Fonction (FR)">
                  <Input
                    value={sections.CHAIRMAN_MESSAGE?.ctaTextFr ?? ""}
                    onChange={(e) => updateSection("CHAIRMAN_MESSAGE", { ctaTextFr: e.target.value })}
                    placeholder="Managing Director, Fondatrice de PMO Mastery"
                  />
                </Field>
                <Field label="Fonction (EN)">
                  <Input
                    value={sections.CHAIRMAN_MESSAGE?.ctaTextEn ?? ""}
                    onChange={(e) => updateSection("CHAIRMAN_MESSAGE", { ctaTextEn: e.target.value })}
                  />
                </Field>
              </div>
              <ImageUploader
                label="Photo"
                value={sections.CHAIRMAN_MESSAGE?.backgroundImage}
                onChange={(url) => updateSection("CHAIRMAN_MESSAGE", { backgroundImage: url })}
                aspectRatio="portrait"
              />
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label className="text-sm">Afficher sur la page d'accueil</Label>
                </div>
                <Switch
                  checked={sections.CHAIRMAN_MESSAGE?.isActive ?? true}
                  onCheckedChange={(v) => updateSection("CHAIRMAN_MESSAGE", { isActive: v })}
                />
              </div>
            </div>
            <SaveButton onClick={() => saveSection("CHAIRMAN_MESSAGE")} saving={savingKey === "CHAIRMAN_MESSAGE"} />
          </FormCard>
        </TabsContent>

        {/* GALLERY HERO */}
        <TabsContent value="GALLERY_HERO">
          <FormCard
            title="Hero de la page Galerie"
            description="Une seule vidéo en fond, en lecture automatique, derrière le titre « Moments / Highlights »."
          >
            <div className="space-y-5">
              <VideoUploader
                label="Vidéo de fond (MP4/WebM, muette, en boucle)"
                value={sections.GALLERY_HERO?.backgroundImage}
                onChange={(url) => updateSection("GALLERY_HERO", { backgroundImage: url })}
              />
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label className="text-sm">Activer la vidéo de fond</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Désactivez pour revenir au fond dégradé statique.
                  </p>
                </div>
                <Switch
                  checked={sections.GALLERY_HERO?.isActive ?? true}
                  onCheckedChange={(v) => updateSection("GALLERY_HERO", { isActive: v })}
                />
              </div>
            </div>
            <SaveButton onClick={() => saveSection("GALLERY_HERO")} saving={savingKey === "GALLERY_HERO"} />
          </FormCard>
        </TabsContent>

        {/* PASSES HERO */}
        <TabsContent value="PASSES_HERO">
          <FormCard
            title="Hero de la page Pass"
            description="Image de fond derrière le titre de la page des pass/billets."
          >
            <div className="space-y-5">
              <ImageUploader
                label="Image de fond"
                value={sections.PASSES_HERO?.backgroundImage}
                onChange={(url) => updateSection("PASSES_HERO", { backgroundImage: url })}
                aspectRatio="wide"
              />
            </div>
            <SaveButton onClick={() => saveSection("PASSES_HERO")} saving={savingKey === "PASSES_HERO"} />
          </FormCard>
        </TabsContent>

        {/* COUNTDOWN */}
        <TabsContent value="COUNTDOWN">
          <FormCard
            title="Compte à rebours"
            description="Le compte à rebours affiché sur la page d'accueil compte automatiquement les jours, heures, minutes et secondes jusqu'à la date de l'événement."
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label className="text-sm">Afficher sur la page d'accueil</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Désactivez pour masquer le compte à rebours sans le supprimer.
                  </p>
                </div>
                <Switch
                  checked={sections.COUNTDOWN?.isActive ?? true}
                  onCheckedChange={(v) => updateSection("COUNTDOWN", { isActive: v })}
                />
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20 text-sm text-muted-foreground">
                <Clock3 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  La date de fin du compte à rebours est celle configurée dans{" "}
                  <Link href="/admin/event" className="text-primary hover:underline inline-flex items-center gap-1">
                    Événement <ArrowRight className="w-3 h-3" />
                  </Link>{" "}
                  (champ « Cible du compte à rebours »).
                </div>
              </div>
            </div>
            <SaveButton onClick={() => saveSection("COUNTDOWN")} saving={savingKey === "COUNTDOWN"} />
          </FormCard>
        </TabsContent>

        {/* FOOTER */}
        <TabsContent value="FOOTER">
          <FormCard title="Footer" description="Texte et copyright affichés en bas de chaque page.">
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Description (FR)">
                  <Textarea
                    value={sections.FOOTER?.descriptionFr ?? ""}
                    onChange={(e) => updateSection("FOOTER", { descriptionFr: e.target.value })}
                    rows={4}
                    placeholder="PMO Mastery se positionne comme un événement de référence…"
                  />
                </Field>
                <Field label="Description (EN)">
                  <Textarea
                    value={sections.FOOTER?.descriptionEn ?? ""}
                    onChange={(e) => updateSection("FOOTER", { descriptionEn: e.target.value })}
                    rows={4}
                    placeholder="PMO Mastery positions itself as a landmark event…"
                  />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Copyright (FR)">
                  <Input
                    value={sections.FOOTER?.titleFr ?? ""}
                    onChange={(e) => updateSection("FOOTER", { titleFr: e.target.value })}
                    placeholder="© 2025 PMO Mastery — Empowerment Paths"
                  />
                </Field>
                <Field label="Copyright (EN)">
                  <Input
                    value={sections.FOOTER?.titleEn ?? ""}
                    onChange={(e) => updateSection("FOOTER", { titleEn: e.target.value })}
                    placeholder="© 2025 PMO Mastery — Empowerment Paths"
                  />
                </Field>
              </div>
            </div>
            <SaveButton onClick={() => saveSection("FOOTER")} saving={savingKey === "FOOTER"} />
          </FormCard>
        </TabsContent>

        {/* CONTACT */}
        <TabsContent value="CONTACT">
          <FormCard title="Coordonnées & réseaux sociaux" description="Informations affichées dans le footer et la section contact.">
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Email">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={contact.email ?? ""}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      className="pl-10"
                      placeholder="contact@pmomastery.tn"
                    />
                  </div>
                </Field>
                <Field label="Téléphone">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={contact.phone ?? ""}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      className="pl-10"
                      placeholder="+216 94 108 023"
                    />
                  </div>
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Adresse">
                  <Input
                    value={contact.address ?? ""}
                    onChange={(e) => setContact({ ...contact, address: e.target.value })}
                  />
                </Field>
                <Field label="Ville">
                  <Input
                    value={contact.city ?? ""}
                    onChange={(e) => setContact({ ...contact, city: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Pays">
                <Input
                  value={contact.country ?? ""}
                  onChange={(e) => setContact({ ...contact, country: e.target.value })}
                />
              </Field>
              <Field label="URL Google Maps (embed)">
                <Input
                  value={contact.mapUrl ?? ""}
                  onChange={(e) => setContact({ ...contact, mapUrl: e.target.value })}
                />
              </Field>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Réseaux sociaux
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="LinkedIn">
                    <Input
                      value={contact.linkedinUrl ?? ""}
                      onChange={(e) => setContact({ ...contact, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/company/…"
                    />
                  </Field>
                  <Field label="Facebook">
                    <Input
                      value={contact.facebookUrl ?? ""}
                      onChange={(e) => setContact({ ...contact, facebookUrl: e.target.value })}
                    />
                  </Field>
                  <Field label="Instagram">
                    <Input
                      value={contact.instagramUrl ?? ""}
                      onChange={(e) => setContact({ ...contact, instagramUrl: e.target.value })}
                    />
                  </Field>
                  <Field label="YouTube">
                    <Input
                      value={contact.youtubeUrl ?? ""}
                      onChange={(e) => setContact({ ...contact, youtubeUrl: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            </div>
            <SaveButton onClick={saveContact} saving={savingKey === "contact"} label="Enregistrer les coordonnées" />
          </FormCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SaveButton({
  onClick,
  saving,
  label = "Enregistrer",
}: {
  onClick: () => void
  saving: boolean
  label?: string
}) {
  return (
    <div className="flex justify-end pt-4 mt-6 border-t">
      <Button onClick={onClick} disabled={saving} className="bg-pmo-violet-gradient text-white">
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enregistrement…
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            {label}
          </>
        )}
      </Button>
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
