import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail, safeUrl } from "@/lib/api"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const { searchParams } = new URL(req.url)
  let eventId = searchParams.get("eventId")
  if (!eventId) {
    const active = await db.event.findFirst({ where: { isActive: true } })
    eventId = active?.id
  }
  if (!eventId) return ok([])

  const passes = await db.pass.findMany({
    where: { eventId },
    orderBy: [{ displayOrder: "asc" }, { price: "asc" }],
  })
  return ok(passes)
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)

  let eventId = body.eventId
  if (!eventId) {
    const active = await db.event.findFirst({ where: { isActive: true } })
    if (!active) return fail("No active event. Create one first.", 400)
    eventId = active.id
  }

  if (!body.nameFr) return fail("nameFr is required", 400)
  if (typeof body.price !== "number" || body.price < 0) return fail("Invalid price", 400)

  // CRITICAL: validate payment URL if provided
  const paymentUrl = safeUrl(body.paymentUrl)
  if (body.paymentUrl && !paymentUrl) {
    return fail("Invalid payment URL. Must start with http:// or https://", 400)
  }

  const slug = body.slug || slugify(body.nameFr)

  try {
    let displayOrder = body.displayOrder
    if (typeof displayOrder !== "number" || displayOrder <= 0) {
      const max = await db.pass.aggregate({ where: { eventId }, _max: { displayOrder: true } })
      displayOrder = (max._max.displayOrder ?? -1) + 1
    }

    const data: Prisma.PassCreateInput = {
      event: { connect: { id: eventId } },
      slug,
      nameFr: body.nameFr,
      nameEn: body.nameEn ?? null,
      descriptionFr: body.descriptionFr ?? null,
      descriptionEn: body.descriptionEn ?? null,
      price: body.price,
      currency: body.currency ?? "TND",
      vatRate: typeof body.vatRate === "number" ? body.vatRate : 0.19,
      featuresFr: body.featuresFr ?? null,
      featuresEn: body.featuresEn ?? null,
      paymentUrl,
      minQuantity: body.minQuantity ?? 1,
      isFeatured: body.isFeatured ?? false,
      isActive: body.isActive ?? true,
      displayOrder,
    }
    const pass = await db.pass.create({ data })
    return ok(pass, 201)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Create failed", 500)
  }
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
