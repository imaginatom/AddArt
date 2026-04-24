import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { SplitReveal } from "@/design-system/animations/split-reveal";
import { JourneyBridge } from "@/design-system/chrome/journey-bridge";
import type { PortfolioPageContent } from "@/lib/content/portfolio";
import type { SiteSettingsContent } from "@/lib/content/settings";

/**
 * Portfolio · Act III — Suite.
 *
 * The closer. Switches to the magenta palette — the same emotional
 * pivot the homepage uses for its Parlons act, but scaled down so the
 * portfolio doesn't overpromise. Two editorial columns:
 *
 *   - Left: an oversized serif headline + mailing-label style email
 *     card, the same pattern as the homepage closer so the two feel
 *     like the same studio voice.
 *   - Right: a tight "brief ledger" — three typographic rows answering
 *     "Et ensuite ?" (Brief · Devis · Livraison). A quiet script that
 *     tells the visitor what happens after they click.
 *
 * Content is sourced from `content.cta`; nothing is made up — the copy
 * just gets the editorial treatment.
 */
export type RealisationsCloserProps = {
  content: PortfolioPageContent;
  settings: SiteSettingsContent;
};

export function RealisationsCloser({ content, settings }: RealisationsCloserProps) {
  const { cta } = content;

  return (
    <section
      data-journey-palette="magenta"
      data-journey-label="Suite"
      className="relative overflow-hidden bg-background py-24 text-foreground lg:py-32"
    >
      {/* Vignette wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, hsl(var(--accent) / 0.25), transparent 60%), radial-gradient(ellipse at 10% 90%, hsl(var(--foreground) / 0.12), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <JourneyBridge
          roman="III"
          ordinal="03 · 03"
          from="Index"
          to="Suite"
          whisper="Vous avez parcouru le sommaire. La suite — si elle vous tente — se décide en un message."
        />

        <div className="mt-4 grid gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Left: editorial headline + mailing label */}
          <div className="lg:col-span-7">
            <h2 className="font-serif text-[clamp(2.4rem,5.6vw,4.8rem)] leading-[0.98] tracking-[-0.02em] text-[hsl(var(--foreground))]">
              <SplitReveal direction="mask" split="lines" duration={1}>
                {cta.title.replace(/\?$/, "")}
              </SplitReveal>
              <span className="text-[hsl(var(--accent))]">.</span>
            </h2>
            <p className="mt-8 max-w-lg font-serif text-lg italic leading-relaxed text-[hsl(var(--foreground)/0.85)] lg:text-xl">
              {cta.subtitle}
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                href={cta.primaryCtaHref}
                className="group inline-flex items-center gap-3 border border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.28em] text-[hsl(var(--background))] transition-colors duration-500 hover:border-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
              >
                {cta.primaryCtaLabel}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mailing-label email card */}
            <a
              href={`mailto:${settings.contact.email}`}
              className="group mt-10 block max-w-lg border border-[hsl(var(--foreground)/0.25)] bg-[hsl(var(--foreground)/0.04)] p-6 transition-all duration-500 hover:border-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground)/0.08)]"
              aria-label={`Envoyer un email à ${settings.contact.email}`}
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(var(--foreground)/0.7)]">
                    <Mail className="h-3 w-3" aria-hidden="true" />
                    {settings.contact.emailLabel}
                  </p>
                  <p className="mt-2 font-serif text-xl tracking-tight text-[hsl(var(--foreground))] lg:text-2xl">
                    {settings.contact.email}
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-[hsl(var(--foreground))] transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </a>
          </div>

          {/* Right: the brief ledger */}
          <aside
            className="lg:col-span-5"
            aria-label="Étapes après le premier message"
          >
            <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(var(--foreground)/0.7)]">
              Et ensuite ·
            </p>
            <ol className="divide-y divide-[hsl(var(--foreground)/0.22)] border-y border-[hsl(var(--foreground)/0.22)]">
              {STEPS.map((step, idx) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[3rem_1fr] items-baseline gap-6 py-6"
                >
                  <span className="font-serif text-3xl italic tabular-nums text-[hsl(var(--accent-foreground))]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-serif text-xl tracking-tight text-[hsl(var(--foreground))]">
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[hsl(var(--foreground)/0.8)]">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(var(--foreground)/0.7)]">
              <span
                aria-hidden="true"
                className="h-px w-10 bg-[hsl(var(--foreground))]"
              />
              Réponse &lt; 48 h · Oran → International
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

/**
 * Three-step ledger stamped into Act III. Static by design — these are
 * the studio's standard steps after first contact, not CMS-driven copy.
 * Keeping them inline keeps the closer honest and avoids another
 * admin-editable block for content that doesn't change.
 */
const STEPS: Array<{ title: string; body: string }> = [
  {
    title: "On écoute.",
    body: "Un appel de 30 minutes, un brief écrit — peu importe. L'idée, le public, l'échéance.",
  },
  {
    title: "On cadre.",
    body: "Devis transparent, planning clair, livrables nommés. Rien ne démarre avant validation.",
  },
  {
    title: "On livre.",
    body: "Itérations encadrées, fichiers sources, déclinaisons. Une seule direction artistique, tenue jusqu'au bout.",
  },
];
