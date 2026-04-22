"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollProgress — a 2px magenta hairline fixed to the top edge of the
 * viewport, scaling horizontally from 0 to 1 as the user scrolls the
 * document.
 *
 * This is the site's recurring magenta motif. It matches:
 *   - the contact-button wipe hairline (vertical hover line)
 *   - the section divider hairlines
 *   - the custom-cursor trail on CTAs
 *
 * Implementation notes:
 *   - Uses `transform: scaleX(p)` rather than `width: p%` — cheaper, GPU
 *     composited, no layout thrash.
 *   - Listens on `scroll` with `{ passive: true }` so Lenis smooth-scroll
 *     remains buttery.
 *   - Hidden on admin / login routes where chrome would distract.
 *   - Respects `prefers-reduced-motion` by still updating (it's a readout,
 *     not an animation) but without the soft fade-in.
 */
export function ScrollProgress() {
  const pathname = usePathname() ?? "/";
  const isMarketingRoute =
    !pathname.startsWith("/admin") && !pathname.startsWith("/login");
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMarketingRoute) return;
    if (typeof window === "undefined") return;

    const bar = barRef.current;
    if (!bar) return;

    let rafId = 0;
    let pending = false;

    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const clamped = Math.max(0, Math.min(1, progress));
      bar.style.transform = `scaleX(${clamped})`;
      pending = false;
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isMarketingRoute, pathname]);

  if (!isMarketingRoute) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
      style={{
        transform: "scaleX(0)",
        background:
          "linear-gradient(to right, hsl(var(--accent) / 0.4) 0%, hsl(var(--accent)) 60%, hsl(var(--accent) / 0.9) 100%)",
        transition: "transform 80ms linear",
      }}
      ref={barRef}
      data-journey-chrome="scroll-progress"
    />
  );
}
