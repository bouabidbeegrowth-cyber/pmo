import { NextRequest } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { db } from "@/lib/db"
import { requireAdmin, ok, fail } from "@/lib/api"

export const dynamic = "force-dynamic"

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error
  const { id } = await params
  const asset = await db.mediaAsset.findUnique({ where: { id } })
  if (!asset) return fail("Not found", 404)
  try {
    const filePath = path.join(process.cwd(), "public", asset.url.replace(/^\//, ""))
    try {
      await fs.unlink(filePath)
    } catch {
      // ignore missing file
    }
    await db.mediaAsset.delete({ where: { id } })
    return ok({ success: true })
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Delete failed", 500)
  }
}
