"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, Save, Calendar, MapPin, Image as ImageIcon, Settings2, Plus, Check, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface EventData {
  id: string
  slug: string
  editionName: string
  titleFr: string
  titleEn: string
  subtitleFr?: string | null
  subtitleEn?: string | null
  themeTaglineFr?: string | null
  themeTaglineEn?: string | null
  descriptionFr?: string | null
  descriptionEn?: string | null
  startDate: string
  endDate?: string | null
  startTime?: string | null
  endTime?: string | null
  timezone: string
  countdownTarget?: string | null
  venue?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  latitude?: number | null
  longitude?: number | null
  mapUrl?: string | null
  heroImageDesktop?: string | null
  heroImageMobile?: string | null
  heroLogo?: string | null
  ogImage?: string | null
  registrationEnabled: boolean
  status: string
  isActive: boolean
}

function toLocalInput(d: string | null | undefined): string {
  if (!d) return ""
  try {
    const date = new Date(d)
    return format(date, "yyyy-MM-dd'T'HH:mm")
  } catch {
    return ""
  }
}

function toLocalDate(d: string | null | undefined): string {
  if (!d) return ""
  try {
    return format(new Date(d), "yyyy-MM-dd")
  } catch {
    return ""
  }
}

function blankTemplate(): EventData {
  return {
    id: "",
    slug: "pmo-mastery-" + new Date().getFullYear(),
    editionName: "PMO Mastery " + new Date().getFullYear(),
    titleFr: "",
    titleEn: "",
    subtitleFr: "",
    subtitleEn: "",
    themeTaglineFr: "",
    themeTaglineEn: "",
    descriptionFr: "",
    descriptionEn: "",
    startDate: new Date().toISOString(),
    endDate: null,
    startTime: "09:00",
    endTime: "18:00",
    timezone: "Africa/Tunis",
    countdownTarget: null,
    venue: "",
    address: "",
    city: "Tunis",
    country: "Tunisie",
    latitude: null,
    longitude: null,
    mapUrl: "",
    heroImageDesktop: "",
    heroImageMobile: "",
    heroLogo: "",
    ogImage: "",
    registrationEnabled: true,
    status: "UPCOMING",
    isActive: true,
  }
}

export default function EventAdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<EventData | null>(null)
  const [allEvents, setAllEvents] = useState<
    Array<{ id: string; editionName: string; titleFr: string; startDate: string; isActive: boolean }>
  >([])
  const [confirmDeactivateOpen, setConfirmDeactivateOpen] = useState(false)

  useEffect(() => {
    void load(searchParams.get("id") ?? undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  async function load(id?: string) {
    setLoading(true)
    try {
      const res = await fetch(id ? `/api/admin/event?id=${id}` : "/api/admin/event")
      const json = await res.json()
      setAllEvents(json.all ?? [])
      // No event yet at all — start with a blank template
      setData(json.active ?? blankTemplate())
    } catch {
      toast.error("Échec du chargement de l'événement.")
    } finally {
      setLoading(false)
    }
  }

  function startNewEdition() {
    // Client-only state reset — no navigation needed, and none wanted:
    // router.replace() here would re-trigger the searchParams effect below
    // and immediately refetch + overwrite this blank template with the
    // active event's data.
    setData(blankTemplate())
  }

  // True when `data` is the only currently-active event (per the last load),
  // so saving it with isActive=false would leave the public site with no
  // active event at all.
  function wouldLeaveNoActiveEvent() {
    if (!data?.id) return false
    const activeEvents = allEvents.filter((e) => e.isActive)
    return activeEvents.length === 1 && activeEvents[0].id === data.id
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!data) return
    if (!data.isActive && wouldLeaveNoActiveEvent()) {
      setConfirmDeactivateOpen(true)
      return
    }
    await save()
  }

  async function save() {
    if (!data) return
    setSaving(true)
    try {
      const payload = { ...data }
      const res = await fetch(
        data.id ? `/api/admin/event/${data.id}` : "/api/admin/event",
        {
          method: data.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Save failed")
      toast.success("Événement enregistré avec succès.")
      setData(json)
      await load(json.id)
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de l'enregistrement.")
    } finally {
      setSaving(false)
      setConfirmDeactivateOpen(false)
    }
  }

  function update<K extends keyof EventData>(key: K, value: EventData[K]) {
    setData((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Événement"
        description="Configuration de l'événement actif PMO Mastery."
        actions={
          <Button type="submit" disabled={saving} className="bg-pmo-violet-gradient text-white">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enregistrement…
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        }
      />

      {/* Edition switcher */}
      {allEvents.length > 0 && (
        <FormCard title="Éditions" description="Basculez entre les éditions de l'événement.">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allEvents.map((ev) => (
              <button
                key={ev.id}
                type="button"
                onClick={() => router.push(`/admin/event?id=${ev.id}`)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  ev.id === data?.id
                    ? "border-primary bg-primary/5 shadow-premium"
                    : "border-border hover:border-primary/40 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-semibold">{ev.editionName}</span>
                  {ev.isActive && (
                    <Badge className="bg-emerald-500 text-white text-xs">Active</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground truncate">{ev.titleFr}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {format(new Date(ev.startDate), "dd MMM yyyy")}
                </div>
              </button>
            ))}
            <button
              type="button"
              onClick={startNewEdition}
              className="rounded-xl border-2 border-dashed border-muted-foreground/30 p-4 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">Nouvelle édition</span>
            </button>
          </div>
        </FormCard>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 lg:w-fit">
          <TabsTrigger value="general" className="gap-2">
            <Settings2 className="w-4 h-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="dates" className="gap-2">
            <Calendar className="w-4 h-4" />
            Dates
          </TabsTrigger>
          <TabsTrigger value="location" className="gap-2">
            <MapPin className="w-4 h-4" />
            Lieu
          </TabsTrigger>
          <TabsTrigger value="media" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            Médias
          </TabsTrigger>
          <TabsTrigger value="status" className="gap-2">
            <Check className="w-4 h-4" />
            Statut
          </TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <FormCard title="Informations générales" description="Titre, sous-titre, thème, descriptions.">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Slug (URL)" required>
                <Input value={data?.slug ?? ""} onChange={(e) => update("slug", e.target.value)} required />
              </Field>
              <Field label="Nom de l'édition" required>
                <Input
                  value={data?.editionName ?? ""}
                  onChange={(e) => update("editionName", e.target.value)}
                  placeholder="PMO Mastery 2026"
                  required
                />
              </Field>
            </div>

            <div className="mt-6 mb-4 pb-2 border-b">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                🇫🇷 Version française
              </h4>
            </div>
            <div className="space-y-4">
              <Field label="Titre (FR)" required>
                <Input
                  value={data?.titleFr ?? ""}
                  onChange={(e) => update("titleFr", e.target.value)}
                  placeholder="Événement international pour les leaders des PMOs"
                  required
                />
              </Field>
              <Field label="Sous-titre (FR)">
                <Input
                  value={data?.subtitleFr ?? ""}
                  onChange={(e) => update("subtitleFr", e.target.value)}
                  placeholder="11–12 octobre 2025 · Tunis"
                />
              </Field>
              <Field label="Thème / Slogan (FR)">
                <Input
                  value={data?.themeTaglineFr ?? ""}
                  onChange={(e) => update("themeTaglineFr", e.target.value)}
                  placeholder="Le PMO du Futur : Stratégie, IA et Performance"
                />
              </Field>
              <Field label="Description (FR)">
                <Textarea
                  value={data?.descriptionFr ?? ""}
                  onChange={(e) => update("descriptionFr", e.target.value)}
                  rows={4}
                  placeholder="Présentation détaillée de l'événement…"
                />
              </Field>
            </div>

            <div className="mt-6 mb-4 pb-2 border-b">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                🇬🇧 English version
              </h4>
            </div>
            <div className="space-y-4">
              <Field label="Title (EN)" required>
                <Input
                  value={data?.titleEn ?? ""}
                  onChange={(e) => update("titleEn", e.target.value)}
                  placeholder="International Event for PMO Leaders"
                  required
                />
              </Field>
              <Field label="Subtitle (EN)">
                <Input
                  value={data?.subtitleEn ?? ""}
                  onChange={(e) => update("subtitleEn", e.target.value)}
                  placeholder="October 11–12, 2025 · Tunis"
                />
              </Field>
              <Field label="Theme / Tagline (EN)">
                <Input
                  value={data?.themeTaglineEn ?? ""}
                  onChange={(e) => update("themeTaglineEn", e.target.value)}
                  placeholder="The PMO of the Future: Strategy, AI and Performance"
                />
              </Field>
              <Field label="Description (EN)">
                <Textarea
                  value={data?.descriptionEn ?? ""}
                  onChange={(e) => update("descriptionEn", e.target.value)}
                  rows={4}
                />
              </Field>
            </div>
          </FormCard>
        </TabsContent>

        {/* Dates */}
        <TabsContent value="dates">
          <FormCard
            title="Dates & compte à rebours"
            description="Configurez les dates de l'événement et l'instant cible du compte à rebours."
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Date de début" required>
                <Input
                  type="datetime-local"
                  value={toLocalInput(data?.startDate)}
                  onChange={(e) => update("startDate", new Date(e.target.value).toISOString())}
                  required
                />
              </Field>
              <Field label="Date de fin">
                <Input
                  type="datetime-local"
                  value={toLocalInput(data?.endDate)}
                  onChange={(e) =>
                    update("endDate", e.target.value ? new Date(e.target.value).toISOString() : null)
                  }
                />
              </Field>
              <Field label="Heure de début (affichée)">
                <Input
                  type="time"
                  value={data?.startTime ?? ""}
                  onChange={(e) => update("startTime", e.target.value)}
                />
              </Field>
              <Field label="Heure de fin (affichée)">
                <Input
                  type="time"
                  value={data?.endTime ?? ""}
                  onChange={(e) => update("endTime", e.target.value)}
                />
              </Field>
              <Field label="Fuseau horaire">
                <Select value={data?.timezone} onValueChange={(v) => update("timezone", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Tunis">Africa/Tunis (UTC+1)</SelectItem>
                    <SelectItem value="Europe/Paris">Europe/Paris (CET)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field
                label="Cible du compte à rebours"
                hint="Par défaut, c'est la date de début. Spécifiez une heure exacte si différente."
              >
                <Input
                  type="datetime-local"
                  value={toLocalInput(data?.countdownTarget)}
                  onChange={(e) =>
                    update(
                      "countdownTarget",
                      e.target.value ? new Date(e.target.value).toISOString() : null,
                    )
                  }
                />
              </Field>
            </div>

            <div className="mt-6 rounded-xl bg-muted/50 p-4 text-sm">
              <div className="font-medium mb-1">Aperçu</div>
              <div className="text-muted-foreground">
                {data?.startDate && (
                  <>
                    Du {format(new Date(data.startDate), "dd MMMM yyyy", {})}{" "}
                    {data?.startTime && `à ${data.startTime}`}
                    {data?.endDate && (
                      <>
                        {" "}
                        au {format(new Date(data.endDate), "dd MMMM yyyy", {})}
                        {data?.endTime && `à ${data.endTime}`}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </FormCard>
        </TabsContent>

        {/* Location */}
        <TabsContent value="location">
          <FormCard title="Lieu" description="Adresse, ville, coordonnées GPS et carte.">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Lieu / Salle">
                <Input
                  value={data?.venue ?? ""}
                  onChange={(e) => update("venue", e.target.value)}
                  placeholder="Royal Tulip Taj Sultan"
                />
              </Field>
              <Field label="Adresse">
                <Input
                  value={data?.address ?? ""}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Les Berges du Lac, Tunis"
                />
              </Field>
              <Field label="Ville">
                <Input
                  value={data?.city ?? ""}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="Tunis"
                />
              </Field>
              <Field label="Pays">
                <Input
                  value={data?.country ?? ""}
                  onChange={(e) => update("country", e.target.value)}
                  placeholder="Tunisie"
                />
              </Field>
              <Field label="Latitude">
                <Input
                  type="number"
                  step="any"
                  value={data?.latitude ?? ""}
                  onChange={(e) => update("latitude", e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="36.8381"
                />
              </Field>
              <Field label="Longitude">
                <Input
                  type="number"
                  step="any"
                  value={data?.longitude ?? ""}
                  onChange={(e) => update("longitude", e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="10.2497"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="URL Google Maps (embed)">
                  <Input
                    value={data?.mapUrl ?? ""}
                    onChange={(e) => update("mapUrl", e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=…"
                  />
                </Field>
              </div>
            </div>
          </FormCard>
        </TabsContent>

        {/* Media */}
        <TabsContent value="media">
          <FormCard title="Médias" description="Images hero, logo et image Open Graph.">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <ImageUploader
                label="Logo"
                value={data?.heroLogo}
                onChange={(url) => update("heroLogo", url)}
                aspectRatio="square"
              />
              <ImageUploader
                label="Image Hero (desktop)"
                value={data?.heroImageDesktop}
                onChange={(url) => update("heroImageDesktop", url)}
                aspectRatio="wide"
              />
              <ImageUploader
                label="Image Hero (mobile)"
                value={data?.heroImageMobile}
                onChange={(url) => update("heroImageMobile", url)}
                aspectRatio="portrait"
              />
              <ImageUploader
                label="Image Open Graph"
                value={data?.ogImage}
                onChange={(url) => update("ogImage", url)}
                aspectRatio="wide"
              />
            </div>
          </FormCard>
        </TabsContent>

        {/* Status */}
        <TabsContent value="status">
          <FormCard title="Statut & visibilité" description="Contrôlez la visibilité et l'état de l'événement.">
            <div className="space-y-5">
              <Field label="Statut">
                <Select value={data?.status} onValueChange={(v) => update("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPCOMING">À venir</SelectItem>
                    <SelectItem value="LIVE">En cours</SelectItem>
                    <SelectItem value="ENDED">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <div className="flex items-center justify-between p-4 rounded-xl border">
                <div>
                  <div className="font-medium">Inscriptions ouvertes</div>
                  <div className="text-sm text-muted-foreground">
                    Affiche les boutons d'inscription sur le site public.
                  </div>
                </div>
                <Switch
                  checked={data?.registrationEnabled}
                  onCheckedChange={(v) => update("registrationEnabled", v)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border">
                <div>
                  <div className="font-medium">Édition active</div>
                  <div className="text-sm text-muted-foreground">
                    Une seule édition peut être active à la fois. Le site public affichera celle-ci.
                  </div>
                </div>
                <Switch
                  checked={data?.isActive}
                  onCheckedChange={(v) => update("isActive", v)}
                />
              </div>
            </div>
          </FormCard>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving} className="bg-pmo-violet-gradient text-white">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enregistrement…
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </div>

      <AlertDialog open={confirmDeactivateOpen} onOpenChange={setConfirmDeactivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Désactiver la seule édition active ?</AlertDialogTitle>
            <AlertDialogDescription className="flex items-start gap-2 pt-2">
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <span>
                Aucune autre édition n&apos;est active. Le site public n&apos;affichera plus aucun
                événement sur ses 10 pages tant qu&apos;une édition ne sera pas réactivée.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={save}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Désactiver quand même
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  )
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
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
