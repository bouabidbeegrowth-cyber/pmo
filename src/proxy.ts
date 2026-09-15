import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import { db } from "@/lib/db"

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` (same behavior, new file
 * name/export). This replaces the old `withAuth(...)` wrapper with an
 * equivalent manual check via `getToken` so the same function can also run
 * the admin-managed redirect lookup for public paths — Proxy only supports
 * exporting a single function per file.
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Admin route protection (all of /admin except /admin/login) ---
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next()

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // --- Admin-managed redirects (public paths only) ---
  // Fail-open: a DB hiccup here must never take down normal navigation.
  try {
    const redirect = await db.redirect.findFirst({
      where: { fromPath: pathname, isActive: true },
    })
    if (redirect) {
      db.redirect.update({ where: { id: redirect.id }, data: { hits: { increment: 1 } } }).catch(() => {})
      return NextResponse.redirect(new URL(redirect.toPath, request.url), redirect.permanent ? 308 : 307)
    }
  } catch {
    // ignore — fall through to normal rendering
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|api|sitemap.xml|robots.txt).*)",
  ],
}
