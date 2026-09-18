import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"

export const dynamic = "force-dynamic"

const RESERVED_PATHS = new Set([
  "/",
  "/evenement",
  "/programme",
  "/contact",
  "/intervenants",
  "/organisateurs",
  "/partenaires",
  "/passes",
  "/pass-duo",
  "/pass-evenement",
  "/pass-formation",
])

function isReserved(path: string) {
  return RESERVED_PATHS.has(path) || path.startsWith("/admin") || path.startsWith("/api")
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)

  const existing = await db.redirect.findUnique({ where: { id } })
  if (!existing) return fail("Redirect not found", 404)

  const fromPath = typeof body.fromPath === "string" ? body.fromPath.trim() : ""
  if (!fromPath.startsWith("/")) return fail("fromPath must start with /", 400)
  if (isReserved(fromPath)) return fail("Ce chemin correspond à une page du site — impossible de le rediriger.", 400)

  const toPath = safeUrl(body.toPath)
  if (!toPath) return fail("toPath is required and must be a valid relative path or URL", 400)
  if (toPath === fromPath) return fail("La destination ne peut pas être identique à la source.", 400)

  try {
    const redirect = await db.redirect.update({
      where: { id },
      data: {
        fromPath,
        toPath,
        permanent: body.permanent ?? existing.permanent,
        isActive: body.isActive ?? existing.isActive,
      },
    })
    return ok(redirect)
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      return fail("Une redirection existe déjà pour ce chemin.", 400)
    }
    return fail(e instanceof Error ? e.message : "Update failed", 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  try {
    await db.redirect.delete({ where: { id } })
    return ok({ success: true })
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Delete failed", 500)
  }
}
