import { NextRequest } from "next/server"
import { requireAdmin, ok, fail } from "@/lib/api"
import { saveUpload } from "@/lib/uploads"

export const dynamic = "force-dynamic"

// POST /api/upload — used by the admin image uploader across all content forms
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const form = await req.formData().catch(() => null)
  const file = form?.get("file")
  if (!file || !(file instanceof File)) {
    return fail("No file provided", 400)
  }

  try {
    const uploaded = await saveUpload(file)
    return ok(uploaded, 201)
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Upload failed", 400)
  }
}
