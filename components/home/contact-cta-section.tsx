import { Mail } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"

type ContactCtaContent = HomePageContent["contactCta"]

export function ContactCtaSection({
  content = homePageDefaults.contactCta,
}: {
  content?: ContactCtaContent
}) {
  return (
    <section id="contact" className="bg-primary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Content */}
          <div className="animate-on-scroll animate-fade-left text-center lg:w-1/2 lg:text-left">
            <h2 className="font-serif text-3xl font-bold text-primary-foreground md:text-4xl text-balance">
              {content.title}
            </h2>
            <p className="mt-3 text-lg text-primary-foreground/80">
              {content.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <a
                href={`mailto:${content.emailAddress}`}
                aria-label="Envoyer un email \u00e0 Noun Studio"
                className="flex items-center gap-3 text-primary-foreground/90 transition-colors hover:text-primary-foreground lg:justify-start justify-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-primary-foreground/60">{content.emailLabel}</p>
                  <p className="text-sm font-medium">{content.emailAddress}</p>
                </div>
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="animate-on-scroll animate-fade-right w-full lg:w-1/2">
            <div className="rounded-2xl bg-background p-6 shadow-lg md:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
