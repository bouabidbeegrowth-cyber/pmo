import { db } from "@/lib/db"
import { ok } from "@/lib/api"

export const dynamic = "force-dynamic"

// GET /api/public/site — composite endpoint for the public homepage
export async function GET() {
  const event = await db.event.findFirst({
    where: { isActive: true },
    include: {
      speakers: {
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      },
      programmeDays: {
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        include: {
          sessions: {
            where: { isActive: true },
            orderBy: { displayOrder: "asc" },
            include: {
              speakers: { include: { speaker: true } },
              moderator: true,
            },
          },
        },
      },
      passes: {
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { price: "asc" }],
      },
      organizers: {
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      },
      partners: {
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      },
      websiteSections: {
        include: {
          benefits: { orderBy: { displayOrder: "asc" } },
        },
      },
      contactInfo: true,
    },
  })

  return ok({ event })
}
