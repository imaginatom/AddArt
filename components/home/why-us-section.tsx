import Image from "next/image"
import Link from "next/link"
import { ShieldCheck, Heart, Compass, MessageSquare, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"

type WhyUsContent = HomePageContent["whyUs"]

const benefitIcons = [ShieldCheck, Heart, Compass, MessageSquare, Layers]

export function WhyUsSection({
  content = homePageDefaults.whyUs,
}: {
  content?: WhyUsContent
}) {
  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Image */}
          <div className="animate-on-scroll animate-fade-left relative w-full lg:w-[55%]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={content.image.src}
                alt={content.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-2 rounded-xl border border-border bg-background p-4 shadow-lg md:-bottom-6 md:right-6">
              <p className="font-serif text-2xl font-bold text-accent">{content.floatingBadge.value}</p>
              <p className="text-xs text-muted-foreground">{content.floatingBadge.label}</p>
            </div>
          </div>

          {/* Content */}
          <div className="animate-on-scroll animate-fade-right w-full lg:w-[45%]">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">{content.eyebrow}</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              {content.title}
            </h2>

            <ul className="mt-8 flex flex-col gap-5">
              {content.benefits.map((benefit, index) => (
                <li key={benefit.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {(() => {
                      const Icon = benefitIcons[index] ?? ShieldCheck
                      return <Icon className="h-5 w-5" />
                    })()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{benefit.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Button asChild className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/contact">{content.ctaLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
