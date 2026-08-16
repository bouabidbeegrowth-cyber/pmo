import { db } from "@/lib/db"
import { cookies } from "next/headers"

export type Locale = "fr" | "en"

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const raw = cookieStore.get("pmo_locale")?.value
  if (raw === "fr" || raw === "en") return raw
  return "fr"
}

/**
 * Fetch the active event with ALL relations needed by public pages.
 * Single query — reused across every public page so data is consistent.
 */
export async function getActiveEvent() {
  return db.event.findFirst({
    where: { isActive: true },
    include: {
      speakers: {
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      },
      programmeDays: {
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        include: {
          sessions: {
            where: { isActive: true },
            orderBy: { displayOrder: "asc" },
            include: {
              speakers: { include: { speaker: true } },
              moderator: true,
            },
          },
        },
      },
      passes: {
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { price: "asc" }],
      },
      organizers: {
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      },
      partners: {
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      },
      websiteSections: {
        include: { benefits: { orderBy: { displayOrder: "asc" } } },
      },
      contactInfo: true,
    },
  })
}

export type EventWithRelations = Awaited<ReturnType<typeof getActiveEvent>>

/** Helper to pick the right localized string. */
export function pick<T>(fr: T | null | undefined, en: T | null | undefined, locale: Locale): T | null | undefined {
  return locale === "en" ? (en ?? fr) : fr
}
