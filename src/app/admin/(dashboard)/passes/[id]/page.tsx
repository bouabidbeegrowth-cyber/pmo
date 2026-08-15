import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { PassForm } from "@/components/admin/pass-form"

export const dynamic = "force-dynamic"

export default async function EditPassPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const pass = await db.pass.findUnique({ where: { id } })
  if (!pass) notFound()
  return <PassForm initial={pass} />
}
