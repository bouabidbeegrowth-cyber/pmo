export type VideoProvider = "youtube" | "vimeo"

export interface ParsedVideo {
  provider: VideoProvider
  id: string
  embedUrl: string
  /** Auto thumbnail from the provider, if one exists without an extra API call. */
  thumbnailUrl: string | null
}

/**
 * Recognizes YouTube/Vimeo URLs (watch, share, shorts, embed links) and
 * returns embed + thumbnail info. Returns null for anything else — gallery
 * videos are external links only, so an unrecognized URL is a validation
 * error, not a fallback case.
 */
export function parseVideoUrl(raw: string): ParsedVideo | null {
  let u: URL
  try {
    u = new URL(raw)
  } catch {
    return null
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null

  const host = u.hostname.replace(/^www\./, "").replace(/^m\./, "")

  if (host === "youtu.be") {
    const id = u.pathname.slice(1).split("/")[0]
    if (!id) return null
    return {
      provider: "youtube",
      id,
      embedUrl: `https://www.youtube.com/embed/${id}`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    }
  }

  if (host === "youtube.com") {
    let id = u.searchParams.get("v")
    if (!id && u.pathname.startsWith("/embed/")) id = u.pathname.slice("/embed/".length)
    if (!id && u.pathname.startsWith("/shorts/")) id = u.pathname.slice("/shorts/".length)
    id = id?.split("/")[0] ?? null
    if (!id) return null
    return {
      provider: "youtube",
      id,
      embedUrl: `https://www.youtube.com/embed/${id}`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    }
  }

  if (host === "vimeo.com") {
    const id = u.pathname.split("/").filter(Boolean)[0]
    if (!id || !/^\d+$/.test(id)) return null
    return {
      provider: "vimeo",
      id,
      embedUrl: `https://player.vimeo.com/video/${id}`,
      thumbnailUrl: null,
    }
  }

  return null
}
