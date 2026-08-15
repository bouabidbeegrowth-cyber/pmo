import { Mail, Phone, MapPin, Clock, Globe, Linkedin, Facebook, Instagram, Youtube } from "lucide-react"
import { getLocale, getActiveEvent } from "@/lib/site-data"
import { PageHero } from "@/components/public/page-hero"
import { ContactForm } from "@/components/public/contact-form"

export const dynamic = "force-dynamic"

export default async function ContactPage() {
  const locale = await getLocale()
  const event = await getActiveEvent()

  const t = locale === "fr"
    ? {
        eyebrow: "Échangeons",
        title: "Contact",
        subtitle: "Une question, une demande de partenariat ou besoin d'informations ? Notre équipe vous répond rapidement.",
        formTitle: "Envoyez-nous un message",
        infoTitle: "Informations de contact",
        email: "Email",
        phone: "Téléphone",
        address: "Adresse",
        hours: "Horaires",
        followUs: "Suivez-nous",
        hoursValue: "Lun – Ven · 9h00 – 18h00",
      }
    : {
        eyebrow: "Let's talk",
        title: "Contact",
        subtitle: "A question, a partnership request or need information? Our team responds quickly.",
        formTitle: "Send us a message",
        infoTitle: "Contact information",
        email: "Email",
        phone: "Phone",
        address: "Address",
        hours: "Hours",
        followUs: "Follow us",
        hoursValue: "Mon – Fri · 9:00 AM – 6:00 PM",
      }

  const contact = event?.contactInfo ?? null

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
        breadcrumbs={[{ href: "/", label: locale === "fr" ? "Accueil" : "Home" }, { label: t.title }]}
      />

      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-12 items-start">
            {/* Form */}
            <div>
              <h2 className="font-display text-2xl font-bold mb-6">{t.formTitle}</h2>
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-premium">
                <ContactForm locale={locale} />
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <h2 className="font-display text-2xl font-bold">{t.infoTitle}</h2>

              <div className="space-y-3">
                {contact?.email && (
                  <a href={`mailto:${contact.email}`} className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-premium transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-pmo-violet/10 flex items-center justify-center shrink-0 group-hover:bg-pmo-violet-gradient transition-all">
                      <Mail className="w-5 h-5 text-pmo-violet group-hover:text-white transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">{t.email}</div>
                      <div className="font-medium text-sm break-all">{contact.email}</div>
                    </div>
                  </a>
                )}

                {contact?.phone && (
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-premium transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-pmo-violet/10 flex items-center justify-center shrink-0 group-hover:bg-pmo-violet-gradient transition-all">
                      <Phone className="w-5 h-5 text-pmo-violet group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">{t.phone}</div>
                      <div className="font-medium text-sm">{contact.phone}</div>
                    </div>
                  </a>
                )}

                {(contact?.address || contact?.city) && (
                  <div className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-card">
                    <div className="w-10 h-10 rounded-xl bg-pmo-violet/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-pmo-violet" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">{t.address}</div>
                      <div className="font-medium text-sm">
                        {contact.address}
                        {(contact.city || contact.country) && (
                          <><br />{[contact.city, contact.country].filter(Boolean).join(", ")}</>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-card">
                  <div className="w-10 h-10 rounded-xl bg-pmo-violet/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-pmo-violet" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">{t.hours}</div>
                    <div className="font-medium text-sm">{t.hoursValue}</div>
                  </div>
                </div>
              </div>

              {/* Map */}
              {contact?.mapUrl && (
                <div className="rounded-2xl overflow-hidden border border-border shadow-premium">
                  <iframe
                    src={contact.mapUrl.replace("/maps?", "/maps/embed?")}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Map"
                  />
                </div>
              )}

              {/* Social */}
              {(contact?.linkedinUrl || contact?.facebookUrl || contact?.instagramUrl || contact?.youtubeUrl || contact?.websiteUrl) && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{t.followUs}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {contact?.linkedinUrl && (
                      <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer"
                         className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-pmo-violet hover:text-white hover:border-pmo-violet transition-all">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {contact?.facebookUrl && (
                      <a href={contact.facebookUrl} target="_blank" rel="noopener noreferrer"
                         className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-pmo-violet hover:text-white hover:border-pmo-violet transition-all">
                        <Facebook className="w-4 h-4" />
                      </a>
                    )}
                    {contact?.instagramUrl && (
                      <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer"
                         className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-pmo-violet hover:text-white hover:border-pmo-violet transition-all">
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {contact?.youtubeUrl && (
                      <a href={contact.youtubeUrl} target="_blank" rel="noopener noreferrer"
                         className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-pmo-violet hover:text-white hover:border-pmo-violet transition-all">
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}
                    {contact?.websiteUrl && (
                      <a href={contact.websiteUrl} target="_blank" rel="noopener noreferrer"
                         className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-pmo-violet hover:text-white hover:border-pmo-violet transition-all">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
