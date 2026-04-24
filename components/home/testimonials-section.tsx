"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SplitReveal } from "@/design-system/animations/split-reveal";
import { JourneyBridge } from "@/design-system/chrome/journey-bridge";
import {
  homePageDefaults,
  type HomePageContent,
} from "@/lib/content/homepage";

type TestimonialsContent = HomePageContent["testimonials"];

/**
 * Act 04 · Voices
 *
 * Moves away from the generic card carousel into an editorial pull-quote
 * spread. The active testimonial occupies a display-scale serif block on
 * the left, anchored by an oversized "«" mark. A vertical ledger on the
 * right lists every quote as a numbered, switchable entry — the reader
 * browses voices the way an editor scans a contact sheet.
 *
 * Stays on the platinum palette inherited from the Manifesto, so the
 * journey here feels like the same page taking a breath: less motion,
 * more typography, the voices of actual clients rendered like an
 * interview grid.
 */
export function TestimonialsSection({
  content = homePageDefaults.testimonials,
}: {
  content?: TestimonialsContent;
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const testimonials = content.items;
  const quoteKeyRef = useRef(0);

  useEffect(() => {
    if (current >= testimonials.length) setCurrent(0);
  }, [current, testimonials.length]);

  useEffect(() => {
    if (paused || testimonials.length < 2) return;
    const id = window.setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 6400);
    return () => window.clearInterval(id);
  }, [paused, testimonials.length]);

  const go = (next: number) => {
    const n = (next + testimonials.length) % testimonials.length;
    setCurrent(n);
    quoteKeyRef.current += 1;
  };

  const active = testimonials[current] ?? testimonials[0];
  const counter = `${String(current + 1).padStart(2, "0")} / ${String(
    testimonials.length,
  ).padStart(2, "0")}`;

  if (!active) return null;

  return (
    <section
      data-journey-palette="platinum"
      data-journey-label="Voix"
      className="relative overflow-hidden bg-background py-28 text-foreground lg:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <JourneyBridge
          roman="IV"
          ordinal="04 · 07"
          from="Manifeste"
          to="Voix"
          whisper="Le manifeste s'efface. Les clients prennent la parole — en une ligne, en une ville, en un souffle."
          inverted
        />
        {/* Chapter marker */}
        <div className="flex items-end justify-between border-b border-[hsl(var(--foreground)/0.2)] pb-6">
          <div>
            <h2 className="font-serif text-[clamp(1.8rem,4vw,3rem)] leading-[1.02] tracking-tight">
              <SplitReveal direction="mask" split="lines" duration={0.9}>
                {content.title}
              </SplitReveal>
            </h2>
          </div>
          <span className="hidden font-mono text-xs uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))] md:inline">
            {counter}
          </span>
        </div>

        {/* Editorial spread */}
        <div className="mt-16 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* Pull-quote */}
          <div className="relative lg:col-span-8">
            <span
              aria-hidden="true"
              className="absolute -left-2 -top-10 select-none font-serif text-[clamp(6rem,18vw,14rem)] leading-none text-[hsl(var(--accent)/0.22)] lg:-left-6 lg:-top-14"
            >
              &laquo;
            </span>

            <blockquote
              key={quoteKeyRef.current}
              className="relative font-serif text-[clamp(1.6rem,3.4vw,2.8rem)] leading-[1.12] tracking-[-0.01em] text-[hsl(var(--foreground))]"
              style={{ animation: "quote-in 820ms cubic-bezier(0.22,1,0.36,1) both" }}
            >
              {active.text}
            </blockquote>

            <div className="mt-10 flex items-center justify-between border-t border-[hsl(var(--foreground)/0.15)] pt-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--foreground))]">
                  {active.name}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
                  {active.city}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.35em] text-[hsl(var(--muted-foreground))]">
                <span className="inline-block h-px w-10 bg-[hsl(var(--accent))]" />
                {Array.from({ length: active.stars }).map((_, i) => (
                  <span key={i}>&#9679;</span>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="mt-10 flex items-center gap-6">
              <button
                onClick={() => go(current - 1)}
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-[hsl(var(--foreground)/0.25)] text-[hsl(var(--foreground))] transition-all duration-300 hover:border-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              </button>
              <button
                onClick={() => go(current + 1)}
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-[hsl(var(--foreground)/0.25)] text-[hsl(var(--foreground))] transition-all duration-300 hover:border-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>

              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))] md:hidden">
                {counter}
              </span>
            </div>
          </div>

          {/* Ledger */}
          <aside className="lg:col-span-4">
            <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.35em] text-[hsl(var(--muted-foreground))]">
              Répertoire
            </p>
            <ul className="divide-y divide-[hsl(var(--foreground)/0.12)]">
              {testimonials.map((t, i) => {
                const isActive = i === current;
                return (
                  <li key={`${t.name}-${i}`}>
                    <button
                      onClick={() => go(i)}
                      aria-current={isActive ? "true" : undefined}
                      className="group flex w-full items-start gap-4 py-4 text-left"
                    >
                      <span
                        className={`mt-1 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 ${
                          isActive
                            ? "text-[hsl(var(--accent))]"
                            : "text-[hsl(var(--muted-foreground))]"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">
                        <span
                          className={`block font-serif text-lg leading-tight transition-colors duration-300 ${
                            isActive
                              ? "text-[hsl(var(--foreground))]"
                              : "text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))]"
                          }`}
                        >
                          {t.name}
                        </span>
                        <span className="mt-0.5 block text-[11px] uppercase tracking-[0.28em] text-[hsl(var(--muted-foreground))]">
                          {t.city}
                        </span>
                      </span>
                      <span
                        className={`mt-2 h-px shrink-0 bg-[hsl(var(--accent))] transition-all duration-500 ${
                          isActive ? "w-10 opacity-100" : "w-3 opacity-40 group-hover:w-6 group-hover:opacity-80"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
