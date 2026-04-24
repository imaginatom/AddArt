"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Odometer — a number that counts up from 0 to a target once it enters the
 * viewport, then stays put. Intended for the manifesto stat ("180+ projets
 * livrés") where the number's arrival is itself part of the reveal.
 *
 * Parses the numeric prefix out of any string value ("180+", "7 ans",
 * "100+") so CMS-editable values Just Work. If the string has no numeric
 * prefix it renders the raw value — graceful fallback.
 *
 * Uses `easeOutExpo` for the count, so the number decelerates sharply
 * near the target instead of linear ticking, which reads more cinematic.
 * One-shot via IntersectionObserver — doesn't re-trigger on re-enter.
 */
export function Odometer({
  value,
  duration = 1400,
  threshold = 0.35,
  className,
  style,
}: {
  value: string;
  duration?: number;
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const match = value.match(/^(\d[\d\s]*)(.*)$/);
  const target = match ? parseInt(match[1].replace(/\s/g, ""), 10) : NaN;
  const suffix = match ? match[2] : value;

  const [current, setCurrent] = useState(Number.isFinite(target) ? 0 : NaN);
  const ref = useRef<HTMLSpanElement | null>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    if (!Number.isFinite(target)) return;
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setCurrent(target);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || playedRef.current) continue;
          playedRef.current = true;
          const start = performance.now();
          let rafId = 0;
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            setCurrent(Math.round(target * eased));
            if (t < 1) rafId = requestAnimationFrame(tick);
          };
          rafId = requestAnimationFrame(tick);
          obs.disconnect();
          return () => cancelAnimationFrame(rafId);
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration, threshold]);

  if (!Number.isFinite(target)) {
    return (
      <span ref={ref} className={className} style={style}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className} style={style}>
      {current}
      {suffix}
    </span>
  );
}
