"use client";

/**
 * <SplitReveal> — directional text reveal built on split-type + GSAP ScrollTrigger.
 *
 * Inspired by sonder.design's mid-sentence line reveals and hellomonday's editorial
 * heading entrances. This is the canonical primitive for "text should feel authored
 * as it enters the viewport."
 *
 * Variants
 * ────────
 *  - direction="up"    → lines slide up into place (default, editorial)
 *  - direction="down"  → lines slide down
 *  - direction="left"  → words slide in from the left (good for kicker/eyebrow)
 *  - direction="right" → words slide in from the right
 *  - direction="mask"  → clip-path mask wipes from bottom to top (signature feel)
 *
 * Granularity
 * ───────────
 *  - split="lines" (default): best for multi-line headlines, respects line wrapping
 *  - split="words": looser, good for short phrases
 *  - split="chars": character-by-character, reserve for very short display words (≤ 20 chars)
 *
 * Accessibility
 * ─────────────
 * prefers-reduced-motion → text renders in final state immediately, zero motion.
 * Semantic element is preserved via the `as` prop (h1/h2/p/span/etc.).
 *
 * Example
 * ───────
 *  <SplitReveal as="h1" split="lines" direction="mask">
 *    Become unignorable.
 *  </SplitReveal>
 */

import { useEffect, useRef, type ElementType, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { DURATIONS, STAGGER, EASE_EDITORIAL, EASE_OUT_EXPO } from "../easings";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Direction = "up" | "down" | "left" | "right" | "mask";
type Split = "lines" | "words" | "chars";

type SplitRevealProps = {
  children: ReactNode;
  as?: ElementType;
  split?: Split;
  direction?: Direction;
  /** Delay before the animation starts, in seconds. Default 0. */
  delay?: number;
  /** Stagger between units, in seconds. Uses `STAGGER[split]` if not provided. */
  stagger?: number;
  /** Total duration per unit, in seconds. Defaults to `DURATIONS.slow` (0.6s). */
  duration?: number;
  /** Start position for ScrollTrigger. Default: "top 85%". */
  start?: string;
  /** Disable ScrollTrigger and play on mount immediately (for above-the-fold). */
  immediate?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function SplitReveal({
  children,
  as: Tag = "span",
  split = "lines",
  direction = "up",
  delay = 0,
  stagger,
  duration = DURATIONS.slow,
  start = "top 85%",
  immediate = false,
  className,
  style,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion: bail out, content is already rendered.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      return;
    }

    // Split. types is a comma-separated string: we always compute lines so
    // clip-path/mask variants have line boxes to work with.
    const types =
      split === "chars"
        ? "lines,words,chars"
        : split === "words"
        ? "lines,words"
        : "lines";

    const instance = new SplitType(el, { types: types as "lines,words,chars" });

    const targets =
      split === "chars"
        ? instance.chars ?? []
        : split === "words"
        ? instance.words ?? []
        : instance.lines ?? [];

    if (targets.length === 0) return;

    // For mask variant we wrap each line in an overflow-hidden container via CSS.
    // split-type already wraps lines in a .line container with overflow options;
    // we add inline overflow-hidden to the parent line, and translate the inner.
    const isMask = direction === "mask";

    if (isMask) {
      instance.lines?.forEach((line) => {
        line.style.overflow = "hidden";
        line.style.display = "block";
      });
    }

    const fromVars: gsap.TweenVars = { opacity: 0 };
    const toVars: gsap.TweenVars = { opacity: 1 };

    switch (direction) {
      case "up":
        fromVars.yPercent = 100;
        toVars.yPercent = 0;
        break;
      case "down":
        fromVars.yPercent = -100;
        toVars.yPercent = 0;
        break;
      case "left":
        fromVars.xPercent = -40;
        toVars.xPercent = 0;
        break;
      case "right":
        fromVars.xPercent = 40;
        toVars.xPercent = 0;
        break;
      case "mask":
        fromVars.yPercent = 110;
        toVars.yPercent = 0;
        break;
    }

    const animTargets = isMask ? (instance.lines ?? []).flatMap((l) => [l.firstElementChild ?? l]) : targets;

    const tween = gsap.fromTo(animTargets, fromVars, {
      ...toVars,
      duration,
      delay,
      ease: direction === "mask" ? EASE_OUT_EXPO : EASE_EDITORIAL,
      stagger: stagger ?? STAGGER[split],
      scrollTrigger: immediate
        ? undefined
        : {
            trigger: el,
            start,
            once: true,
          },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      instance.revert();
    };
    // children is intentionally a dependency — if text changes, re-split.
  }, [children, split, direction, delay, duration, stagger, start, immediate]);

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{ opacity: 0, ...style }}
      data-split-reveal=""
    >
      {children}
    </Tag>
  );
}
