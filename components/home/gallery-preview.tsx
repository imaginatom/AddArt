import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"
import { SplitReveal } from "@/design-system/animations/split-reveal"
import { AsymmetricMarquee, type MarqueeItem } from "@/design-system/animations/asymmetric-marquee"
import { JourneyBridge } from "@/design-system/chrome/journey-bridge"

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
    <section
      data-journey-palette="graphite"
      data-journey-label="Œuvres"
      className="relative overflow-hidden bg-background py-24 text-foreground lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <JourneyBridge
          roman="V"
          ordinal="05 · 07"
          from="Voix"
          to="Œuvres"
          whisper="Les voix s'effacent, les images prennent leur tour. On défile, on regarde, on respire."
        />
        <div className="flex items-end justify-between border-b border-[hsl(var(--foreground)/0.18)] pb-6">
          <div>
            <SplitReveal
              as="h2"
              split="lines"
              direction="mask"
              className="font-serif text-[clamp(1.8rem,4vw,3rem)] leading-[1.02] tracking-tight"
            >
              {content.title}
            </SplitReveal>
          </div>
          <p className="hidden max-w-xs text-right text-sm leading-relaxed text-[hsl(var(--muted-foreground))] md:block">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Full-bleed asymmetric reel — breaks the container for edge-to-edge feel */}
      {marqueeItems.length > 0 ? (
        <div className="mt-14">
          <AsymmetricMarquee items={marqueeItems} speed={45} fadeVar="--background" />
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mt-10 flex justify-center">
          <Button
            asChild
            variant="ghost"
            className="group h-auto px-0 text-sm font-medium uppercase tracking-[0.25em] text-[hsl(var(--foreground))] hover:bg-transparent hover:text-[hsl(var(--accent))]"
          >
            <Link href="/realisations">
              {content.ctaLabel}
              <ArrowRight className="ml-3 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
