/**
 * Named easing curves and durations for AddArt.
 *
 * Rule: never write a raw bezier string inline. Always import from here.
 * Durations follow a 1-2-3-4 scale: fast (150ms) → base (300ms) → slow (600ms) → epic (1200ms).
 *
 * Use the GSAP-format strings when calling `gsap.to({ ease: EASE_OUT_EXPO })`.
 * Use the CSS-format strings in `transition-timing-function` or the Tailwind `ease-*` classes.
 */

// ── GSAP-format (function name or cubic-bezier array string) ──

export const EASE_OUT_EXPO = "expo.out";
export const EASE_IN_OUT_EXPO = "expo.inOut";
export const EASE_OUT_QUART = "power4.out";
export const EASE_OUT_CUBIC = "power2.out";

/** Editorial: slightly over-damped, feels authored, good for line reveals. */
export const EASE_EDITORIAL = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Soft spring, good for hover and micro-interactions. */
export const SPRING_SOFT = "back.out(1.4)";

/** Stronger spring, good for CTA and "snap" feelings. */
export const SPRING_SNAPPY = "back.out(2.2)";

// ── CSS-format bezier strings (for use in `style={{ transition: ... }}` or Tailwind arbitrary ease) ──

export const CSS_EASE_OUT_EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";
export const CSS_EASE_EDITORIAL = "cubic-bezier(0.22, 1, 0.36, 1)";
export const CSS_EASE_OUT_QUART = "cubic-bezier(0.165, 0.84, 0.44, 1)";

// ── Durations (single source of truth) ──

export const DURATIONS = {
  /** Instant feedback: tooltip open, toggle flip. */
  fast: 0.15,
  /** Most UI transitions: hover, button press, card lift. */
  base: 0.3,
  /** Scene-level reveals: headline arriving, card entering view. */
  slow: 0.6,
  /** Signature moments: hero intro, palette morph. */
  epic: 1.2,
} as const;

/** Stagger presets in seconds — use as `{ stagger: STAGGER.lines }` in GSAP. */
export const STAGGER = {
  chars: 0.02,
  words: 0.05,
  lines: 0.08,
  cards: 0.12,
} as const;

export type DurationKey = keyof typeof DURATIONS;
