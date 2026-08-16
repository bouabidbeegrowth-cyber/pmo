import { getLocale, getActiveEvent } from "@/lib/site-data"
import { SiteHeader } from "@/components/public/site-header"
import { SiteFooter } from "@/components/public/site-footer"

export const dynamic = "force-dynamic"

/**
 * Shared layout for ALL public-facing pages.
 * Provides the header (with multi-page nav) + footer + locale bootstrap.
 * Admin pages use their own layout under /admin.
 */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const event = await getActiveEvent()

  const logo = event?.heroLogo ?? null
  const registrationEnabled = event?.registrationEnabled ?? true
  const contact = event?.contactInfo ?? null
  const footerSection = event?.websiteSections.find((s) => s.sectionKey === "FOOTER")
  const footerText = locale === "en"
    ? footerSection?.descriptionEn ?? footerSection?.descriptionFr
    : footerSection?.descriptionFr

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader
        locale={locale}
        registrationEnabled={registrationEnabled}
        logo={logo}
      />
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter
        locale={locale}
        contact={contact}
        footerText={footerText}
        editionName={event?.editionName}
      />
    </div>
  )
}
