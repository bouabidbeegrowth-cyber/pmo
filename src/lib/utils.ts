import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Convert a string to a URL-safe slug (ASCII only). */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** Convert a TND amount + VAT rate to a formatted price string. */
export function formatPrice(amount: number, currency = "TND", locale = "fr"): string {
  try {
    return new Intl.NumberFormat(locale === "fr" ? "fr-TN" : "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${amount} ${currency}`
  }
}

/** Parse a newline-separated features string into an array. */
export function parseFeatures(s: string | null | undefined): string[] {
  if (!s) return []
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
}
