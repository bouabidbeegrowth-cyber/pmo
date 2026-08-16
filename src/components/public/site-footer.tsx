"use client"

import Link from "next/link"
import { Linkedin, Facebook, Instagram, Youtube, Mail, Phone, MapPin, Globe } from "lucide-react"
import type { Locale } from "@/lib/site-data"

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

interface FooterProps {
  locale: Locale
  contact: ContactInfo | null
  footerText?: string | null
  editionName?: string | null
}

export function SiteFooter({ locale, contact, footerText, editionName }: FooterProps) {
  const t = locale === "fr"
    ? {
        nav: "Navigation",
        event: "Événement",
        programme: "Programme",
        passes: "Pass",
        speakers: "Intervenants",
        organizers: "Organisateurs",
        partners: "Partenaires",
        contact: "Contact",
        followUs: "Suivez-nous",
        rights: "Tous droits réservés.",
      }
    : {
        nav: "Navigation",
        event: "Event",
        programme: "Programme",
        passes: "Pass",
        speakers: "Speakers",
        organizers: "Organizers",
        partners: "Partners",
        contact: "Contact",
        followUs: "Follow us",
        rights: "All rights reserved.",
      }

  return (
    <footer className="bg-pmo-navy-gradient text-white relative overflow-hidden mt-auto">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute -top-24 left-1/3 w-72 h-72 rounded-full bg-pmo-violet/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-pmo-violet-gradient flex items-center justify-center font-display font-bold text-white text-base shadow-premium">
                P
              </div>
              <span className="font-display font-semibold text-white text-lg tracking-tight">
                PMO Mastery
              </span>
            </Link>
            {editionName && (
              <p className="text-pmo-gold text-sm font-medium mb-3">{editionName}</p>
            )}
            <p className="text-white/60 text-sm leading-relaxed">
              {footerText ?? (locale === "fr"
                ? "Événement international pour les leaders des PMO."
                : "International event for PMO leaders.")}
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
                  {locale === "fr" ? "Accueil" : "Home"}
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
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Passes */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-widest text-white/50 mb-4">
              {t.passes}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/pass-evenement" className="text-white/70 hover:text-white transition-colors">
                  {locale === "fr" ? "Pass Événement" : "Event Pass"}
                </Link>
              </li>
              <li>
                <Link href="/pass-formation" className="text-white/70 hover:text-white transition-colors">
                  {locale === "fr" ? "Pass Formation" : "Training Pass"}
                </Link>
              </li>
              <li>
                <Link href="/pass-duo" className="text-white/70 hover:text-white transition-colors">
                  {locale === "fr" ? "Pass Duo" : "Duo Pass"}
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
            © {new Date().getFullYear()} PMO Mastery — Empowerment Paths. {t.rights}
          </p>
          <p className="text-white/40">
            {locale === "fr" ? "Conçu avec passion pour les leaders PMO" : "Crafted with passion for PMO leaders"}
          </p>
        </div>
      </div>
    </footer>
  )
}
