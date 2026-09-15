"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const search = useSearchParams()
  const callbackUrl = search.get("callbackUrl") ?? "/admin"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      })
      if (res?.error) {
        setError("Identifiants invalides. Vérifiez votre email et mot de passe.")
        return
      }
      if (!res?.ok) {
        setError("Connexion impossible. Vérifiez que le serveur est bien démarré et réessayez.")
        return
      }
      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError("Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-pmo-navy-gradient">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-pmo-navy-gradient text-white">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-pmo-violet/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-pmo-gold/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pmo-violet-gradient flex items-center justify-center font-display font-bold text-lg">
                P
              </div>
              <span className="font-display font-semibold text-xl tracking-tight">PMO Mastery</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs uppercase tracking-widest text-white/70">
              <ShieldCheck className="w-3.5 h-3.5" />
              Back Office
            </div>
            <h1 className="font-display text-4xl xl:text-5xl font-bold leading-tight">
              Gérez votre événement<br />
              <span className="text-gradient-violet">en toute autonomie.</span>
            </h1>
            <p className="text-white/70 text-lg max-w-md leading-relaxed">
              Speakers, programme, passes, partenaires, contenu du site —
              tout est pilotable depuis ce tableau de bord. Plus besoin d'un développeur
              pour chaque modification.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-6 max-w-md">
              {[
                { v: "FR/EN", l: "Bilingue" },
                { v: "100%", l: "Dynamique" },
                { v: "SEO", l: "Optimisé" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="font-display text-xl font-semibold">{s.v}</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-white/40">
            © {new Date().getFullYear()} PMO Mastery — Empowerment Paths. Tous droits réservés.
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-pmo-violet-gradient flex items-center justify-center font-display font-bold text-lg text-white">
              P
            </div>
            <span className="font-display font-semibold text-xl text-foreground">PMO Mastery</span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground">Connexion</h2>
            <p className="text-muted-foreground mt-2">
              Accédez à votre tableau de bord d'administration.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@pmomastery.tn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 text-destructive text-sm px-4 py-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-pmo-violet-gradient hover:opacity-90 text-white font-medium shadow-premium"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion…
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Retour au site public
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
