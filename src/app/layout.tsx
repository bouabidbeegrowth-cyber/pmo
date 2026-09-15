import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "PMO Mastery — Le PMO du Futur : Stratégie, IA et Performance",
    template: "%s | PMO Mastery",
  },
  description:
    "Événement international pour les leaders des PMO. Deux jours intensifs au cœur des meilleures pratiques en management de projets, PMO, conduite du changement, IA et leadership.",
  keywords: [
    "PMO",
    "Project Management",
    "PMO Mastery",
    "Tunisie",
    "Tunis",
    "Leadership",
    "IA",
    "Intelligence Artificielle",
    "Conference",
    "Empowerment Paths",
  ],
  authors: [{ name: "Empowerment Paths" }],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "PMO Mastery — International Event for PMO Leaders",
    description: "Le PMO du Futur : Stratégie, IA et Performance. Tunis, Tunisie.",
    url: "https://www.pmomastery.tn",
    siteName: "PMO Mastery",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PMO Mastery — International Event for PMO Leaders",
    description: "Le PMO du Futur : Stratégie, IA et Performance.",
  },
  alternates: {
    languages: {
      fr: "/",
      en: "/",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${poppins.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
