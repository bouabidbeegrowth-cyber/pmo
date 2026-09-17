import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail } from "@/lib/api"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return fail("Invalid JSON", 400)

  const existing = await db.programmeSession.findUnique({ where: { id } })
  if (!existing) return fail("Session not found", 404)

  if (typeof body.titleFr === "string" && !body.titleFr.trim()) {
    return fail("titleFr cannot be empty", 400)
  }
  const isHeader = typeof body.isHeader === "boolean" ? body.isHeader : existing.isHeader
  if (!isHeader && typeof body.startTime === "string" && !body.startTime.trim()) {
    return fail("startTime cannot be empty", 400)
  }

  const { speakerIds, moderatorId, ...rest } = body
  try {
    const data: Prisma.ProgrammeSessionUpdateInput = {
      startTime: body.startTime,
      endTime: body.endTime ?? null,
      titleFr: body.titleFr,
      titleEn: body.titleEn ?? null,
      titleAr: body.titleAr ?? null,
      descriptionFr: body.descriptionFr ?? null,
      descriptionEn: body.descriptionEn ?? null,
      sessionType: body.sessionType,
      language: body.language ?? null,
      room: body.room ?? null,
      topic: body.topic ?? null,
      isHeader,
      displayOrder: typeof body.displayOrder === "number" ? body.displayOrder : undefined,
      isActive: body.isActive,
      ...(moderatorId === null
        ? { moderator: { disconnect: true } }
        : moderatorId
          ? { moderator: { connect: { id: moderatorId } } }
          : {}),
    }
    const session = await db.programmeSession.update({ where: { id }, data })

    // Update speakers M2M: simplest = replace all
    if (Array.isArray(speakerIds)) {
      await db.sessionSpeaker.deleteMany({ where: { sessionId: id } })
      if (speakerIds.length > 0) {
        await db.sessionSpeaker.createMany({
          data: speakerIds.map((sid: string) => ({ sessionId: id, speakerId: sid })),
        })
      }
    }
    return ok(session)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Update failed", 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  try {
    await db.programmeSession.delete({ where: { id } })
    return ok({ success: true })
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Delete failed", 500)
  }
}
