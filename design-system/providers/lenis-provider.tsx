"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Lenis smooth-scroll provider.
 *
 * Activates on marketing routes only. Admin routes (`/admin/**`) and any route
 * where the user prefers reduced motion get a pure pass-through — native browser
 * scroll, no hijacking. This keeps form interactions, Supabase auth flows, and
 * focus management predictable in admin.
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

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Expose globally so GSAP ScrollTrigger integrations can read the instance.
    // Use a well-namespaced key to avoid collisions.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [disabled, pathname]);

  return <>{children}</>;
}
