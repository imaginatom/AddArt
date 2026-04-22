import Image from "next/image"
import Link from "next/link"
import { CheckCircle, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"

type HeroContent = HomePageContent["hero"]

export function HeroSection({ content = homePageDefaults.hero }: { content?: HeroContent }) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Background Image */}
      <Image
        src={content.backgroundImage.src}
        alt={content.backgroundImage.alt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-foreground/20" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-32 lg:px-8">
        <div className="max-w-2xl animate-on-scroll is-visible" style={{ animationDelay: "200ms" }}>
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-background/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-sm font-medium text-primary-foreground">
              {content.badgeText}
            </span>
          </div>

          {/* H1 */}
          <h1 className="font-serif text-4xl font-bold leading-tight text-background md:text-5xl lg:text-6xl text-balance">
            {content.title}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-xl text-base leading-relaxed text-background/80 md:text-lg">
            {content.subtitle}
          </p>

          {/* Trust Bullets */}
          <ul className="mt-8 flex flex-col gap-2.5">
            {content.trustBullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-2.5 text-sm text-background/90">
                <CheckCircle className="h-4 w-4 shrink-0 text-accent" />
                {bullet}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-xl transition-all">
              <Link href="/contact" aria-label="D\u00e9couvrir nos services">
                {content.primaryCtaLabel}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background transition-all">
              <Link href="/realisations" aria-label="Voir le portfolio">
                {content.secondaryCtaLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <ChevronDown className="h-6 w-6 text-background/60" />
      </div>
    </section>
  )
}
