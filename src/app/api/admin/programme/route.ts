import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail } from "@/lib/api"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

// GET — list all programme days (with sessions) for the active event
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const { searchParams } = new URL(req.url)
  let eventId = searchParams.get("eventId")
  if (!eventId) {
    const active = await db.event.findFirst({ where: { isActive: true } })
    eventId = active?.id
  }
  if (!eventId) return ok({ days: [], speakers: [] })

  const [days, speakers] = await Promise.all([
    db.programmeDay.findMany({
      where: { eventId },
      orderBy: { displayOrder: "asc" },
      include: {
        sessions: {
          orderBy: { displayOrder: "asc" },
          include: {
            speakers: { include: { speaker: true } },
            moderator: true,
          },
        },
      },
    }),
    db.speaker.findMany({
      where: { eventId, isActive: true },
      orderBy: { displayOrder: "asc" },
      select: { id: true, firstName: true, lastName: true, photo: true, positionFr: true },
    }),
  ])

  return ok({ days, speakers })
}

// POST — create a new day OR a new session (based on `kind` in body)
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

  if (body.kind === "day") {
    if (!body.nameFr) return fail("nameFr is required", 400)
    if (!body.date) return fail("date is required", 400)
    try {
      const day = await db.programmeDay.create({
        data: {
          event: { connect: { id: eventId } },
          nameFr: body.nameFr,
          nameEn: body.nameEn ?? null,
          date: new Date(body.date),
          isActive: body.isActive ?? true,
          displayOrder: body.displayOrder ?? 0,
        },
      })
      return ok(day, 201)
    } catch (e) {
      return fail(e instanceof Error ? e.message : "Create failed", 500)
    }
  }

  if (body.kind === "session") {
    if (!body.programmeDayId) return fail("programmeDayId is required", 400)
    if (!body.titleFr) return fail("titleFr is required", 400)
    if (!body.startTime) return fail("startTime is required", 400)
    try {
      const { speakerIds = [], moderatorId = null, ...rest } = body
      const sessionData: Prisma.ProgrammeSessionCreateInput = {
        programmeDay: { connect: { id: body.programmeDayId } },
        startTime: body.startTime,
        endTime: body.endTime ?? null,
        titleFr: body.titleFr,
        titleEn: body.titleEn ?? null,
        titleAr: body.titleAr ?? null,
        descriptionFr: body.descriptionFr ?? null,
        descriptionEn: body.descriptionEn ?? null,
        sessionType: body.sessionType ?? "SESSION",
        language: body.language ?? null,
        room: body.room ?? null,
        topic: body.topic ?? null,
        displayOrder: body.displayOrder ?? 0,
        isActive: body.isActive ?? true,
        ...(moderatorId ? { moderator: { connect: { id: moderatorId } } } : {}),
      }
      const session = await db.programmeSession.create({
        data: sessionData,
      })
      if (Array.isArray(speakerIds) && speakerIds.length > 0) {
        await db.sessionSpeaker.createMany({
          data: speakerIds.map((sid: string) => ({
            sessionId: session.id,
            speakerId: sid,
          })),
        })
      }
      return ok(session, 201)
    } catch (e) {
      return fail(e instanceof Error ? e.message : "Create failed", 500)
    }
  }

  return fail("Unknown kind. Use 'day' or 'session'.", 400)
}
