"use client"

import { useState } from "react"
import { Loader2, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface ContactFormProps {
  labels: {
    successToast: string
    successTitle: string
    successBody: string
    sendAnother: string
    nameLabel: string
    namePlaceholder: string
    emailPlaceholder: string
    phoneLabel: string
    phonePlaceholder: string
    subjectLabel: string
    messageLabel: string
    messagePlaceholder: string
    sending: string
    send: string
    errorFallback: string
  }
}

export function ContactForm({ labels: t }: ContactFormProps) {
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
      toast.success(t.successToast)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t.errorFallback)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="font-display text-xl font-bold text-emerald-700">
          {t.successTitle}
        </h3>
        <p className="text-muted-foreground mt-2">
          {t.successBody}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setSuccess(false)}
        >
          {t.sendAnother}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            {t.nameLabel} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t.namePlaceholder}
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
            placeholder={t.emailPlaceholder}
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            {t.phoneLabel}
          </Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder={t.phonePlaceholder}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-sm font-medium">
            {t.subjectLabel}
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
          {t.messageLabel} <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={t.messagePlaceholder}
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
            {t.sending}
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            {t.send}
          </>
        )}
      </Button>
    </form>
  )
}
