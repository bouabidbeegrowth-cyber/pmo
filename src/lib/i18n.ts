/**
 * Tiny FR/EN i18n helpers.
 * The active locale is stored in a cookie ("pmo_locale") so it works on both
 * the public site and admin (admin is FR-only for simplicity).
 */

export const LOCALES = ["fr", "en"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "fr"

import { cookies } from "next/headers"

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const raw = cookieStore.get("pmo_locale")?.value
  if (raw === "fr" || raw === "en") return raw
  return DEFAULT_LOCALE
}

export function pickLocalized<T extends Record<string, unknown>>(
  obj: T,
  locale: Locale,
  frKey: keyof T,
  enKey: keyof T,
): unknown {
  if (locale === "en") {
    const v = obj[enKey]
    if (v !== null && v !== undefined && v !== "") return v
  }
  return obj[frKey]
}
