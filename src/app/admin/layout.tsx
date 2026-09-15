import type { Metadata } from "next"

// robots.txt already disallows /admin, but that only stops crawling — it
// doesn't stop a page from being indexed if it's ever linked externally.
// This is the belt-and-suspenders fix: an explicit noindex on every /admin
// route (login included), regardless of auth state.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children
}
