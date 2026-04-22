import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  Brush,
  Gamepad2,
  Megaphone,
  BookOpen,
  CheckCircle,
  Mail,
  ClipboardList,
  FileText,
  Sparkles,
  PartyPopper,
  ArrowRight,
  Film,
  ChevronRight,
} from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { mergeIllustrationContent } from "@/lib/content/illustration"

export const metadata: Metadata = {
  title: "Illustration & Cartoon Art",
  description:
    "Services d'illustration par AddArt : character design, key art, jaquettes de jeux et graphismes commerciaux. Studio basé à Oran, Algérie.",
}

const serviceIcons = [Brush, Gamepad2, Megaphone, BookOpen]
const processIcons = [Mail, FileText, Sparkles, PartyPopper]

export default async function IllustrationPage() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("site_content")
    .select("section, content")
    .eq("page", "illustration")
  const content = mergeIllustrationContent(error ? [] : data ?? [])

  return (
    <>
      {/* Hero + Intro — side-by-side with a 45° diagonal seam on desktop,
          stacked on mobile. Each panel slides in from its edge on scroll. */}
      <section className="relative overflow-hidden">
        <div className="relative lg:h-[85vh] lg:min-h-[620px]">
          {/* HERO — bigger panel, animates in from the left */}
          <div className="diagonal-left animate-on-scroll animate-fade-left relative overflow-hidden pt-32 pb-14 lg:absolute lg:inset-0 lg:pt-40 lg:pb-20">
            <Image
              src={content.hero.backgroundImage.src}
              alt={content.hero.backgroundImage.alt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 75vw"
            />
            <div className="absolute inset-0 bg-foreground/65" />
            <div className="relative z-10 flex h-full items-center">
              <div className="w-full px-4 lg:max-w-[34vw] lg:pl-14 lg:pr-0">
                <nav
                  aria-label="Fil d'Ariane"
                  className="mb-4 flex items-center gap-1.5 text-xs text-background/60"
                >
                  <Link href="/" className="transition-colors hover:text-background">
                    {content.hero.breadcrumbHomeLabel}
                  </Link>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-background/90">
                    {content.hero.breadcrumbCurrentLabel}
                  </span>
                </nav>
                <h1 className="font-serif text-3xl font-bold text-background md:text-5xl lg:text-[3rem] lg:leading-[1.05] text-balance">
                  {content.hero.title}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-background/80 lg:text-lg">
                  {content.hero.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* INTRO — smaller panel, animates in from the right */}
          <div className="diagonal-right animate-on-scroll animate-fade-right relative bg-card py-16 lg:absolute lg:inset-0 lg:py-0">
            <div className="relative flex h-full items-center justify-end">
              <div className="w-full px-4 lg:max-w-[30vw] lg:px-14 lg:pr-16">
                <p className="text-xs font-medium uppercase tracking-widest text-accent">
                  {content.hero.breadcrumbCurrentLabel}
                </p>
                <h2 className="mt-3 font-serif text-2xl font-bold text-foreground md:text-3xl text-balance">
                  {content.intro.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground lg:text-[1.05rem]">
                  {content.intro.body}
                </p>
              </div>
            </div>
          </div>

          {/* Magenta hairline along the diagonal seam (desktop only) */}
          <div
            aria-hidden="true"
            className="diagonal-seam pointer-events-none absolute inset-0 hidden bg-accent/80 shadow-[0_0_30px_hsl(var(--accent)/0.6)] lg:block"
          />
        </div>
      </section>

      {/* Sub-services */}
      <section className="bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              {content.services.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{content.services.subtitle}</p>
          </div>

          <div className="mt-16 flex flex-col gap-20">
            {content.services.items.map((service, i) => {
              const ServiceIcon = serviceIcons[i] ?? Brush
              return (
                <div
                  key={service.title}
                  className={`flex flex-col items-center gap-10 lg:flex-row ${i % 2 === 1 ? "lg:flex-row-reverse" : ""} lg:gap-16`}
                >
                  <div className="w-full lg:w-1/2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ServiceIcon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-serif text-2xl font-bold text-foreground">{service.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{service.description}</p>
                    <ul className="mt-6 flex flex-col gap-2.5">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:w-1/2">
                    <Image
                      src={service.image.src}
                      alt={service.image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              {content.process.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{content.process.subtitle}</p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {content.process.steps.map((step, index) => {
              const StepIcon = processIcons[index] ?? Mail
              return (
                <div
                  key={step.step}
                  className="relative flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-primary/20"
                >
                  <span className="absolute -top-4 left-6 flex h-8 items-center rounded-full bg-primary px-3.5 text-xs font-bold text-primary-foreground">
                    {step.step}
                  </span>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <StepIcon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
            <div className="text-center lg:w-1/2 lg:text-left">
              <h2 className="font-serif text-3xl font-bold text-primary-foreground md:text-4xl text-balance">
                {content.cta.title}
              </h2>
              <p className="mt-3 text-lg text-primary-foreground/80">{content.cta.subtitle}</p>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="rounded-2xl bg-background p-6 shadow-lg md:p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="border-t border-border py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl text-balance">
              {content.crossLinks.title}
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Link
              href="/motion"
              className="group flex items-center gap-6 rounded-2xl border border-border bg-card p-6 transition-all duration-300 ease-out hover:border-primary/30 hover:bg-card/80 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Film className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  {content.crossLinks.cards[0].title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {content.crossLinks.cards[0].description}
                </p>
              </div>
              <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
            <Link
              href="/realisations"
              className="group flex items-center gap-6 rounded-2xl border border-border bg-card p-6 transition-all duration-300 ease-out hover:border-primary/30 hover:bg-card/80 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  {content.crossLinks.cards[1].title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {content.crossLinks.cards[1].description}
                </p>
              </div>
              <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
