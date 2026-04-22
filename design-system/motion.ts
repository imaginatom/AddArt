/**
 * Shared Framer Motion variants for AddArt.
 *
 * Rule: always reach for one of these variants before writing inline `animate={}`.
 * Variants are the single mechanism that enforces aesthetic cohesion across the site.
 */

import type { Variants, Transition } from "motion/react";
import { CSS_EASE_EDITORIAL, CSS_EASE_OUT_EXPO, DURATIONS } from "./easings";

const easeEditorial = [0.22, 1, 0.36, 1] as const;
const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const TRANSITIONS = {
  base: { duration: DURATIONS.base, ease: easeEditorial } satisfies Transition,
  slow: { duration: DURATIONS.slow, ease: easeEditorial } satisfies Transition,
  epic: { duration: DURATIONS.epic, ease: easeOutExpo } satisfies Transition,
} as const;

/** Fade-up with a gentle 18px translate. Good default for non-signature reveals. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: TRANSITIONS.slow },
};

/** Mask-wipe: content enters from below a clipped mask. Signature-feel reveal. */
export const maskWipe: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)", y: 30, opacity: 0 },
  visible: {
    clipPath: "inset(0% 0 0 0)",
    y: 0,
    opacity: 1,
    transition: TRANSITIONS.epic,
  },
};

/** Staggered children container — pair with one of the child variants above. */
export const staggerParent = (staggerChildren = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren: 0.05,
    },
  },
});

/** Card hover: subtle lift + shadow. */
export const cardHover: Variants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.015,
    transition: { duration: DURATIONS.base, ease: easeOutExpo },
  },
};

/** Exposed CSS strings for places that can't use the objects above. */
export { CSS_EASE_EDITORIAL, CSS_EASE_OUT_EXPO };
