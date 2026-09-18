/**
 * Resolves a Google Maps URL (including shortened share links like
 * maps.app.goo.gl/... or share.google/...) and extracts the lat/lng it
 * points to, by following redirects and pattern-matching the final URL.
 * Returns null if the URL doesn't resolve or contains no coordinates.
 */
export async function extractCoordsFromMapsUrl(url: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(5000) })
    const finalUrl = res.url || url

    // Prefer the precise marker coords ("!3d<lat>!4d<lng>") over the map
    // center ("@<lat>,<lng>,<zoom>z"), which can drift from the actual pin.
    const pinMatch = finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/)
    if (pinMatch) {
      return { lat: parseFloat(pinMatch[1]), lng: parseFloat(pinMatch[2]) }
    }

    const centerMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (centerMatch) {
      return { lat: parseFloat(centerMatch[1]), lng: parseFloat(centerMatch[2]) }
    }

    const queryMatch = finalUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (queryMatch) {
      return { lat: parseFloat(queryMatch[1]), lng: parseFloat(queryMatch[2]) }
    }

    return null
  } catch {
    return null
  }
}
