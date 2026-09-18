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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Save, Link2, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { slugify } from "@/lib/utils"

interface PassForm {
  id?: string
  slug: string
  nameFr: string
  nameEn?: string | null
  image?: string | null
  descriptionFr?: string | null
  descriptionEn?: string | null
  price: number
  currency: string
  vatRate: number
  featuresFr?: string | null
  featuresEn?: string | null
  paymentUrl?: string | null
  minQuantity: number
  isFeatured: boolean
  isActive: boolean
  displayOrder: number
}

export function PassForm({ initial }: { initial?: PassForm }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<PassForm>(
    initial ?? {
      slug: "",
      nameFr: "",
      nameEn: "",
      image: null,
      descriptionFr: "",
      descriptionEn: "",
      price: 0,
      currency: "TND",
      vatRate: 0.19,
      featuresFr: "",
      featuresEn: "",
      paymentUrl: "",
      minQuantity: 1,
      isFeatured: false,
      isActive: true,
      displayOrder: 0,
    },
  )

  useEffect(() => {
    if (!initial && data.nameFr) {
      setData((d) => ({ ...d, slug: slugify(d.nameFr) }))
    }
     
  }, [data.nameFr])

  function update<K extends keyof PassForm>(key: K, value: PassForm[K]) {
    setData((d) => ({ ...d, [key]: value }))
  }

  const paymentUrlValid = !data.paymentUrl || /^https?:\/\/.+\..+/.test(data.paymentUrl)
  const priceWithVat = data.price + data.price * data.vatRate

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!data.nameFr) {
      toast.error("Le nom du pass est obligatoire.")
      return
    }
    if (!paymentUrlValid) {
      toast.error("L'URL de paiement est invalide.")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(data.id ? `/api/admin/passes/${data.id}` : "/api/admin/passes", {
        method: data.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Save failed")
      toast.success(data.id ? "Pass mis à jour." : "Pass créé.")
      router.push("/admin/passes")
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
        title={data.id ? "Modifier le pass" : "Nouveau pass"}
        description="Configurez le pass et son lien de paiement externe."
        backHref="/admin/passes"
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
        <div className="lg:col-span-2 space-y-6">
          <FormCard title="Image">
            <ImageUploader
              value={data.image}
              onChange={(url) => update("image", url)}
              aspectRatio="wide"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Format paysage 16:9 recommandé (ex. 1200×675px, min. 800×450px). Gardez le sujet centré, sans rien coller aux bords : l'image est recadrée en bandeau au-dessus de chaque carte.
            </p>
          </FormCard>

          <FormCard>
            <Tabs defaultValue="fr">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="fr">🇫🇷 Français</TabsTrigger>
                <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
              </TabsList>

              <TabsContent value="fr" className="space-y-4">
                <Field label="Nom du pass (FR)" required>
                  <Input
                    value={data.nameFr}
                    onChange={(e) => update("nameFr", e.target.value)}
                    placeholder="Pass Événement"
                    required
                  />
                </Field>
                <Field label="Description (FR)">
                  <Textarea
                    value={data.descriptionFr ?? ""}
                    onChange={(e) => update("descriptionFr", e.target.value)}
                    rows={3}
                  />
                </Field>
                <Field label="Inclus (FR)" hint="Une ligne par avantage.">
                  <Textarea
                    value={data.featuresFr ?? ""}
                    onChange={(e) => update("featuresFr", e.target.value)}
                    rows={6}
                    placeholder={"Accès aux 2 jours\nCoffrets & goodies\nPause café & déjeuner"}
                  />
                </Field>
              </TabsContent>

              <TabsContent value="en" className="space-y-4">
                <Field label="Pass name (EN)">
                  <Input
                    value={data.nameEn ?? ""}
                    onChange={(e) => update("nameEn", e.target.value)}
                    placeholder="Event Pass"
                  />
                </Field>
                <Field label="Description (EN)">
                  <Textarea
                    value={data.descriptionEn ?? ""}
                    onChange={(e) => update("descriptionEn", e.target.value)}
                    rows={3}
                  />
                </Field>
                <Field label="Features (EN)" hint="One per line.">
                  <Textarea
                    value={data.featuresEn ?? ""}
                    onChange={(e) => update("featuresEn", e.target.value)}
                    rows={6}
                  />
                </Field>
              </TabsContent>
            </Tabs>
          </FormCard>

          {/* Payment URL — critical */}
          <FormCard
            title="Lien de paiement"
            description="URL externe vers laquelle l'utilisateur sera redirigé en cliquant sur « Obtenir ce pass »."
          >
            <div className="space-y-3">
              <Field label="URL de paiement / inscription">
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="url"
                    value={data.paymentUrl ?? ""}
                    onChange={(e) => update("paymentUrl", e.target.value)}
                    placeholder="https://example.com/payment/?ticket_id=154"
                    className={`pl-10 ${!paymentUrlValid ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
              </Field>
              <div
                className={`flex items-center gap-2 text-sm ${
                  paymentUrlValid ? "text-emerald-600" : "text-destructive"
                }`}
              >
                {paymentUrlValid ? (
                  data.paymentUrl ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      URL valide — le bouton redirigera vers cette adresse.
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      Aucun lien configuré — le bouton sera masqué sur le site public.
                    </>
                  )
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    URL invalide — doit commencer par http:// ou https://
                  </>
                )}
              </div>
            </div>
          </FormCard>
        </div>

        {/* Right column: pricing + status */}
        <div className="space-y-6">
          <FormCard title="Tarification">
            <div className="space-y-4">
              <Field label="Prix HT" required>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={data.price}
                  onChange={(e) => update("price", parseFloat(e.target.value || "0"))}
                />
              </Field>
              <Field label="Devise">
                <Select value={data.currency} onValueChange={(v) => update("currency", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TND">TND — Dinar tunisien</SelectItem>
                    <SelectItem value="EUR">EUR — Euro</SelectItem>
                    <SelectItem value="USD">USD — Dollar US</SelectItem>
                    <SelectItem value="GBP">GBP — Livre sterling</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Taux de TVA">
                <Select
                  value={String(data.vatRate)}
                  onValueChange={(v) => update("vatRate", parseFloat(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0% (HT)</SelectItem>
                    <SelectItem value="0.07">7%</SelectItem>
                    <SelectItem value="0.13">13%</SelectItem>
                    <SelectItem value="0.19">19% (Tunisie)</SelectItem>
                    <SelectItem value="0.2">20%</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Quantité minimale">
                <Input
                  type="number"
                  min="1"
                  value={data.minQuantity}
                  onChange={(e) => update("minQuantity", parseInt(e.target.value || "1", 10))}
                />
              </Field>
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                  Prix TTC
                </div>
                <div className="font-display text-xl font-bold">
                  {data.price + data.price * data.vatRate} {data.currency}
                </div>
              </div>
            </div>
          </FormCard>

          <FormCard title="Visibilité">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Pass recommandé</Label>
                <Switch
                  checked={data.isFeatured}
                  onCheckedChange={(v) => update("isFeatured", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Actif (visible publiquement)</Label>
                <Switch
                  checked={data.isActive}
                  onCheckedChange={(v) => update("isActive", v)}
                />
              </div>
              <Field label="Ordre d'affichage">
                <Input
                  type="number"
                  value={data.displayOrder}
                  onChange={(e) => update("displayOrder", parseInt(e.target.value || "0", 10))}
                />
              </Field>
              <Field label="Slug (URL)">
                <Input
                  value={data.slug}
                  onChange={(e) => update("slug", slugify(e.target.value))}
                  className="font-mono text-sm"
                />
              </Field>
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
