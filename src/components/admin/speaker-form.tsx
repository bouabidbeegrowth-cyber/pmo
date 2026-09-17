"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { FormCard } from "@/components/admin/form-card"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { slugify } from "@/lib/utils"

interface SpeakerForm {
  id?: string
  slug: string
  firstName: string
  lastName: string
  photo?: string | null
  positionFr?: string | null
  positionEn?: string | null
  company?: string | null
  biographyFr?: string | null
  biographyEn?: string | null
  country?: string | null
  linkedinUrl?: string | null
  websiteUrl?: string | null
  twitterUrl?: string | null
  isFeatured: boolean
  isActive: boolean
  displayOrder: number
}

export function SpeakerForm({ initial }: { initial?: SpeakerForm }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<SpeakerForm>(
    initial ?? {
      slug: "",
      firstName: "",
      lastName: "",
      photo: null,
      positionFr: "",
      positionEn: "",
      company: "",
      biographyFr: "",
      biographyEn: "",
      country: "",
      linkedinUrl: "",
      websiteUrl: "",
      twitterUrl: "",
      isFeatured: false,
      isActive: true,
      displayOrder: 0,
    },
  )

  // Auto-generate slug from name (only on create / when slug empty)
  useEffect(() => {
    if (!initial && data.firstName && data.lastName) {
      setData((d) => ({ ...d, slug: slugify(`${d.firstName}-${d.lastName}`) }))
    }
     
  }, [data.firstName, data.lastName])

  function update<K extends keyof SpeakerForm>(key: K, value: SpeakerForm[K]) {
    setData((d) => ({ ...d, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!data.firstName || !data.lastName) {
      toast.error("Le prénom et le nom sont obligatoires.")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(
        data.id ? `/api/admin/speakers/${data.id}` : "/api/admin/speakers",
        {
          method: data.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Save failed")
      toast.success(data.id ? "Speaker mis à jour." : "Speaker créé.")
      router.push("/admin/speakers")
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de l'enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={data.id ? "Modifier le speaker" : "Nouveau speaker"}
        description="Renseignez les informations de l'intervenant."
        backHref="/admin/speakers"
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: photo + status */}
        <div className="space-y-6">
          <FormCard title="Photo">
            <ImageUploader
              value={data.photo}
              onChange={(url) => update("photo", url)}
              aspectRatio="portrait"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Format portrait 3:4 recommandé (ex. 900×1200px, min. 1200×1600px pour la meilleure qualité). Gardez le visage — et tout logo — bien centré, sans rien coller aux bords : la photo est aussi recadrée en carré et en cercle ailleurs sur le site.
            </p>
          </FormCard>

          <FormCard title="Visibilité">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Actif (visible publiquement)</Label>
                <Switch
                  checked={data.isActive}
                  onCheckedChange={(v) => update("isActive", v)}
                />
              </div>
              <div>
                <Label className="text-sm">Ordre d'affichage</Label>
                <Input
                  type="number"
                  value={data.displayOrder}
                  onChange={(e) => update("displayOrder", parseInt(e.target.value || "0", 10))}
                  className="mt-1"
                />
              </div>
            </div>
          </FormCard>
        </div>

        {/* Right: details */}
        <div className="lg:col-span-2">
          <FormCard>
            <Tabs defaultValue="fr">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="fr">🇫🇷 Français</TabsTrigger>
                <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
              </TabsList>

              <TabsContent value="fr" className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Prénom" required>
                    <Input
                      value={data.firstName}
                      onChange={(e) => update("firstName", e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Nom" required>
                    <Input
                      value={data.lastName}
                      onChange={(e) => update("lastName", e.target.value)}
                      required
                    />
                  </Field>
                </div>
                <Field label="Poste / Titre (FR)">
                  <Input
                    value={data.positionFr ?? ""}
                    onChange={(e) => update("positionFr", e.target.value)}
                    placeholder="CEO, Lambert Consulting Group"
                  />
                </Field>
                <Field label="Biographie (FR)">
                  <Textarea
                    value={data.biographyFr ?? ""}
                    onChange={(e) => update("biographyFr", e.target.value)}
                    rows={8}
                    placeholder="Biographie détaillée du speaker…"
                  />
                </Field>
              </TabsContent>

              <TabsContent value="en" className="space-y-4">
                <Field label="Position (EN)">
                  <Input
                    value={data.positionEn ?? ""}
                    onChange={(e) => update("positionEn", e.target.value)}
                    placeholder="CEO, Lambert Consulting Group"
                  />
                </Field>
                <Field label="Biography (EN)">
                  <Textarea
                    value={data.biographyEn ?? ""}
                    onChange={(e) => update("biographyEn", e.target.value)}
                    rows={8}
                  />
                </Field>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Informations complémentaires
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Entreprise / Organisation">
                  <Input
                    value={data.company ?? ""}
                    onChange={(e) => update("company", e.target.value)}
                  />
                </Field>
                <Field label="Pays">
                  <Input
                    value={data.country ?? ""}
                    onChange={(e) => update("country", e.target.value)}
                    placeholder="Tunisie"
                  />
                </Field>
              </div>
              <Field label="Slug (URL)">
                <Input
                  value={data.slug}
                  onChange={(e) => update("slug", slugify(e.target.value))}
                  placeholder="auto-généré"
                  className="font-mono text-sm"
                />
              </Field>
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="LinkedIn">
                  <Input
                    value={data.linkedinUrl ?? ""}
                    onChange={(e) => update("linkedinUrl", e.target.value)}
                    placeholder="https://linkedin.com/in/…"
                  />
                </Field>
                <Field label="Site web">
                  <Input
                    value={data.websiteUrl ?? ""}
                    onChange={(e) => update("websiteUrl", e.target.value)}
                    placeholder="https://…"
                  />
                </Field>
                <Field label="Twitter / X">
                  <Input
                    value={data.twitterUrl ?? ""}
                    onChange={(e) => update("twitterUrl", e.target.value)}
                    placeholder="https://x.com/…"
                  />
                </Field>
              </div>
            </div>
          </FormCard>
        </div>
      </div>

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
              Enregistrer
            </>
          )}
        </Button>
      </div>
    </form>
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
