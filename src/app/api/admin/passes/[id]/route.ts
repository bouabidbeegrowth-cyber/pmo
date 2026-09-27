import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"
import { deleteUploadedImage } from "@/lib/uploads"
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

  const ALLOWED_CATEGORIES = ["EVENEMENT", "FORMATION", "DUO", "ETUDIANT", "AUTRE"]

  try {
    const data: Prisma.PassUpdateInput = {
      slug: body.slug ?? existing.slug,
      category: ALLOWED_CATEGORIES.includes(body.category) ? body.category : existing.category,
      nameFr: body.nameFr ?? existing.nameFr,
      nameEn: body.nameEn !== undefined ? body.nameEn : existing.nameEn,
      image: body.image !== undefined ? safeUrl(body.image) : existing.image,
      descriptionFr: body.descriptionFr !== undefined ? body.descriptionFr : existing.descriptionFr,
      descriptionEn: body.descriptionEn !== undefined ? body.descriptionEn : existing.descriptionEn,
      price: typeof body.price === "number" ? body.price : undefined,
      currency: body.currency ?? existing.currency,
      vatRate: typeof body.vatRate === "number" ? body.vatRate : undefined,
      featuresFr: body.featuresFr !== undefined ? body.featuresFr : existing.featuresFr,
      featuresEn: body.featuresEn !== undefined ? body.featuresEn : existing.featuresEn,
      paymentUrl: body.paymentUrl !== undefined ? (body.paymentUrl === "" ? null : paymentUrl) : existing.paymentUrl,
      minQuantity: typeof body.minQuantity === "number" ? body.minQuantity : undefined,
      isFeatured: body.isFeatured !== undefined ? body.isFeatured : existing.isFeatured,
      isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
      displayOrder: typeof body.displayOrder === "number" ? body.displayOrder : undefined,
    }
    const pass = await db.pass.update({ where: { id }, data })

    if (existing.image && existing.image !== data.image) {
      await deleteUploadedImage(existing.image)
    }

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
    const pass = await db.pass.delete({ where: { id } })
    await deleteUploadedImage(pass.image)
    return ok({ success: true })
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Delete failed", 500)
  }
}
