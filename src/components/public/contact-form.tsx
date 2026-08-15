"use client"

import { useState } from "react"
import { Loader2, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface ContactFormProps {
  locale: "fr" | "en"
}

export function ContactForm({ locale }: ContactFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed")
      setSuccess(true)
      setForm({ name: "", email: "", phone: "", subject: "", message: "" })
      toast.success(locale === "fr" ? "Message envoyé !" : "Message sent!")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de l'envoi.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="font-display text-xl font-bold text-emerald-700">
          {locale === "fr" ? "Message envoyé !" : "Message sent!"}
        </h3>
        <p className="text-muted-foreground mt-2">
          {locale === "fr"
            ? "Nous vous répondrons dans les plus brefs délais."
            : "We'll get back to you as soon as possible."}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setSuccess(false)}
        >
          {locale === "fr" ? "Envoyer un autre message" : "Send another message"}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            {locale === "fr" ? "Nom complet" : "Full name"} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={locale === "fr" ? "Votre nom" : "Your name"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="vous@exemple.com"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            {locale === "fr" ? "Téléphone" : "Phone"}
          </Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+216 …"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-sm font-medium">
            {locale === "fr" ? "Sujet" : "Subject"}
          </Label>
          <Input
            id="subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">
          {locale === "fr" ? "Message" : "Message"} <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={locale === "fr" ? "Votre message…" : "Your message…"}
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-pmo-violet-gradient text-white shadow-premium"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {locale === "fr" ? "Envoi…" : "Sending…"}
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            {locale === "fr" ? "Envoyer le message" : "Send message"}
          </>
        )}
      </Button>
    </form>
  )
}
