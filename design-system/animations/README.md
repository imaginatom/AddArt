# design-system/animations

Canonical animation primitives for AddArt. When Cursor or a human asks for a "new scroll effect" or "animation," **read this file first** and pick the closest primitive.

## Primitives

| Name | File | Use for | Notes |
|---|---|---|---|
| `SplitReveal` | `split-reveal.tsx` | Headings, callouts, editorial copy reveals on scroll | Built on split-type + GSAP ScrollTrigger. Variants: `up`, `down`, `left`, `right`, `mask`. Respects `prefers-reduced-motion`. |
| `AsymmetricMarquee` | `asymmetric-marquee.tsx` | Portfolio preview reels, logo walls, "nos réalisations" teasers | Horizontal auto-scroll, non-uniform card sizes, hover-pause with data overlay. Cards duplicated for seamless loop. |

## Adding a new primitive

Before inlining GSAP or Motion code in a page/section component, check this list. If nothing fits, add a new file here following the same conventions:

1. `"use client"` at the top.
2. A doc-comment block explaining **inspired by**, **use for**, **variants**, **accessibility**.
3. `prefers-reduced-motion` fallback that shows content in its final state.
4. Cleanup in the `useEffect` return (kill ScrollTrigger, revert SplitType, etc.).
5. Pull easings from `../easings.ts`, tokens from `../tokens.ts`. No inline bezier strings or hex colors.
6. Update this README and `.cursor/rules/10-animation-dna.mdc` with the new entry.

## Where each primitive is currently used

- `SplitReveal` → `components/home/hero-section.tsx` (H1 mask reveal)
- `AsymmetricMarquee` → `components/home/gallery-preview.tsx` (portfolio teaser)

Keep this list updated as primitives spread.
