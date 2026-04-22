"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Lenis smooth-scroll provider.
 *
 * Activates on marketing routes only. Admin routes (`/admin/**`) and any route
 * where the user prefers reduced motion get a pure pass-through — native browser
 * scroll, no hijacking. This keeps form interactions, Supabase auth flows, and
 * focus management predictable in admin.
 *
 * GSAP + Lenis integration: Lenis's scroll event is piped into
 * ScrollTrigger.update, and Lenis's RAF is driven by GSAP's ticker. This
 * guarantees that pinned sections and scrub tweens stay perfectly synced with
 * the smooth scroll — no jitter on pins, no drift on scrub.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const disabled =
    pathname?.startsWith("/admin") ||
    (typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (disabled) return;

    const lenis = new Lenis({
      duration: 1.1,
      // Editorial easing — matches our design-system/easings.ts curve.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices keep native scroll — Lenis on touch feels laggy.
      syncTouch: false,
    });

    // Keep ScrollTrigger in lockstep with Lenis: every smooth-scroll tick
    // triggers a ScrollTrigger.update so pins and scrubs never lag behind.
    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    // Drive Lenis off GSAP's ticker instead of a separate RAF. Ensures both
    // libraries share one frame budget and fire in the right order.
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Expose globally so anything else can read/poke the instance.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [disabled, pathname]);

  return <>{children}</>;
}
