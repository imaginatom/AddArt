"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * JourneyBridge — the tiny stitch at the top of each act.
 *
 *   —— AU SORTIR DE · ARRIVÉE        ACTE II · PRATIQUE        04 · 07
 *
 * A three-column mono strip that explicitly references the *previous*
 * act on the left, names the *current* act in the middle, and shows
 * the ordinal on the right. Dropped in just above each section's main
 * headline, it turns isolated sections into chapters in a single
 * narrative. The hairline on the left is the same magenta rule used
 * by the SiteHeader, ScrollProgress, JourneySpine and ActFlash, so
 * every act reads as part of the same document.
 *
 * Pure presentation — no scroll math, no refs. The parent decides
 * which props to pass (from the content layer / homepage).
 */
export type JourneyBridgeProps = {
  /** Roman numeral for the current act, e.g. "II". */
  roman: string;
  /** Ordinal, e.g. "02 · 07". */
  ordinal: string;
  /** Previous-act name, e.g. "Arrivée". */
  from?: string;
  /** Current-act name (used as the spine label too), e.g. "Pratique". */
  to: string;
  /** Optional one-liner that sets the emotional register of the act. */
  whisper?: ReactNode;
  className?: string;
  /**
   * When true, reverses on-light (platinum / magenta) palettes so the
   * rule still reads. Default: auto via currentColor + accent var.
   */
  inverted?: boolean;
};

export function JourneyBridge({
  roman,
  ordinal,
  from,
  to,
  whisper,
  className,
  inverted = false,
}: JourneyBridgeProps) {
  return (
    <div
      data-journey-chrome="bridge"
      className={cn(
        "flex flex-col gap-3 pb-8 lg:pb-10",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.4em]",
          inverted
            ? "text-[hsl(var(--foreground)/0.65)]"
            : "text-[hsl(var(--muted-foreground))]",
        )}
      >
        {from ? (
          <span className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-8"
              style={{ background: "hsl(var(--accent))" }}
            />
            <span className="whitespace-nowrap">
              au sortir de <span className="opacity-80">· {from}</span>
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-8"
              style={{ background: "hsl(var(--accent))" }}
            />
            <span className="whitespace-nowrap">lever de rideau</span>
          </span>
        )}
        <span
          className="whitespace-nowrap"
          style={{ color: "hsl(var(--accent))" }}
        >
          Acte <span className="font-serif italic">{roman}</span> · {to}
        </span>
        <span className="ml-auto hidden tabular-nums tracking-[0.3em] md:inline">
          {ordinal}
        </span>
      </div>
      {whisper ? (
        <p
          className={cn(
            "max-w-xl font-serif text-[15px] italic leading-relaxed",
            inverted
              ? "text-[hsl(var(--foreground)/0.7)]"
              : "text-[hsl(var(--foreground)/0.55)]",
          )}
        >
          {whisper}
        </p>
      ) : null}
    </div>
  );
}
