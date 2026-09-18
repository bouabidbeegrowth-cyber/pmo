"use client"

import { useEffect, useState } from "react"
import { Navigation } from "lucide-react"

interface Props {
  label: string
  /** Existing Google Maps link/pin for the venue, if one is set. */
  googleMapsUrl?: string | null
  /** GPS coordinates, if set — gives an exact pin instead of a text search. */
  latitude?: number | null
  longitude?: number | null
  /** Human address text (venue, street, city, country) as a query fallback. */
  addressQuery: string
  className?: string
}

function isIOS() {
  if (typeof navigator === "undefined") return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
}

function googleHref(googleMapsUrl: string | null | undefined, lat: number | null | undefined, lng: number | null | undefined, addressQuery: string) {
  if (googleMapsUrl) return googleMapsUrl
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`
}

function appleHref(lat: number | null | undefined, lng: number | null | undefined, addressQuery: string) {
  if (lat != null && lng != null) {
    return `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(addressQuery)}`
  }
  return `https://maps.apple.com/?q=${encodeURIComponent(addressQuery)}`
}

/**
 * Opens the venue in Apple Maps on iOS/iPadOS/macOS-touch devices, and
 * Google Maps everywhere else (Android, desktop). Uses exact GPS
 * coordinates when available for a precise pin, falling back to the saved
 * Google Maps link, then to an address text search. Defaults to the Google
 * link during server render / before hydration to avoid a layout jump.
 */
export function SmartMapButton({ label, googleMapsUrl, latitude, longitude, addressQuery, className }: Props) {
  const [href, setHref] = useState(googleHref(googleMapsUrl, latitude, longitude, addressQuery))

  useEffect(() => {
    if (isIOS()) {
      setHref(appleHref(latitude, longitude, addressQuery))
    }
  }, [latitude, longitude, addressQuery])

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      <Navigation className="w-4 h-4" />
      {label}
    </a>
  )
}
