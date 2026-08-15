"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { FormCard } from "@/components/admin/form-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Lock, KeyRound, CheckCircle2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const strength = passwordStrength(newPassword)
  const passwordsMatch = newPassword === confirmPassword
  const canSubmit =
    currentPassword.length > 0 && newPassword.length >= 8 && passwordsMatch

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed")
      toast.success("Mot de passe modifié avec succès.")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de la modification.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader title="Paramètres" description="Gérez votre compte administrateur." />

      <form onSubmit={handleSubmit}>
        <FormCard
          title="Sécurité du compte"
          description="Modifiez votre mot de passe. Utilisez au moins 8 caractères."
        >
          <div className="space-y-4 max-w-md">
            <Field label="Mot de passe actuel" required>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </Field>

            <Field label="Nouveau mot de passe" required>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={8}
                />
              </div>
              {newPassword.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        strength.score <= 1
                          ? "bg-red-500 w-1/4"
                          : strength.score === 2
                            ? "bg-amber-500 w-1/2"
                            : strength.score === 3
                              ? "bg-blue-500 w-3/4"
                              : "bg-emerald-500 w-full"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-20">{strength.label}</span>
                </div>
              )}
            </Field>

            <Field label="Confirmer le nouveau mot de passe" required>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 ${
                    confirmPassword && !passwordsMatch ? "border-destructive" : ""
                  }`}
                  required
                />
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" />
                  Les mots de passe ne correspondent pas.
                </p>
              )}
              {confirmPassword && passwordsMatch && (
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Les mots de passe correspondent.
                </p>
              )}
            </Field>

            <Button
              type="submit"
              disabled={!canSubmit || saving}
              className="bg-pmo-violet-gradient text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Modification…
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 mr-2" />
                  Modifier le mot de passe
                </>
              )}
            </Button>
          </div>
        </FormCard>
      </form>

      <FormCard title="Informations système">
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Stack</dt>
            <dd className="font-medium mt-0.5">Next.js 16 · React 19 · Prisma · SQLite</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Authentification</dt>
            <dd className="font-medium mt-0.5">NextAuth.js (JWT, 8h)</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">i18n</dt>
            <dd className="font-medium mt-0.5">FR / EN (champs DB bilingues)</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Médiathèque</dt>
            <dd className="font-medium mt-0.5">Sharp (WebP, max 1600px)</dd>
          </div>
        </dl>
      </FormCard>
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

function passwordStrength(pwd: string): { score: number; label: string } {
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  const labels = ["Très faible", "Faible", "Moyen", "Bon", "Excellent"]
  return { score, label: labels[score] }
}
