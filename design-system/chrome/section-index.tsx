"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * SectionIndex — the journey's sidecar.
 *
 * A minimal typographic readout fixed to the right edge of the viewport
 * that shows the current act number and total (e.g. `03 / 07`), plus a
 * micro-label pulled from the active section's `data-journey-label`
 * attribute. Sections opt in simply by declaring:
 *
 *   <section data-journey-palette="..." data-journey-label="Arrival">
 *
 * Acts without a label still contribute to the count. This component
 * avoids ScrollTrigger — it polls on scroll via rAF, consistent with
 * how the JourneyProvider detects palettes, so it stays accurate even
 * when pinned sections resize the document mid-session.
 *
 * Hidden on admin / login and on very small viewports to avoid
 * competing with mobile controls.
 */
export function SectionIndex() {
  const pathname = usePathname() ?? "/";
  const isMarketingRoute =
    !pathname.startsWith("/admin") && !pathname.startsWith("/login");

  const [active, setActive] = useState<{
    idx: number;
    total: number;
    label: string;
  }>({ idx: 0, total: 0, label: "" });

  const pendingRef = useRef(false);

  useEffect(() => {
    if (!isMarketingRoute) return;
    if (typeof window === "undefined") return;

    let raf = 0;

    const update = () => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-journey-palette]"),
      ).filter((el) => el !== document.body);
      const total = sections.length;
      if (total === 0) {
        setActive({ idx: 0, total: 0, label: "" });
        pendingRef.current = false;
        return;
      }
      const line = window.innerHeight * 0.5;
      let hit: HTMLElement | null = null;
      let nearest: HTMLElement | null = null;
      let nearestDistance = Infinity;
      sections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
        if (rect.top <= line && rect.bottom > line) {
          if (!hit) hit = el;
        }
        const center = (rect.top + rect.bottom) / 2;
        const distance = Math.abs(center - line);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = el;
        }
      });
      const activeEl = hit ?? nearest;
      if (!activeEl) {
        pendingRef.current = false;
        return;
      }
      const idx = sections.indexOf(activeEl);
      const label = (activeEl as HTMLElement).dataset.journeyLabel ?? "";
      setActive({ idx: idx + 1, total, label });
      pendingRef.current = false;
    };

    const onScroll = () => {
      if (pendingRef.current) return;
      pendingRef.current = true;
      raf = requestAnimationFrame(update);
    };

    const init = requestAnimationFrame(() => {
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    });

    return () => {
      cancelAnimationFrame(init);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isMarketingRoute, pathname]);

  if (!isMarketingRoute) return null;
  if (active.total === 0) return null;

  const number = `${String(active.idx).padStart(2, "0")} / ${String(active.total).padStart(2, "0")}`;

  return (
    <div
      aria-hidden="true"
      data-journey-chrome="section-index"
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 select-none md:block lg:right-8"
    >
      <div className="flex items-center gap-3 text-[hsl(var(--foreground)/0.7)] transition-colors duration-700">
        {active.label ? (
          <span
            className="origin-center -rotate-90 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ transform: "rotate(-90deg)" }}
          >
            {active.label}
          </span>
        ) : null}
        <span className="font-mono text-[11px] tabular-nums tracking-[0.15em]">
          {number}
        </span>
      </div>
    </div>
  );
}
