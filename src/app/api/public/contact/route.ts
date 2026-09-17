import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, fail } from "@/lib/api"
import { sendMail } from "@/lib/mailer"
import { z } from "zod"

export const dynamic = "force-dynamic"

const ContactSchema = z.object({
  name: z.string().min(2, "Name too short").max(100),
  email: z.string().email("Invalid email"),
  phone: z.string().max(30).optional().or(z.literal("")),
  subject: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(5, "Message too short").max(5000),
})

// POST /api/public/contact — public contact form submission
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)

  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid input", 400)
  }

  const msg = await db.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    },
  })

  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL
  if (notifyTo) {
    sendMail({
      to: notifyTo,
      replyTo: parsed.data.email,
      subject: `[Contact] ${parsed.data.subject || "Nouveau message"} — ${parsed.data.name}`,
      html: `
        <p><strong>Nom:</strong> ${parsed.data.name}</p>
        <p><strong>Email:</strong> ${parsed.data.email}</p>
        ${parsed.data.phone ? `<p><strong>Téléphone:</strong> ${parsed.data.phone}</p>` : ""}
        ${parsed.data.subject ? `<p><strong>Sujet:</strong> ${parsed.data.subject}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${parsed.data.message.replace(/\n/g, "<br>")}</p>
      `,
    }).catch((e) => console.error("Failed to send contact notification email", e))
  }

  return ok({ success: true, id: msg.id }, 201)
}
