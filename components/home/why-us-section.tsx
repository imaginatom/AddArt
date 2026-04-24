import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"
import { SplitReveal } from "@/design-system/animations/split-reveal"
import { Odometer } from "@/design-system/animations/odometer"
import { JourneyBridge } from "@/design-system/chrome/journey-bridge"

type WhyUsContent = HomePageContent["whyUs"]

/**
 * Act 03 · Thesis — the Manifesto moment.
 *
 * The only section in the journey rendered in the platinum palette (light
 * off-white background, dark text). The palette shift is the emotional
 * high-beam: after the dark opener and the dark services chapter, the
 * page suddenly opens up into a light editorial page. Studio reveals
 * itself as a thinking partner, not just a hand for hire.
 *
 * The five CMS benefits still ship as content (SEO + CMS-editable), but
 * instead of a five-icon checklist they're expressed as:
 *
 *   - A hardcoded editorial thesis paragraph (display scale, line
 *     reveal) that captures the studio's pitch — the kind of copy an
 *     admin shouldn't have to write.
 *   - A running phrase strip built from the actual CMS benefit titles
 *     (the content stays authoritative, the presentation doesn't).
 *   - A loud odometer stat to the right, anchored by the CMS-editable
 *     floating-badge value/label.
 */
const MANIFESTO_LINES = [
  "On ne livre pas des fichiers.",
  "On construit des univers — pensés, tenus, racontés.",
  "Chaque projet est une mini-direction artistique :",
  "un cap clair, un style qui tient, des livrables qui servent le message.",
]

export function WhyUsSection({
  content = homePageDefaults.whyUs,
}: {
  content?: WhyUsContent
}) {
  const benefitPhrases = content.benefits.map((b) => b.title)

  return (
    <section
      data-journey-palette="platinum"
      data-journey-label="Manifeste"
      className="relative overflow-hidden bg-background py-28 text-foreground lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <JourneyBridge
          roman="III"
          ordinal="03 · 07"
          from="Pratique"
          to="Manifeste"
          whisper="Le jour se lève sur la page. Le studio sort du garage et déclare ses intentions."
          inverted
        />
        <h2 className="sr-only">{content.title}</h2>

        {/* Thesis + stat, side-by-side on large screens, stacked otherwise */}
        <div className="mt-16 grid gap-16 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* Editorial manifesto paragraph */}
          <div className="lg:col-span-8">
            <div
              className="font-serif font-medium leading-[1.08] tracking-tight text-foreground"
              style={{ fontSize: "clamp(32px, 4.6vw, 68px)" }}
            >
              {MANIFESTO_LINES.map((line, i) => (
                <SplitReveal
                  as="p"
                  key={line}
                  split="lines"
                  direction={i === 0 ? "mask" : "up"}
                  delay={0.12 * i}
                  className="text-balance"
                >
                  {line}
                </SplitReveal>
              ))}
            </div>

            {/* CTA + subtle link */}
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/contact"
                className="group/cta inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-background transition-transform duration-300 hover:scale-[1.02]"
              >
                {content.ctaLabel}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
              </Link>
              <Link
                href="/a-propos"
                className="group/link inline-flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <span className="relative">
                  Nos principes
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover/link:scale-x-100" />
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Odometer stat block — anchored to the right, loud but quiet */}
          <aside
            className="animate-on-scroll relative lg:col-span-4 lg:pl-8 lg:border-l lg:border-border"
            aria-label="Chiffres clés du studio"
          >
            <div className="flex items-start gap-2">
              <Odometer
                value={content.floatingBadge.value}
                className="font-serif font-bold leading-[0.9] tracking-tight text-accent"
                style={{ fontSize: "clamp(96px, 14vw, 220px)" }}
              />
            </div>
            <p className="mt-4 max-w-[22ch] text-base uppercase tracking-[0.22em] text-muted-foreground">
              {content.floatingBadge.label}
            </p>

            <div className="mt-10 space-y-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                Sept ans à construire des mondes, personnages et histoires pour
                des studios, éditeurs et marques — d'Oran au reste du monde.
              </p>
              <p className="flex items-center gap-2 font-medium uppercase tracking-[0.18em] text-foreground">
                <span className="h-px w-6 bg-accent" />
                Basé à Oran · dispo partout
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Phrase marquee — benefits flow as a single continuous line, full width */}
      <div
        className="relative mt-24 overflow-hidden border-y border-border py-6"
        aria-hidden="true"
        data-journey-opt-out
      >
        <div
          className="flex w-max items-center gap-10 whitespace-nowrap will-change-transform"
          style={{ animation: "text-marquee-rtl 46s linear infinite" }}
        >
          {[...benefitPhrases, ...benefitPhrases, ...benefitPhrases].map(
            (phrase, idx) => (
              <span
                key={`${phrase}-${idx}`}
                className="flex items-center gap-10 font-serif italic text-muted-foreground"
                style={{ fontSize: "clamp(22px, 2.2vw, 36px)" }}
              >
                {phrase}
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
                  aria-hidden="true"
                />
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
