"use client"

import Link from "next/link"

interface ContactInfo {
  email?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  linkedinUrl?: string | null
  facebookUrl?: string | null
  instagramUrl?: string | null
  youtubeUrl?: string | null
  websiteUrl?: string | null
}

interface FooterLabels {
  nav: string
  home: string
  event: string
  programme: string
  passesHeading: string
  passesLink: string
  speakers: string
  organizers: string
  partners: string
  gallery: string
  contact: string
  followUs: string
  rights: string
  taglineDefault: string
  bottomTagline: string
  legalTitle: string
  ipLabel: string
  ipText: string
  dataLabel: string
  dataTextStart: string
  dataTextMid: string
  cookiesLabel: string
  cookiesText: string
  hostingLabel: string
  hostingTextStart: string
}

interface FooterProps {
  contact: ContactInfo | null
  footerText?: string | null
  copyrightText?: string | null
  editionName?: string | null
  logo?: string | null
  labels: FooterLabels
}

export function SiteFooter({ contact, footerText, copyrightText, editionName, labels: t }: FooterProps) {
  const socialLinks = [
    { url: contact?.facebookUrl, label: "Facebook" },
    { url: contact?.linkedinUrl, label: "LinkedIn" },
    { url: contact?.instagramUrl, label: "Instagram" },
    { url: contact?.youtubeUrl, label: "YouTube" },
    { url: contact?.websiteUrl, label: t.contact },
  ].filter((s) => s.url)

  return (
    <footer className="bg-pmo-navy-deep text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-center">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-dark-bg.png" alt="PMO Mastery" className="h-24 sm:h-28 w-auto object-contain" />
            </Link>
            {editionName && <p className="text-pmo-gold text-sm font-medium mb-2">{editionName}</p>}
            <p className="text-[15px] text-gray-300 leading-relaxed">{footerText ?? t.taglineDefault}</p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] mb-4">{t.nav}</h3>
            <div className="space-y-2.5">
              <Link href="/" className="block text-[15px] text-gray-300 hover:text-white transition-colors">{t.home}</Link>
              <Link href="/evenement" className="block text-[15px] text-gray-300 hover:text-white transition-colors">{t.event}</Link>
              <Link href="/programme" className="block text-[15px] text-gray-300 hover:text-white transition-colors">{t.programme}</Link>
              <Link href="/intervenants" className="block text-[15px] text-gray-300 hover:text-white transition-colors">{t.speakers}</Link>
              <Link href="/passes" className="block text-[15px] text-gray-300 hover:text-white transition-colors">{t.passesLink}</Link>
              <Link href="/partenaires" className="block text-[15px] text-gray-300 hover:text-white transition-colors">{t.partners}</Link>
              <Link href="/galerie" className="block text-[15px] text-gray-300 hover:text-white transition-colors">{t.gallery}</Link>
              <Link href="/contact" className="block text-[15px] text-gray-300 hover:text-white transition-colors">{t.contact}</Link>
            </div>
          </div>

          {/* Contact + Follow us */}
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] mb-4">{t.contact}</h3>
            <div className="space-y-2.5 mb-6">
              {contact?.email && (
                <a href={`mailto:${contact.email}`} className="block text-[15px] text-gray-300 hover:text-white transition-colors">
                  {contact.email}
                </a>
              )}
              {contact?.phone && (
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="block text-[15px] text-gray-300 hover:text-white transition-colors">
                  {contact.phone}
                </a>
              )}
              {(contact?.city || contact?.country) && (
                <p className="text-[15px] text-gray-300">{[contact?.city, contact?.country].filter(Boolean).join(", ")}</p>
              )}
            </div>

            {socialLinks.length > 0 && (
              <>
                <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] mb-4">{t.followUs}</h3>
                <div className="space-y-2.5">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[15px] text-gray-300 hover:text-white transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-white/80 mb-5">{t.legalTitle}</p>
          <div className="text-xs text-gray-400 leading-relaxed space-y-2.5">
            <p><strong className="text-white/60">{t.ipLabel}</strong> {t.ipText}</p>
            {contact?.email && (
              <p>
                <strong className="text-white/60">{t.dataLabel}</strong> {t.dataTextStart}{" "}
                <a href={`mailto:${contact.email}`} className="underline hover:text-white/80">{contact.email}</a>
                {contact?.phone && (
                  <>
                    {t.dataTextMid}
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="underline hover:text-white/80">{contact.phone}</a>
                  </>
                )}
                .
              </p>
            )}
            <p><strong className="text-white/60">{t.cookiesLabel}</strong> {t.cookiesText}</p>
            {contact?.email && (
              <p>
                <strong className="text-white/60">{t.hostingLabel}</strong> {t.hostingTextStart}{" "}
                <a href={`mailto:${contact.email}`} className="underline hover:text-white/80">{contact.email}</a>.
              </p>
            )}
            <p className="pt-2">
              {copyrightText || `© ${new Date().getFullYear()} PMO Mastery — Empowerment Paths. ${t.rights}`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
