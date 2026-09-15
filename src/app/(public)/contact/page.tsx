import type { Metadata } from "next"
import { Mail, Phone, MapPin, Clock, Globe, Linkedin, Facebook, Instagram, Youtube } from "lucide-react"
import { getLocale, getActiveEvent, getUiText } from "@/lib/site-data"
import { buildPageMetadata } from "@/lib/seo"
import { PageHero } from "@/components/public/page-hero"
import { ContactForm } from "@/components/public/contact-form"
import { BreadcrumbStructuredData } from "@/components/public/structured-data"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    page: "contact",
    path: "/contact",
    locale,
    defaults: {
      titleFr: "Contact",
      titleEn: "Contact",
      descriptionFr:
        "Une question, une demande de partenariat ou besoin d'informations ? Contactez l'équipe PMO Mastery.",
      descriptionEn: "A question, a partnership request or need information? Get in touch with the PMO Mastery team.",
    },
  })
}

export default async function ContactPage() {
  const locale = await getLocale()
  const event = await getActiveEvent()
  const ui = await getUiText(locale)

  const t = {
    eyebrow: ui("contact.hero.eyebrow", "Échangeons"),
    title: ui("contact.hero.title", "Contact"),
    subtitle: ui("contact.hero.subtitle", "Une question, une demande de partenariat ou besoin d'informations ? Notre équipe vous répond rapidement."),
    formTitle: ui("contact.formTitle", "Envoyez-nous un message"),
    infoTitle: ui("contact.infoTitle", "Informations de contact"),
    email: ui("contact.email", "Email"),
    phone: ui("contact.phone", "Téléphone"),
    address: ui("contact.address", "Adresse"),
    hours: ui("contact.hours", "Horaires"),
    followUs: ui("contact.followUs", "Suivez-nous"),
    hoursValue: ui("contact.hoursValue", "Lun – Ven · 9h00 – 18h00"),
  }

  const formLabels = {
    successToast: ui("contact.form.successTitle", "Message envoyé !"),
    successTitle: ui("contact.form.successTitle", "Message envoyé !"),
    successBody: ui("contact.form.successBody", "Nous vous répondrons dans les plus brefs délais."),
    sendAnother: ui("contact.form.sendAnother", "Envoyer un autre message"),
    nameLabel: ui("contact.form.nameLabel", "Nom complet"),
    namePlaceholder: ui("contact.form.namePlaceholder", "Votre nom"),
    emailPlaceholder: ui("contact.form.emailPlaceholder", "vous@exemple.com"),
    phoneLabel: ui("contact.form.phoneLabel", "Téléphone"),
    phonePlaceholder: ui("contact.form.phonePlaceholder", "+216 …"),
    subjectLabel: ui("contact.form.subjectLabel", "Sujet"),
    messageLabel: ui("contact.form.messageLabel", "Message"),
    messagePlaceholder: ui("contact.form.messagePlaceholder", "Votre message…"),
    sending: ui("contact.form.sending", "Envoi…"),
    send: ui("contact.form.send", "Envoyer le message"),
    errorFallback: ui("contact.form.errorFallback", "Échec de l'envoi."),
  }

  const contact = event?.contactInfo ?? null
  const breadcrumbs = [{ href: "/", label: ui("common.breadcrumb.home", "Accueil") }, { label: t.title }]

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbs} />
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-12 items-start">
            {/* Form */}
            <div>
              <h2 className="font-display text-2xl font-bold mb-6">{t.formTitle}</h2>
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-premium">
                <ContactForm labels={formLabels} />
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
