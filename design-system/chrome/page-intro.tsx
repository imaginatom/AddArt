"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * PageIntro — the cinematic door-opener.
 *
 * On first paint we cover the viewport with a dark panel and mask-reveal
 * the word "ADDART" at display scale. After a short hold the whole panel
 * slides up and out, uncovering the hero that lives below. The intro's
 * wordmark position matches where the hero H1 appears on screen, so the
 * transition reads as "the intro word becomes the hero" rather than a
 * separate splash screen.
 *
 * Sequence (total ~1900ms):
 *   0ms ─ 700ms   wordmark mask-reveal (words lift into view)
 *   700ms ─ 1100ms  hold
 *   1100ms ─ 1900ms panel slides up, hero revealed
 *   1900ms          component unmounts, page is fully interactive
 *
 * Runs only on the home route. Respects `prefers-reduced-motion` by
 * skipping the overlay entirely.
 */
export function PageIntro() {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!isHome) {
      setMounted(false);
      return;
    }
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMounted(false);
      return;
    }

    document.documentElement.style.overflow = "hidden";

    const unmountTimer = window.setTimeout(() => setMounted(false), 1900);
    const unlockTimer = window.setTimeout(() => {
      document.documentElement.style.overflow = "";
    }, 1700);

    return () => {
      window.clearTimeout(unmountTimer);
      window.clearTimeout(unlockTimer);
      document.documentElement.style.overflow = "";
    };
  }, [isHome]);

  if (!isHome || !mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] flex items-end overflow-hidden"
      style={{
        background: "hsl(220 14% 4%)",
        animation:
          "page-intro-slide 1900ms cubic-bezier(0.76, 0, 0.24, 1) forwards",
      }}
      data-journey-opt-out
    >
      <div className="mx-auto w-full max-w-7xl px-4 pb-24 md:pb-32 lg:px-8">
        <div
          className="overflow-hidden"
          style={{ lineHeight: 0.9 }}
        >
          <span
            className="inline-block font-serif font-bold tracking-tight text-[hsl(42_28%_96%)]"
            style={{
              fontSize: "clamp(64px, 14vw, 220px)",
              animation:
                "page-intro-word 900ms cubic-bezier(0.22, 1, 0.36, 1) 120ms both",
            }}
          >
            ADDART.
          </span>
        </div>
        <div
          className="mt-6 h-[2px] origin-left bg-[hsl(322_88%_58%)]"
          style={{
            transform: "scaleX(0)",
            animation:
              "page-intro-hairline 700ms cubic-bezier(0.22, 1, 0.36, 1) 700ms forwards",
          }}
        />
      </div>
    </div>
  );
}
