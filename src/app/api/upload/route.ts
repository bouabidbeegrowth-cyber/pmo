import { NextRequest } from "next/server"
import { requireAdmin, ok, fail } from "@/lib/api"
import { saveUpload } from "@/lib/uploads"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const formData = await req.formData()
  const file = formData.get("file")
  if (!(file instanceof File)) {
    return fail("No file uploaded", 400)
  }
  try {
    const saved = await saveUpload(file)
    return ok(saved)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Upload failed", 400)
  }
}
