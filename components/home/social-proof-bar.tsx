import {
  homePageDefaults,
  type HomePageContent,
} from "@/lib/content/homepage";

type SocialProofContent = HomePageContent["socialProof"];

/**
 * A ledger ribbon that sits between Hero (Arrival) and Services
 * (Pratique). Rather than shouting stats with icons, it reads like the
 * masthead of a magazine page: hairline rules, mono labels on top,
 * display numerals below. Inherits the graphite palette, and introduces
 * the tabular-numeral motif that reappears on the section index and
 * the testimonials counter.
 */
export function SocialProofBar({
  content = homePageDefaults.socialProof,
}: {
  content?: SocialProofContent;
}) {
  const stats = content.stats;

  return (
    <section
      aria-label="Chiffres studio"
      className="relative border-y border-[hsl(var(--foreground)/0.15)] bg-background text-foreground"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[hsl(var(--foreground)/0.1)] px-0 md:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={`${stat.label}-${idx}`}
            className="flex flex-col gap-3 px-6 py-10 md:px-8"
          >
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.35em] text-[hsl(var(--muted-foreground))]">
              {String(idx + 1).padStart(2, "0")} · {stat.label}
            </span>
            <span className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] leading-none tracking-tight tabular-nums text-[hsl(var(--foreground))]">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
