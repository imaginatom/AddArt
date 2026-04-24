"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * JourneySpine — the left-edge narrator thread.
 *
 * A vertical ribbon pinned to the left edge of the viewport that stays
 * visible across every act. It holds three things stacked on top of
 * each other:
 *
 *   ·  a micro wordmark running down the rail
 *   ·  a running hairline that tracks document progress
 *   ·  a roman numeral + label that updates as each act takes focus
 *
 * Together with the top scroll-progress bar and the right section-index,
 * it gives the user something that is *always on screen* and always
 * morphing with the palette — so the page reads as one conversation.
 * Every element inherits CSS vars, so when the palette morphs (graphite
 * → platinum → ember → magenta → abyss) the spine morphs with it.
 *
 * Rendered only on marketing routes and on viewports ≥ 1024px (below
 * that the right-side section-index + top scroll-progress already
 * carry the load, and screen real-estate is too tight).
 *
 * Listens to the same `journey:act` event the provider dispatches, so
 * there's zero duplication of scroll/intersection math.
 */

type ActState = {
  idx: number;
  total: number;
  label: string;
};

const ROMAN = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
] as const;

export function JourneySpine() {
  const pathname = usePathname() ?? "/";
  const isMarketingRoute =
    !pathname.startsWith("/admin") && !pathname.startsWith("/login");

  const [state, setState] = useState<ActState>({ idx: 0, total: 0, label: "" });
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const pendingRef = useRef(false);

  useEffect(() => {
    if (!isMarketingRoute) return;
    if (typeof window === "undefined") return;

    const computeActs = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>("[data-journey-palette]"),
      ).filter((el) => el !== document.body);

    const onAct = (event: Event) => {
      const detail = (event as CustomEvent).detail as {
        section: HTMLElement | null;
        label: string;
      };
      if (!detail) return;
      const acts = computeActs();
      const total = acts.length;
      const idx = detail.section ? acts.indexOf(detail.section) : -1;
      setState({
        idx: idx >= 0 ? idx + 1 : 0,
        total,
        label: detail.label ?? "",
      });
    };

    const onScroll = () => {
      if (pendingRef.current) return;
      pendingRef.current = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        const p = scrollable > 0 ? window.scrollY / scrollable : 0;
        setProgress(Math.max(0, Math.min(1, p)));
        pendingRef.current = false;
      });
    };

    // Seed state from whatever the provider has already decided.
    const initialSection = document.body.dataset.journeyActive;
    if (initialSection) {
      const acts = computeActs();
      const el = acts.find(
        (a) => a.dataset.journeyPalette === initialSection,
      );
      if (el) {
        const idx = acts.indexOf(el);
        setState({
          idx: idx + 1,
          total: acts.length,
          label: el.dataset.journeyLabel ?? "",
        });
      }
    }
    onScroll();

    // Show after a brief delay so the page-intro doesn't collide with it.
    const visibleTimer = window.setTimeout(() => setVisible(true), 1900);

    window.addEventListener("journey:act", onAct as EventListener);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.clearTimeout(visibleTimer);
      window.removeEventListener("journey:act", onAct as EventListener);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isMarketingRoute, pathname]);

  if (!isMarketingRoute) return null;
  if (state.total === 0) return null;

  const roman = ROMAN[state.idx] ?? "";

  return (
    <aside
      aria-hidden="true"
      data-journey-chrome="spine"
      className={`pointer-events-none fixed bottom-0 left-0 top-0 z-40 hidden w-12 select-none flex-col items-center justify-between pb-8 pt-24 transition-opacity duration-700 lg:flex ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        color: "hsl(var(--foreground) / 0.6)",
      }}
    >
      {/* Top: wordmark */}
      <span
        className="font-mono text-[10px] uppercase tracking-[0.4em]"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        AddArt · Journey 2026
      </span>

      {/* Middle: rail with progress + act label */}
      <div className="relative flex h-[60%] w-full flex-col items-center">
        {/* Rail background */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
          style={{ background: "hsl(var(--foreground) / 0.12)" }}
        />
        {/* Rail progress */}
        <span
          aria-hidden="true"
          className="absolute top-0 left-1/2 w-px -translate-x-1/2 origin-top transition-[height] duration-300 ease-out"
          style={{
            height: `${progress * 100}%`,
            background:
              "linear-gradient(to bottom, hsl(var(--accent)) 0%, hsl(var(--accent) / 0.6) 100%)",
          }}
        />
        {/* Indicator dot — slides with progress */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full transition-[top] duration-300 ease-out"
          style={{
            top: `calc(${progress * 100}% - 3px)`,
            background: "hsl(var(--accent))",
            boxShadow: "0 0 0 4px hsl(var(--background))",
          }}
        />
      </div>

      {/* Bottom: current act (roman numeral + label) */}
      <div
        className="flex flex-col items-center gap-2"
        key={`${state.idx}-${state.label}`}
        style={{ animation: "spine-act-in 600ms cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <span
          className="font-serif text-sm italic leading-none"
          style={{ color: "hsl(var(--accent))" }}
        >
          {roman}
        </span>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.4em]"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {state.label || "—"}
        </span>
        <span className="font-mono text-[10px] tabular-nums tracking-[0.15em]">
          {String(state.idx).padStart(2, "0")}/{String(state.total).padStart(2, "0")}
        </span>
      </div>
    </aside>
  );
}
