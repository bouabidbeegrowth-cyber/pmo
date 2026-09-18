// Pure string helpers for the upload thumbnail naming convention — no server
// dependencies (fs/sharp/db), so this is safe to import from client components.

export function thumbFilename(filename: string) {
  return filename.replace(/\.([^.]+)$/, "-thumb.$1")
}

/** Small (400px-wide) card/grid variant of an uploaded image, if one exists. */
export function thumbUrl(url: string | null | undefined): string | null {
  if (!url || !url.startsWith("/uploads/")) return null
  const filename = url.replace(/^\/uploads\//, "")
  if (!filename.endsWith(".webp")) return null // only generated for re-encoded images
  return `/uploads/${thumbFilename(filename)}`
}
