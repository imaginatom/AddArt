"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitReveal } from "@/design-system/animations/split-reveal";
import { JourneyBridge } from "@/design-system/chrome/journey-bridge";
import {
  homePageDefaults,
  type HomePageContent,
} from "@/lib/content/homepage";

type LocalSeoContent = HomePageContent["localSeo"];

/**
 * Act 06 · Territoire
 *
 * Swaps the generic "text left · cards right" block for a split-sticky
 * spread: a pinned typographic plate on the left carries the section's
 * title + a rotating highlight, while the right column scrolls past as
 * numbered chapters. The left plate reacts to which chapter is in view
 * and nudges in a subtle radial gradient behind it — a compass that
 * orients the reader inside the journey.
 *
 * Palette: ember — a graphite-plus-magenta tint that signals we've left
 * the platinum manifesto and are descending toward the magenta closer.
 */
export function LocalSeoSection({
  content = homePageDefaults.localSeo,
}: {
  content?: LocalSeoContent;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const highlights = content.highlights;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const rightCol = root.querySelector<HTMLElement>("[data-territoire-chapters]");
      if (!rightCol) return;

      const chapters = rightCol.querySelectorAll<HTMLElement>("[data-territoire-chapter]");

      chapters.forEach((chapter, idx) => {
        ScrollTrigger.create({
          trigger: chapter,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActiveIdx(idx);
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [highlights.length]);

  const active = highlights[activeIdx] ?? highlights[0];

  return (
    <section
      ref={rootRef}
      data-journey-palette="ember"
      data-journey-label="Territoire"
      className="relative overflow-hidden bg-background py-28 text-foreground lg:py-36"
    >
      <div className="mx-auto grid max-w-7xl gap-16 px-4 lg:grid-cols-12 lg:gap-24 lg:px-8">
        {/* Pinned plate */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-8 -z-10 opacity-60 transition-opacity duration-700"
                style={{
                  background:
                    "radial-gradient(closest-side, hsl(var(--accent) / 0.18), transparent 70%)",
                }}
              />
              <JourneyBridge
                roman="VI"
                ordinal="06 · 07"
                from="Œuvres"
                to={content.eyebrow}
                whisper="La caméra recule. On retrouve le studio dans sa ville, son port, son horaire — le travail a un lieu."
              />
              <h2 className="mt-1 font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[0.98] tracking-tight">
                <SplitReveal direction="mask" split="lines" duration={1}>
                  {content.title}
                </SplitReveal>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
                {content.body}
              </p>

              {/* Active chapter echo */}
              {active ? (
                <div className="mt-12 hidden lg:block">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
                    En lecture · {String(activeIdx + 1).padStart(2, "0")}
                  </p>
                  <p
                    key={active.title}
                    className="mt-3 font-serif text-2xl leading-tight text-[hsl(var(--foreground))]"
                    style={{ animation: "quote-in 620ms cubic-bezier(0.22,1,0.36,1) both" }}
                  >
                    {active.title}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div data-territoire-chapters className="lg:col-span-7">
          <ol className="flex flex-col gap-20">
            {highlights.map((item, idx) => (
              <li
                key={item.title}
                data-territoire-chapter
                className="group relative pl-10 lg:pl-16"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-[hsl(var(--accent))]"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="absolute left-0 top-7 h-px w-8 bg-[hsl(var(--accent)/0.6)] transition-all duration-500 group-hover:w-12 lg:w-12" />

                <h3 className="font-serif text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1] tracking-tight text-[hsl(var(--foreground))]">
                  <SplitReveal direction="mask" split="lines" duration={0.85}>
                    {item.title}
                  </SplitReveal>
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
