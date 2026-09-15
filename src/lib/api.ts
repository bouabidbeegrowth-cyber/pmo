import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/** Standard JSON success response. */
export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

/** Standard JSON error response. */
export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status })
}

/** Require an authenticated admin session. */
export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return { session: null, error: fail("Unauthorized", 401) }
  }
  return { session, error: null }
}

/** Require an authenticated session with the SUPER_ADMIN role. */
export async function requireSuperAdmin() {
  const { session, error } = await requireAdmin()
  if (error) return { session: null, error }
  if (session.user.role !== "SUPER_ADMIN") {
    return { session: null, error: fail("Forbidden — super admin only", 403) }
  }
  return { session, error: null }
}

/**
 * Validate a URL string. Returns the normalized URL, a same-origin relative
 * path (e.g. "/uploads/…"), or null if the value is missing/unsafe.
 * Rejects everything else outright — callers must not fall back to the raw
 * input on null, or the validation is pointless.
 */
export function safeUrl(value: string | null | undefined): string | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  // Same-origin relative path (uploaded media). Reject "//host/…" — that's
  // protocol-relative and resolves off-site despite looking relative.
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed
  try {
    const u = new URL(trimmed)
    if (!["http:", "https:"].includes(u.protocol)) return null
    return u.toString()
  } catch {
    return null
  }
}
