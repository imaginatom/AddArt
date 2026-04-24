import type { Metadata } from "next"
import Link from "next/link"
import { Mail, MapPin, Phone, ChevronRight } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { mergeContactContent } from "@/lib/content/contact"
import { mergeSiteSettingsContent } from "@/lib/content/settings"

export const metadata: Metadata = {
  title: "Contact — Devis gratuit",
  description:
    "Contactez AddArt pour parler de votre projet d'illustration, cartoon art, jaquette de jeu ou motion design. Devis gratuit, r\u00e9ponse sous 48\u00a0h.",
}

export default async function ContactPage() {
  const supabase = await createSupabaseServerClient()
  const [{ data: contactRows, error: contactErr }, { data: settingsRows, error: settingsErr }] = await Promise.all([
    supabase.from("site_content").select("section, content").eq("page", "contact"),
    supabase.from("site_content").select("section, content").eq("page", "settings"),
  ])
  const content = mergeContactContent(contactErr ? [] : contactRows ?? [])
  const settings = mergeSiteSettingsContent(settingsErr ? [] : settingsRows ?? [])
  const contactInfo = [
    {
      icon: Mail,
      label: settings.contact.emailLabel,
      value: settings.contact.email,
      href: `mailto:${settings.contact.email}`,
    },
    {
      icon: MapPin,
      label: settings.contact.locationLabel,
      value: settings.contact.location,
      href: undefined,
    },
    {
      icon: Phone,
      label: settings.contact.phoneLabel,
      value: settings.contact.phone,
      href: `tel:${settings.contact.phone.replace(/\s+/g, "")}`,
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-card pt-32 pb-14 lg:pt-40 lg:pb-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <nav aria-label="Fil d'Ariane" className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">Accueil</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Contact</span>
          </nav>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              {content.hero.eyebrow}
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-foreground md:text-5xl text-balance">
              {content.hero.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{content.hero.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Contact info bar */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {contactInfo.map((info) => {
            const Inner = (
              <div className="flex items-center gap-4 px-6 py-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <info.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{info.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">{info.value}</p>
                </div>
              </div>
            )
            return info.href ? (
              <a key={info.label} href={info.href} className="transition-colors hover:bg-primary/5">{Inner}</a>
            ) : (
              <div key={info.label}>{Inner}</div>
            )
          })}
        </div>
      </section>

      {/* Form */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            <div className="lg:w-1/2">
              <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                {content.form.title}
              </h2>
              <p className="mt-2 text-muted-foreground">{content.form.subtitle}</p>
              <ContactForm settings={settings} />
            </div>

            <div className="flex flex-col gap-8 lg:w-1/2">
              <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 ease-out hover:shadow-md hover:border-primary/20">
                <h3 className="font-serif text-lg font-bold text-foreground">{"Informations pratiques"}</h3>
                <div className="mt-4 flex flex-col gap-4">
                  {contactInfo.map((info) => (
                    <div key={info.label} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <info.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{info.label}</p>
                        {info.href ? (
                          <a href={info.href} className="mt-0.5 text-sm font-medium text-foreground underline-offset-2 hover:underline">{info.value}</a>
                        ) : (
                          <p className="mt-0.5 text-sm font-medium text-foreground">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Artist card */}
              <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 ease-out hover:shadow-md hover:border-primary/20">
                <h3 className="font-serif text-lg font-bold text-foreground">
                  {content.artist.title}
                </h3>
                <div className="mt-4 flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {content.artist.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{content.artist.role}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{content.artist.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              {content.faq.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              {content.faq.title}
            </h2>
          </div>
          <Accordion type="single" collapsible className="mt-10">
            {content.faq.items.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-serif text-base font-semibold text-foreground">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  )
}
