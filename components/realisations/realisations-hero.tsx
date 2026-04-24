import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SplitReveal } from "@/design-system/animations/split-reveal";
import { JourneyBridge } from "@/design-system/chrome/journey-bridge";
import type { PortfolioPageContent } from "@/lib/content/portfolio";

/**
 * Portfolio · Act I — Seuil.
 *
 * The editorial opener for the portfolio route. Rather than the generic
 * centered title + subtitle block, this is a full masthead spread:
 *
 *   breadcrumb          ·  01 · Seuil   ·  12 projets · 5 disciplines
 *   ─── au sortir de Accueil     Acte I · Seuil
 *
 *        Le portfolio,
 *        comme un contact sheet.
 *
 *        "Douze créations choisies. Quatre disciplines. Quatre villes.
 *         On regarde, on classe, on entre."
 *
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │  N° 01  Mascotte Cartoon            Cartoons · Oran · 2026  │
 *   │  N° 02  Jaquette Indie Game         Game Covers · Alger ·… │
 *   │  ...                                                        │
 *   └─────────────────────────────────────────────────────────────┘
 *
 * The bottom ledger is a typographic table of contents — every project,
 * one row, monospaced — before the visual gallery kicks in below. It's
 * the same trick newspapers use: list the stories before showing the
 * photographs. By the time the eye lands on the grid, it already knows
 * how many pieces it's reading.
 */
export type RealisationsHeroProps = {
  content: PortfolioPageContent;
};

export function RealisationsHero({ content }: RealisationsHeroProps) {
  const { hero, gallery } = content;
  const projectCount = gallery.projects.length;
  const disciplineCount = Math.max(0, gallery.categories.length - 1);
  const cities = Array.from(
    new Set(gallery.projects.map((project) => project.location)),
  );

  return (
    <section
      data-journey-palette="graphite"
      data-journey-label="Seuil"
      className="relative overflow-hidden bg-background pb-20 pt-32 text-foreground lg:pb-28 lg:pt-40"
    >
      {/* Soft radial wash — anchors the eye to the top-left masthead */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(closest-side at 20% 30%, hsl(var(--accent) / 0.12), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(var(--muted-foreground))]"
        >
          <Link
            href="/"
            className="transition-colors duration-300 hover:text-[hsl(var(--accent))]"
          >
            {hero.breadcrumbHomeLabel}
          </Link>
          <ChevronRight className="h-3 w-3 opacity-60" aria-hidden="true" />
          <span className="text-[hsl(var(--foreground))]">
            {hero.breadcrumbCurrentLabel}
          </span>
        </nav>

        {/* Bridge stitches this page back to the homepage's journey */}
        <div className="mt-10">
          <JourneyBridge
            roman="I"
            ordinal="01 · 03"
            from="Accueil"
            to="Seuil"
            whisper="Douze créations, quatre disciplines, quatre villes. On regarde, on classe, on entre."
          />
        </div>

        {/* Masthead: title on the left, stats on the right */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <SplitReveal
              as="h1"
              split="lines"
              direction="mask"
              duration={1.05}
              className="font-serif font-medium leading-[0.96] tracking-[-0.02em] text-[clamp(2.6rem,7vw,6.4rem)]"
            >
              {hero.title}
            </SplitReveal>
            <p className="mt-8 max-w-xl font-serif text-lg italic leading-relaxed text-[hsl(var(--foreground)/0.72)] lg:text-xl">
              {hero.subtitle}
            </p>
          </div>

          {/* Stats column — a three-row editorial ledger */}
          <aside
            className="relative lg:col-span-4"
            aria-label="Statistiques du portfolio"
          >
            <dl className="divide-y divide-[hsl(var(--foreground)/0.14)] border-y border-[hsl(var(--foreground)/0.14)]">
              <div className="flex items-baseline justify-between gap-6 py-5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(var(--muted-foreground))]">
                  Projets
                </dt>
                <dd className="font-serif text-4xl tabular-nums tracking-tight text-[hsl(var(--accent))]">
                  {String(projectCount).padStart(2, "0")}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(var(--muted-foreground))]">
                  Disciplines
                </dt>
                <dd className="font-serif text-4xl tabular-nums tracking-tight">
                  {String(disciplineCount).padStart(2, "0")}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(var(--muted-foreground))]">
                  Villes
                </dt>
                <dd className="max-w-[60%] text-right font-mono text-[11px] uppercase tracking-[0.25em] leading-relaxed">
                  {cities.slice(0, 4).join(" · ")}
                  {cities.length > 4 ? " · …" : ""}
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        {/* Project ledger — typographic table of contents.
            Scrolls horizontally on mobile; lays out as rows on desktop. */}
        <ol
          aria-label="Sommaire des projets"
          className="mt-20 divide-y divide-[hsl(var(--foreground)/0.12)] border-y border-[hsl(var(--foreground)/0.12)]"
        >
          {gallery.projects.map((project, idx) => (
            <li
              key={`${project.title}-${idx}`}
              className="grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))] sm:grid-cols-[3rem_1.4fr_1fr_auto] sm:gap-6"
            >
              <span className="tabular-nums text-[hsl(var(--foreground)/0.7)]">
                N° {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="truncate font-serif text-base italic tracking-[0] text-[hsl(var(--foreground))] sm:text-lg">
                {project.title}
              </span>
              <span className="hidden truncate sm:inline">
                {project.category}
              </span>
              <span className="whitespace-nowrap text-right">
                {project.location}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
