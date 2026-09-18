"use client"

import Link from "next/link"
import { Linkedin, Facebook, Instagram, Youtube, Mail, Phone, MapPin, Globe } from "lucide-react"

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
}

interface FooterProps {
  contact: ContactInfo | null
  footerText?: string | null
  copyrightText?: string | null
  editionName?: string | null
  logo?: string | null
  labels: FooterLabels
}

export function SiteFooter({ contact, footerText, copyrightText, editionName, logo, labels: t }: FooterProps) {

  return (
    <footer className="bg-pmo-navy-gradient text-white relative overflow-hidden mt-auto">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute -top-24 left-1/3 w-72 h-72 rounded-full bg-pmo-violet/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="PMO Mastery" className="h-9 w-auto" />
              ) : (
                <>
                  <div className="w-9 h-9 rounded-xl bg-pmo-violet-gradient flex items-center justify-center font-display font-bold text-white text-base shadow-premium">
                    P
                  </div>
                  <span className="font-display font-semibold text-white text-lg tracking-tight">
                    PMO Mastery
                  </span>
                </>
              )}
            </Link>
            {editionName && (
              <p className="text-pmo-gold text-sm font-medium mb-3">{editionName}</p>
            )}
            <p className="text-white/60 text-sm leading-relaxed">
              {footerText ?? t.taglineDefault}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-widest text-white/50 mb-4">
              {t.nav}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-white/70 hover:text-white transition-colors">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link href="/evenement" className="text-white/70 hover:text-white transition-colors">
                  {t.event}
                </Link>
              </li>
              <li>
                <Link href="/programme" className="text-white/70 hover:text-white transition-colors">
                  {t.programme}
                </Link>
              </li>
              <li>
                <Link href="/intervenants" className="text-white/70 hover:text-white transition-colors">
                  {t.speakers}
                </Link>
              </li>
              <li>
                <Link href="/partenaires" className="text-white/70 hover:text-white transition-colors">
                  {t.partners}
                </Link>
              </li>
              <li>
                <Link href="/galerie" className="text-white/70 hover:text-white transition-colors">
                  {t.gallery}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Passes */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-widest text-white/50 mb-4">
              {t.passesHeading}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/passes" className="text-white/70 hover:text-white transition-colors">
                  {t.passesLink}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-widest text-white/50 mb-4">
              {t.contact}
            </h4>
            <ul className="space-y-3 text-sm">
              {contact?.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <Mail className="w-4 h-4 text-pmo-gold shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </a>
                </li>
              )}
              {contact?.phone && (
                <li>
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <Phone className="w-4 h-4 text-pmo-gold shrink-0" />
                    <span>{contact.phone}</span>
                  </a>
                </li>
              )}
              {contact?.address && (
                <li className="flex items-start gap-2 text-white/70">
                  <MapPin className="w-4 h-4 text-pmo-gold shrink-0 mt-0.5" />
                  <span>
                    {contact.address}
                    {(contact.city || contact.country) && (
                      <><br />{[contact.city, contact.country].filter(Boolean).join(", ")}</>
                    )}
                  </span>
                </li>
              )}
            </ul>

            {/* Social */}
            {(contact?.linkedinUrl || contact?.facebookUrl || contact?.instagramUrl || contact?.youtubeUrl) && (
              <div className="mt-5">
                <p className="text-xs uppercase tracking-widest text-white/40 mb-2">{t.followUs}</p>
                <div className="flex items-center gap-2">
                  {contact?.linkedinUrl && (
                    <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer"
                       className="w-9 h-9 rounded-full bg-white/10 hover:bg-pmo-violet flex items-center justify-center text-white transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {contact?.facebookUrl && (
                    <a href={contact.facebookUrl} target="_blank" rel="noopener noreferrer"
                       className="w-9 h-9 rounded-full bg-white/10 hover:bg-pmo-violet flex items-center justify-center text-white transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {contact?.instagramUrl && (
                    <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer"
                       className="w-9 h-9 rounded-full bg-white/10 hover:bg-pmo-violet flex items-center justify-center text-white transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {contact?.youtubeUrl && (
                    <a href={contact.youtubeUrl} target="_blank" rel="noopener noreferrer"
                       className="w-9 h-9 rounded-full bg-white/10 hover:bg-pmo-violet flex items-center justify-center text-white transition-colors">
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                  {contact?.websiteUrl && (
                    <a href={contact.websiteUrl} target="_blank" rel="noopener noreferrer"
                       className="w-9 h-9 rounded-full bg-white/10 hover:bg-pmo-violet flex items-center justify-center text-white transition-colors">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>
            {copyrightText || `© ${new Date().getFullYear()} PMO Mastery — Empowerment Paths. ${t.rights}`}
          </p>
          <p className="text-white/40">
            {t.bottomTagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
