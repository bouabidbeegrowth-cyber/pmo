import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  const pass = await db.pass.findUnique({ where: { id } })
  if (!pass) return fail("Pass not found", 404)
  return ok(pass)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)

  const existing = await db.pass.findUnique({ where: { id } })
  if (!existing) return fail("Pass not found", 404)

  if (typeof body.nameFr === "string" && !body.nameFr.trim()) {
    return fail("nameFr cannot be empty", 400)
  }
  if (body.price !== undefined && (typeof body.price !== "number" || body.price < 0)) {
    return fail("Invalid price", 400)
  }

  // Validate payment URL if provided
  const paymentUrl = safeUrl(body.paymentUrl)
  if (body.paymentUrl && !paymentUrl) {
    return fail("Invalid payment URL. Must start with http:// or https://", 400)
  }

  try {
    const data: Prisma.PassUpdateInput = {
      slug: body.slug,
      nameFr: body.nameFr,
      nameEn: body.nameEn ?? null,
      descriptionFr: body.descriptionFr ?? null,
      descriptionEn: body.descriptionEn ?? null,
      price: typeof body.price === "number" ? body.price : undefined,
      currency: body.currency,
      vatRate: typeof body.vatRate === "number" ? body.vatRate : undefined,
      featuresFr: body.featuresFr ?? null,
      featuresEn: body.featuresEn ?? null,
      paymentUrl: paymentUrl === null && body.paymentUrl === "" ? null : paymentUrl,
      minQuantity: typeof body.minQuantity === "number" ? body.minQuantity : undefined,
      isFeatured: body.isFeatured,
      isActive: body.isActive,
      displayOrder: typeof body.displayOrder === "number" ? body.displayOrder : undefined,
    }
    const pass = await db.pass.update({ where: { id }, data })
    return ok(pass)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Update failed", 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  try {
    await db.pass.delete({ where: { id } })
    return ok({ success: true })
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Delete failed", 500)
  }
}
