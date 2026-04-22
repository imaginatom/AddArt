import type { Metadata } from "next"
import Link from "next/link"
import { Mail, MapPin, ChevronRight } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Contact — Consultation Gratuite",
  description:
    "Contactez Noun Studio pour discuter de votre projet d'architecture ou de branding. Consultation gratuite, r\u00e9ponse sous 48h.",
}

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@nounstudio.dz",
    href: "mailto:contact@nounstudio.dz",
  },
  {
    icon: MapPin,
    label: "Localisation",
    value: "Alg\u00e9rie & France",
    href: undefined,
  },
]

const faqs = [
  {
    question: "Quels types de projets r\u00e9alisez-vous\u00a0?",
    answer:
      "Nous intervenons sur des projets d'architecture r\u00e9sidentielle et commerciale, de r\u00e9novation, de visualisation 3D, ainsi que sur la cr\u00e9ation d'identit\u00e9s visuelles compl\u00e8tes (logo, charte graphique, supports de communication). Chaque projet est trait\u00e9 sur mesure.",
  },
  {
    question: "Comment d\u00e9marre un projet\u00a0?",
    answer:
      "Tout commence par un \u00e9change par email ou via notre formulaire. Nous organisons ensuite une consultation gratuite pour comprendre vos besoins, votre terrain (pour l'architecture) ou votre activit\u00e9 (pour le branding), puis nous vous envoyons une proposition d\u00e9taill\u00e9e.",
  },
  {
    question: "Intervenez-vous en France\u00a0?",
    answer:
      "Oui, notre studio est bas\u00e9 en Alg\u00e9rie mais notre port\u00e9e professionnelle s'\u00e9tend \u00e0 la France, notamment pour les projets de branding et d'identit\u00e9 visuelle qui peuvent \u00eatre r\u00e9alis\u00e9s \u00e0 distance.",
  },
  {
    question: "Quels sont vos tarifs\u00a0?",
    answer:
      "Nos tarifs varient selon la nature et la complexit\u00e9 du projet. Nous proposons syst\u00e9matiquement un devis d\u00e9taill\u00e9 et transparent apr\u00e8s la consultation initiale. Il n'y a aucun engagement tant que vous n'avez pas valid\u00e9 la proposition.",
  },
  {
    question: "Combien de temps dure un projet\u00a0?",
    answer:
      "Une identit\u00e9 visuelle compl\u00e8te prend g\u00e9n\u00e9ralement 3 \u00e0 6 semaines. Un projet d'architecture r\u00e9sidentiel, de la conception \u00e0 la livraison des plans, peut prendre 2 \u00e0 4 mois. Le suivi de chantier d\u00e9pend de la dur\u00e9e de construction.",
  },
  {
    question: "Qui compose l'\u00e9quipe de Noun Studio\u00a0?",
    answer:
      "Le studio est dirig\u00e9 par SAHNOUNE Mohammed, architecte agr\u00e9\u00e9. Il est accompagn\u00e9 d'Adda Echikh en direction artistique et graphisme, et de Sid Ahmed Lakber pour le d\u00e9veloppement web et digital.",
  },
]

export default function ContactPage() {
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
            <p className="text-sm font-medium uppercase tracking-widest text-accent">Contact</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-foreground md:text-5xl text-balance">
              Parlons de votre projet
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {"Consultation gratuite. Nous \u00e9tudions chaque demande avec attention pour vous proposer la meilleure approche."}
            </p>
          </div>
        </div>
      </section>

      {/* Contact info bar */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
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
                Demande de consultation
              </h2>
              <p className="mt-2 text-muted-foreground">
                {"Remplissez le formulaire ci-dessous et nous vous recontactons sous 48h."}
              </p>
              <ContactForm />
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

              {/* Team card */}
              <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 ease-out hover:shadow-md hover:border-primary/20">
                <h3 className="font-serif text-lg font-bold text-foreground">{"L'\u00e9quipe"}</h3>
                <div className="mt-4 flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">SAHNOUNE Mohammed</p>
                    <p className="text-xs text-muted-foreground">{"Architecte agr\u00e9\u00e9 & Directeur Cr\u00e9atif"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Adda Echikh</p>
                    <p className="text-xs text-muted-foreground">{"Designer Graphique & Direction Artistique"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Sid Ahmed Lakber</p>
                    <p className="text-xs text-muted-foreground">{"D\u00e9veloppement Web & Digital"}</p>
                  </div>
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
            <p className="text-sm font-medium uppercase tracking-widest text-accent">FAQ</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              {"Questions fr\u00e9quentes"}
            </h2>
          </div>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((faq, i) => (
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
