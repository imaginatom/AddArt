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
  title: "Contact — Devis gratuit",
  description:
    "Contactez AddArt pour parler de votre projet d'illustration, cartoon art, jaquette de jeu ou motion design. Devis gratuit, r\u00e9ponse sous 48\u00a0h.",
}

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "addart69@gmail.com",
    href: "mailto:addart69@gmail.com",
  },
  {
    icon: MapPin,
    label: "Localisation",
    value: "Oran, Alg\u00e9rie",
    href: undefined,
  },
]

const faqs = [
  {
    question: "Quels types de projets r\u00e9alisez-vous\u00a0?",
    answer:
      "Illustrations cartoon et character design, jaquettes de jeux vid\u00e9o et key art, graphismes pour campagnes publicitaires et r\u00e9seaux sociaux, courtes animations et motion design. Chaque projet est trait\u00e9 sur mesure, du brief \u00e0 la livraison.",
  },
  {
    question: "Comment d\u00e9marre un projet\u00a0?",
    answer:
      "Tout commence par un \u00e9change par email ou via le formulaire. On clarifie ensemble vos r\u00e9f\u00e9rences, le ton recherch\u00e9 et la plateforme de diffusion, puis on vous envoie un devis d\u00e9taill\u00e9 avec planning et jalons.",
  },
  {
    question: "Travaillez-vous \u00e0 l'international\u00a0?",
    answer:
      "Oui. Le studio est bas\u00e9 \u00e0 Oran mais nous collaborons avec des clients en Alg\u00e9rie, en France, en Europe et en Am\u00e9rique du Nord. Le travail \u00e0 distance est fluide et rod\u00e9.",
  },
  {
    question: "Quels sont vos tarifs\u00a0?",
    answer:
      "Les tarifs d\u00e9pendent du type de livrable (illustration unique, s\u00e9rie, jaquette, animation), de sa complexit\u00e9 et des droits d'usage. Nous proposons syst\u00e9matiquement un devis clair et sans engagement.",
  },
  {
    question: "Combien de temps dure un projet\u00a0?",
    answer:
      "Une illustration standalone prend en g\u00e9n\u00e9ral 5 \u00e0 10 jours. Une jaquette ou une key art compl\u00e8te 2 \u00e0 4 semaines. Une courte animation 2 \u00e0 6 semaines selon la dur\u00e9e et la complexit\u00e9 du style.",
  },
  {
    question: "Les fichiers sources sont-ils fournis\u00a0?",
    answer:
      "Oui : PSD/PNG/SVG pour les illustrations, After Effects pour les motions si besoin, et tous les exports adapt\u00e9s aux plateformes de diffusion (stores, r\u00e9seaux sociaux, print).",
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
              {"Devis gratuit. On \u00e9tudie chaque demande avec attention pour vous proposer la meilleure approche."}
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
                Demande de devis
              </h2>
              <p className="mt-2 text-muted-foreground">
                {"Remplissez le formulaire ci-dessous et on vous recontacte sous 48\u00a0h."}
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

              {/* Artist card */}
              <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 ease-out hover:shadow-md hover:border-primary/20">
                <h3 className="font-serif text-lg font-bold text-foreground">{"Derri\u00e8re AddArt"}</h3>
                <div className="mt-4 flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{"{{ARTIST_NAME}}"}</p>
                    <p className="text-xs text-muted-foreground">{"Illustrateur & Motion Designer"}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {"Studio ind\u00e9pendant bas\u00e9 \u00e0 Oran, sp\u00e9cialis\u00e9 en illustration cartoon, key art, graphismes commerciaux et courtes animations."}
                  </p>
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
