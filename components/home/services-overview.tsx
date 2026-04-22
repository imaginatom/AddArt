import Link from "next/link"
import { Building2, Palette, BookOpen, ArrowRight } from "lucide-react"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"

type ServicesContent = HomePageContent["services"]

const serviceIcons = [Building2, Palette, BookOpen]
const serviceHrefs = ["/architecture", "/branding", "/contact"]

export function ServicesOverview({
  content = homePageDefaults.services,
}: {
  content?: ServicesContent
}) {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="animate-on-scroll mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">{content.eyebrow}</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            {content.title}
          </h2>
        </div>

        {/* Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-3 stagger-children">
          {content.items.map((service, index) => (
            <Link
              key={service.title}
              href={serviceHrefs[index] ?? "/contact"}
              className="animate-on-scroll group flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {(() => {
                  const Icon = serviceIcons[index] ?? Building2
                  return <Icon className="h-6 w-6" />
                })()}
              </div>
              <h3 className="mt-5 font-serif text-lg font-semibold text-foreground">{service.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:gap-2.5">
                En savoir plus
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
