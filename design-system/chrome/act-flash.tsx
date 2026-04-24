"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * ActFlash — the chapter card.
 *
 * When the journey crosses into a new act (i.e. the palette actually
 * changes, not just a same-palette section transition), a brief card
 * flashes across the viewport showing:
 *
 *     — acte précédent  —→  acte suivant
 *     II · MANIFESTE
 *
 * 700ms on, then it fades away. It's the cinema trick: short dissolves
 * between scenes make the viewer feel continuity, not stitching. We
 * listen to the JourneyProvider's `journey:act` events and debounce
 * rapid palette thrashing (e.g. during page-intro settle) so we only
 * fire on genuine hand-offs.
 *
 * Suppressed on the very first act (no "from") and when the user has
 * `prefers-reduced-motion: reduce`.
 */

type Flash = {
  key: number;
  from: string;
  to: string;
  roman: string;
  number: string;
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

export function ActFlash() {
  const pathname = usePathname() ?? "/";
  const isMarketingRoute =
    !pathname.startsWith("/admin") && !pathname.startsWith("/login");
  const [flash, setFlash] = useState<Flash | null>(null);
  const keyRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const lastFireRef = useRef(0);

  useEffect(() => {
    if (!isMarketingRoute) return;
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const onAct = (event: Event) => {
      const detail = (event as CustomEvent).detail as {
        previousSection: HTMLElement | null;
        section: HTMLElement | null;
        paletteChanged: boolean;
      } | null;
      if (!detail) return;
      if (!detail.paletteChanged) return;
      if (!detail.previousSection) return; // first palette land — skip
      if (!detail.section) return;

      const now = performance.now();
      if (now - lastFireRef.current < 400) return;
      lastFireRef.current = now;

      const acts = Array.from(
        document.querySelectorAll<HTMLElement>("[data-journey-palette]"),
      ).filter((el) => el !== document.body);
      const idx = acts.indexOf(detail.section);
      const total = acts.length;

      const fromLabel =
        detail.previousSection.dataset.journeyLabel ?? "Acte précédent";
      const toLabel = detail.section.dataset.journeyLabel ?? "Acte suivant";

      keyRef.current += 1;
      const next: Flash = {
        key: keyRef.current,
        from: fromLabel,
        to: toLabel,
        roman: ROMAN[idx + 1] ?? "",
        number: `${String(idx + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
      };
      setFlash(next);

      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setFlash((current) =>
          current && current.key === next.key ? null : current,
        );
      }, 1200);
    };

    window.addEventListener("journey:act", onAct as EventListener);
    return () => {
      window.removeEventListener("journey:act", onAct as EventListener);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [isMarketingRoute, pathname]);

  if (!isMarketingRoute) return null;
  if (!flash) return null;

  return (
    <div
      aria-hidden="true"
      data-journey-chrome="act-flash"
      className="pointer-events-none fixed inset-0 z-[55] flex items-center justify-center"
      key={flash.key}
      style={{
        animation: "act-flash-fade 1200ms cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      {/* Veil behind the card — not a full blackout, just a hairline-framed plate */}
      <div
        className="relative w-full max-w-[min(720px,80vw)] border-y px-10 py-6 text-[hsl(var(--foreground))] md:px-14 md:py-8"
        style={{
          background: "hsl(var(--background) / 0.82)",
          borderColor: "hsl(var(--accent) / 0.8)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          animation: "act-flash-plate 1200ms cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {/* Hairline accents */}
        <span
          className="absolute -left-8 top-1/2 h-px w-16"
          style={{ background: "hsl(var(--accent))" }}
        />
        <span
          className="absolute -right-8 top-1/2 h-px w-16"
          style={{ background: "hsl(var(--accent))" }}
        />

        <div className="flex flex-col items-center gap-3 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-[hsl(var(--muted-foreground))]">
            {flash.from} <span className="mx-2 opacity-60">→</span> {flash.to}
          </p>
          <p className="flex items-baseline gap-5 font-serif text-3xl leading-none tracking-tight md:text-4xl">
            <span
              className="italic"
              style={{ color: "hsl(var(--accent))" }}
            >
              {flash.roman}
            </span>
            <span className="uppercase tracking-[0.04em]">{flash.to}</span>
          </p>
          <p className="font-mono text-[10px] tabular-nums tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
            {flash.number}
          </p>
        </div>
      </div>
    </div>
  );
}
