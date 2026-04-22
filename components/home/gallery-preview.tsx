import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"
import { SplitReveal } from "@/design-system/animations/split-reveal"
import { AsymmetricMarquee, type MarqueeItem } from "@/design-system/animations/asymmetric-marquee"

type GalleryContent = HomePageContent["galleryPreview"]

export function GalleryPreview({
  content = homePageDefaults.galleryPreview,
  images = [],
}: {
  content?: GalleryContent
  images?: Array<{ src: string; alt: string; label: string }>
}) {
  const marqueeItems: MarqueeItem[] = images.map((image) => ({
    src: image.src,
    alt: image.alt,
    title: image.label,
    subtitle: content.eyebrow,
    href: "/realisations",
  }))

  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="animate-on-scroll mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            {content.eyebrow}
          </p>
          <SplitReveal
            as="h2"
            split="lines"
            direction="mask"
            className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance"
          >
            {content.title}
          </SplitReveal>
          <p className="mt-3 text-muted-foreground">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Full-bleed asymmetric reel — breaks the container for edge-to-edge feel */}
      {marqueeItems.length > 0 ? (
        <div className="mt-14">
          <AsymmetricMarquee items={marqueeItems} speed={45} fadeVar="--card" />
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mt-4 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/5 hover:text-primary bg-transparent"
          >
            <Link href="/realisations">
              {content.ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
