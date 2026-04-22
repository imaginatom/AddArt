"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * JourneyProvider — the site's master scroll timeline.
 *
 * Instead of each section owning its own isolated animations, the journey
 * provider watches for `[data-journey-palette]` attributes on sections and
 * tweens the site-wide CSS custom properties on <body> as the user enters
 * each section. Every Tailwind class that reads those vars
 * (`bg-background`, `text-foreground`, `border-border`, `bg-card`,
 * `text-muted-foreground`, `bg-accent`) morphs together — producing one
 * continuous document rather than eight isolated screens.
 *
 * The provider is purely observational. It never injects markup, never
 * wraps children. Sections opt in by declaring:
 *
 *   <section data-journey-palette="platinum"> ... </section>
 *
 * Supported palettes:
 *   - graphite  (default dark — the studio's home tone)
 *   - platinum  (off-white editorial moment — manifesto / testimonials)
 *   - ember     (graphite + warm magenta tint — transitional)
 *   - magenta   (full accent wash — contact closer)
 *   - abyss     (deepest dark — footer)
 *
 * Skipped on non-marketing routes (admin, login) and when the user has
 * `prefers-reduced-motion: reduce` enabled — in that case the page keeps
 * its default graphite palette throughout.
 */

type PaletteVars = {
  "--background": string;
  "--foreground": string;
  "--card": string;
  "--card-foreground": string;
  "--muted": string;
  "--muted-foreground": string;
  "--accent": string;
  "--accent-foreground": string;
  "--border": string;
  "--primary": string;
  "--primary-foreground": string;
};

/**
 * HSL triplet palette stops for the journey.
 *
 * Values are raw `H S% L%` strings (no `hsl()` wrapper) so they compose
 * with Tailwind's `hsl(var(--background))` pattern without change.
 */
const PALETTES: Record<string, PaletteVars> = {
  graphite: {
    "--background": "220 12% 7%",
    "--foreground": "210 15% 94%",
    "--card": "220 11% 10%",
    "--card-foreground": "210 15% 94%",
    "--muted": "220 9% 14%",
    "--muted-foreground": "215 10% 65%",
    "--accent": "322 88% 58%",
    "--accent-foreground": "0 0% 100%",
    "--border": "220 8% 20%",
    "--primary": "210 14% 90%",
    "--primary-foreground": "220 15% 8%",
  },
  platinum: {
    "--background": "42 28% 94%",
    "--foreground": "220 22% 10%",
    "--card": "40 24% 88%",
    "--card-foreground": "220 22% 10%",
    "--muted": "40 20% 82%",
    "--muted-foreground": "220 14% 32%",
    "--accent": "322 88% 48%",
    "--accent-foreground": "42 28% 98%",
    "--border": "40 18% 72%",
    "--primary": "220 22% 10%",
    "--primary-foreground": "42 28% 98%",
  },
  ember: {
    "--background": "322 30% 9%",
    "--foreground": "42 28% 96%",
    "--card": "322 24% 13%",
    "--card-foreground": "42 28% 96%",
    "--muted": "322 22% 17%",
    "--muted-foreground": "322 14% 70%",
    "--accent": "328 95% 72%",
    "--accent-foreground": "322 30% 9%",
    "--border": "322 18% 24%",
    "--primary": "42 28% 96%",
    "--primary-foreground": "322 30% 9%",
  },
  magenta: {
    "--background": "322 88% 54%",
    "--foreground": "42 28% 98%",
    "--card": "316 80% 42%",
    "--card-foreground": "42 28% 98%",
    "--muted": "322 46% 32%",
    "--muted-foreground": "322 20% 88%",
    "--accent": "42 28% 98%",
    "--accent-foreground": "322 88% 34%",
    "--border": "322 40% 42%",
    "--primary": "42 28% 98%",
    "--primary-foreground": "322 88% 34%",
  },
  abyss: {
    "--background": "220 14% 4%",
    "--foreground": "210 15% 88%",
    "--card": "220 12% 6%",
    "--card-foreground": "210 15% 88%",
    "--muted": "220 10% 10%",
    "--muted-foreground": "215 8% 56%",
    "--accent": "322 88% 58%",
    "--accent-foreground": "0 0% 100%",
    "--border": "220 8% 14%",
    "--primary": "210 14% 88%",
    "--primary-foreground": "220 14% 4%",
  },
};

type PaletteKey = keyof typeof PALETTES;

const DEFAULT_PALETTE: PaletteKey = "graphite";

/**
 * Applies a palette's vars to an element. Relies on the sibling CSS
 * (`body.journey-mode *` transition) to animate the resolved colors.
 */
function applyPalette(el: HTMLElement, palette: PaletteVars) {
  for (const [key, value] of Object.entries(palette)) {
    el.style.setProperty(key, value);
  }
}

export function JourneyProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const isMarketingRoute =
    !pathname.startsWith("/admin") && !pathname.startsWith("/login");

  useEffect(() => {
    if (!isMarketingRoute) return;
    if (typeof window === "undefined") return;

    const body = document.body;
    body.classList.add("journey-mode");
    applyPalette(body, PALETTES[DEFAULT_PALETTE]);
    body.dataset.journeyPalette = DEFAULT_PALETTE;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      return () => {
        body.classList.remove("journey-mode");
        delete body.dataset.journeyPalette;
      };
    }

    const triggers: ScrollTrigger[] = [];
    let currentPalette: PaletteKey = DEFAULT_PALETTE;
    let refreshId = 0;

    const setPaletteIfDifferent = (next: PaletteKey) => {
      if (next === currentPalette) return;
      const palette = PALETTES[next] ?? PALETTES[DEFAULT_PALETTE];
      applyPalette(body, palette);
      currentPalette = next;
      body.dataset.journeyPalette = next;
    };

    // Collect sections after one frame so client-only content has mounted.
    const raf = requestAnimationFrame(() => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-journey-palette]"),
      );

      sections.forEach((section) => {
        const paletteKey =
          (section.dataset.journeyPalette as PaletteKey) ?? DEFAULT_PALETTE;
        if (!(paletteKey in PALETTES)) return;

        // A section "owns" the palette from when its top crosses 55% of the
        // viewport down to when its bottom crosses the same line. Using the
        // same line for enter/exit gives stable single-section ownership
        // instead of brief blend zones that can flicker.
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => setPaletteIfDifferent(paletteKey),
          onEnterBack: () => setPaletteIfDifferent(paletteKey),
        });
        triggers.push(trigger);
      });

      // Refresh once after fonts/images settle so start/end points are
      // computed against the final layout.
      refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(refreshId);
      triggers.forEach((t) => t.kill());
      body.classList.remove("journey-mode");
      delete body.dataset.journeyPalette;
    };
  }, [isMarketingRoute, pathname]);

  return <>{children}</>;
}
