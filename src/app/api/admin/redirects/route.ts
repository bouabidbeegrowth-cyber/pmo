import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"

export const dynamic = "force-dynamic"

// Real app routes a redirect must never shadow — doing so would make a live
// page unreachable.
const RESERVED_PATHS = new Set([
  "/",
  "/evenement",
  "/programme",
  "/contact",
  "/intervenants",
  "/organisateurs",
  "/partenaires",
  "/galerie",
  "/passes",
  "/pass-duo",
  "/pass-evenement",
  "/pass-formation",
])

function isReserved(path: string) {
  return RESERVED_PATHS.has(path) || path.startsWith("/admin") || path.startsWith("/api")
}

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  const redirects = await db.redirect.findMany({ orderBy: { createdAt: "desc" } })
  return ok(redirects)
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)

  const fromPath = typeof body.fromPath === "string" ? body.fromPath.trim() : ""
  if (!fromPath.startsWith("/")) return fail("fromPath must start with /", 400)
  if (isReserved(fromPath)) return fail("Ce chemin correspond à une page du site — impossible de le rediriger.", 400)

  const toPath = safeUrl(body.toPath)
  if (!toPath) return fail("toPath is required and must be a valid relative path or URL", 400)
  if (toPath === fromPath) return fail("La destination ne peut pas être identique à la source.", 400)

  try {
    const redirect = await db.redirect.create({
      data: {
        fromPath,
        toPath,
        permanent: body.permanent ?? true,
        isActive: body.isActive ?? true,
      },
    })
    return ok(redirect, 201)
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      return fail("Une redirection existe déjà pour ce chemin.", 400)
    }
    return fail(e instanceof Error ? e.message : "Create failed", 500)
  }
}
