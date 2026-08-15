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

/** Validate a URL string. Returns the normalized URL or null. */
export function safeUrl(value: string | null | undefined): string | null {
  if (!value) return null
  try {
    const u = new URL(value)
    if (!["http:", "https:"].includes(u.protocol)) return null
    return u.toString()
  } catch {
    return null
  }
}
