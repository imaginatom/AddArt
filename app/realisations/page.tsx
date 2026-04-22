import type { Metadata } from "next"
import { RealisationsGallery } from "@/components/realisations-gallery"
import Link from "next/link"
import { ArrowRight, Mail, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { mergePortfolioContent } from "@/lib/content/portfolio"

export const metadata: Metadata = {
  title: "Portfolio — Projets d'Architecture & Branding",
  description:
    "D\u00e9couvrez le portfolio de Noun Studio : projets d'architecture r\u00e9sidentielle et commerciale, identit\u00e9s visuelles et design int\u00e9rieur en Alg\u00e9rie et en France.",
}

export default async function RealisationsPage() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("site_content")
    .select("section, content")
    .eq("page", "portfolio")
  const content = mergePortfolioContent(error ? [] : data ?? [])

  return (
    <>
      {/* Hero */}
      <section className="bg-card pt-32 pb-14 lg:pt-40 lg:pb-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <nav aria-label="Fil d'Ariane" className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              {content.hero.breadcrumbHomeLabel}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{content.hero.breadcrumbCurrentLabel}</span>
          </nav>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">{content.hero.eyebrow}</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-foreground md:text-5xl text-balance">
              {content.hero.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{content.hero.subtitle}</p>
          </div>
        </div>
      </section>

      <RealisationsGallery categories={content.gallery.categories} projects={content.gallery.projects} />

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-primary-foreground md:text-4xl text-balance">
            {content.cta.title}
          </h2>
          <p className="mt-3 text-primary-foreground/80">{content.cta.subtitle}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
              <Link href={content.cta.primaryCtaHref}>
                {content.cta.primaryCtaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <a href={`mailto:${content.cta.emailAddress}`}>
                <Mail className="mr-2 h-4 w-4" />
                {content.cta.emailLabel}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
