import { Building2, Palette, Globe } from "lucide-react"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"

type LocalSeoContent = HomePageContent["localSeo"]

const highlightIcons = [Building2, Palette, Globe]

export function LocalSeoSection({
  content = homePageDefaults.localSeo,
}: {
  content?: LocalSeoContent
}) {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Content */}
          <div className="animate-on-scroll animate-fade-left lg:w-1/2">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              {content.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
              {content.title}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {content.body}
            </p>
          </div>

          {/* Cards */}
          <div className="animate-on-scroll animate-fade-right lg:w-1/2 flex flex-col gap-4">
            {content.highlights.map((item, index) => (
              <div key={item.title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:border-primary/20">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {(() => {
                    const Icon = highlightIcons[index] ?? Building2
                    return <Icon className="h-5 w-5" />
                  })()}
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
