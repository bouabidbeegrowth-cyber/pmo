import { promises as fs } from "fs"
import path from "path"
import sharp from "sharp"
import { randomUUID } from "crypto"
import { db } from "@/lib/db"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
])

const MAX_BYTES = 8 * 1024 * 1024 // 8 MB

export interface UploadedFile {
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  width?: number
  height?: number
}

/**
 * Persist an uploaded image to /public/uploads, optimize it with sharp,
 * create a MediaAsset record, and return the public URL + metadata.
 *
 * Throws on invalid input.
 */
export async function saveUpload(file: File): Promise<UploadedFile> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`)
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`File too large (max ${MAX_BYTES / 1024 / 1024} MB)`)
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true })

  const ext = file.type.split("/")[1] || "bin"
  const basename = `${randomUUID()}.${ext}`
  const filepath = path.join(UPLOAD_DIR, basename)

  const buffer = Buffer.from(await file.arrayBuffer())

  // Optimize raster images: convert to webp (keep gif as-is for animations).
  let finalBuffer = buffer
  let finalMime = file.type
  let finalExt = ext
  let width: number | undefined
  let height: number | undefined

  if (file.type === "image/gif") {
    // Keep GIF as-is (sharp would lose animation).
    await fs.writeFile(filepath, buffer)
  } else {
    // Re-encode to webp for size + quality.
    const img = sharp(buffer, { failOn: "none" }).rotate()
    const meta = await img.metadata()
    width = meta.width
    height = meta.height
    // Downscale very large images.
    const resized = width && width > 1600 ? img.resize({ width: 1600, withoutEnlargement: true }) : img
    finalBuffer = await resized.webp({ quality: 82 }).toBuffer()
    finalMime = "image/webp"
    finalExt = "webp"
    finalBuffer = finalBuffer as Buffer
    const finalName = basename.replace(/\.[^.]+$/, ".webp")
    await fs.writeFile(path.join(UPLOAD_DIR, finalName), finalBuffer)
    // Remove the original-ext placeholder file if we renamed.
    if (finalName !== basename) {
      // We wrote to finalName directly, so the original `basename` path is unused.
    }
    return persistRecord({
      filename: finalName,
      originalName: file.name,
      mimeType: finalMime,
      size: (finalBuffer as Buffer).length,
      url: `/uploads/${finalName}`,
      width,
      height,
    })
  }

  return persistRecord({
    filename: basename,
    originalName: file.name,
    mimeType: finalMime,
    size: buffer.length,
    url: `/uploads/${basename}`,
    width,
    height,
  })
}

async function persistRecord(meta: Omit<UploadedFile, "url"> & { url: string }) {
  await db.mediaAsset.create({ data: meta })
  return meta
}

/**
 * Delete a previously-uploaded image: removes the file from /public/uploads
 * and its MediaAsset record. Safe no-op for null/external URLs (anything not
 * under /uploads/) so it can be called unconditionally on delete/replace.
 */
export async function deleteUploadedImage(url: string | null | undefined): Promise<void> {
  if (!url || !url.startsWith("/uploads/")) return

  const filename = url.replace(/^\/uploads\//, "")
  if (!filename || filename.includes("/") || filename.includes("..")) return

  const filepath = path.join(UPLOAD_DIR, filename)
  try {
    await fs.unlink(filepath)
  } catch {
    // already gone — ignore
  }
  await db.mediaAsset.deleteMany({ where: { filename } })
}
