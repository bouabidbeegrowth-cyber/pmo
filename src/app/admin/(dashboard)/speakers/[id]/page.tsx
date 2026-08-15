import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { SpeakerForm } from "@/components/admin/speaker-form"

export const dynamic = "force-dynamic"

export default async function EditSpeakerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const speaker = await db.speaker.findUnique({ where: { id } })
  if (!speaker) notFound()

  return <SpeakerForm initial={speaker} />
}
