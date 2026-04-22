/**
 * Design tokens for AddArt — TypeScript mirror of the CSS variables in `app/globals.css`.
 *
 * Use these when a component needs a color or spacing value in TS (e.g. passing to
 * a canvas, WebGL, or a third-party lib that can't read CSS vars).
 *
 * For styling, prefer Tailwind classes that reference the CSS vars (`bg-background`,
 * `text-accent`, etc.). Only reach for these constants when you need raw values.
 */

/** HSL triplets (as CSS `hsl()` arguments). Mirrors `:root` block in globals.css. */
export const HSL = {
  background: "220 12% 7%",
  foreground: "210 15% 94%",
  card: "220 11% 10%",
  muted: "220 9% 14%",
  mutedForeground: "215 10% 65%",
  accent: "322 88% 58%",
  accentSoft: "328 95% 72%",
  accentDeep: "316 80% 45%",
  border: "220 8% 20%",
  footer: "220 14% 4%",
} as const;

/** Resolved rgba/hex for libraries that don't understand `hsl(var(--...))`. */
export const COLORS = {
  background: "hsl(220 12% 7%)",
  foreground: "hsl(210 15% 94%)",
  card: "hsl(220 11% 10%)",
  muted: "hsl(220 9% 14%)",
  mutedForeground: "hsl(215 10% 65%)",
  accent: "hsl(322 88% 58%)",
  accentSoft: "hsl(328 95% 72%)",
  accentDeep: "hsl(316 80% 45%)",
  border: "hsl(220 8% 20%)",
  footer: "hsl(220 14% 4%)",
} as const;

/** Palette pairs for `ScrollPalette` to morph between. Each key is a "scene". */
export const PALETTES = {
  /** Default: graphite base with platinum text — the site's home palette. */
  graphite: {
    background: COLORS.background,
    foreground: COLORS.foreground,
    accent: COLORS.accent,
  },
  /** Deeper mood: footer-grade dark for dramatic sections. */
  abyss: {
    background: COLORS.footer,
    foreground: COLORS.foreground,
    accent: COLORS.accentSoft,
  },
  /** Accent-washed: subtle magenta tint through the whole scene. */
  ember: {
    background: "hsl(322 30% 10%)",
    foreground: COLORS.foreground,
    accent: COLORS.accentSoft,
  },
} as const;

export type PaletteKey = keyof typeof PALETTES;

/** Breakpoints matching Tailwind defaults — for JS-driven responsive logic. */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/** Z-index scale — keep all floating UI coordinated. */
export const Z = {
  base: 1,
  raised: 10,
  sticky: 20,
  overlay: 40,
  modal: 50,
  toast: 60,
  cursor: 70,
} as const;
