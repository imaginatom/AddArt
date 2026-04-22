"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { ArrowDownRight, ChevronDown } from "lucide-react"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"
import { SplitReveal } from "@/design-system/animations/split-reveal"

type HeroContent = HomePageContent["hero"]

/**
 * Hero editorial redesign.
 *
 * The giant serif H1 is the section's entire visual center. Everything
 * else is scaled down from it — a thin eyebrow, a condensed subtitle, a
 * single primary CTA with a secondary inline link, and a looping capability
 * tag marquee running edge-to-edge at the bottom. A subtle parallax pulls
 * the background image up at ~0.25× scroll speed, so the section feels
 * deeper than it is.
 *
 * This is Act 01 · Arrival in the journey. The palette stays graphite;
 * the scroll progress hairline and custom cursor ride along on top.
 */

const HERO_TAGS = [
  "Character Design",
  "Key Art",
  "Motion",
  "Cartoon",
  "Storyboards",
  "Illustration éditoriale",
  "Identité visuelle",
  "Direction artistique",
  "Game Covers",
  "Graphisme publicitaire",
]

export function HeroSection({ content = homePageDefaults.hero }: { content?: HeroContent }) {
  const bgWrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const el = bgWrapRef.current
    if (!el) return

    let rafId = 0
    let pending = false

    const update = () => {
      const y = window.scrollY
      // Parallax: background drifts up at ~0.25× scroll speed within the
      // hero viewport. Above the hero (y=0) no transform is applied.
      el.style.transform = `translate3d(0, ${y * 0.25}px, 0)`
      pending = false
    }

    const onScroll = () => {
      if (pending) return
      pending = true
      rafId = requestAnimationFrame(update)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <section
      data-journey-palette="graphite"
      className="relative flex min-h-screen flex-col overflow-hidden bg-[hsl(220_14%_4%)]"
    >
      {/* Background image + gradient, wrapped for parallax transform */}
      <div
        ref={bgWrapRef}
        className="absolute inset-0 will-change-transform"
        aria-hidden="true"
        data-journey-opt-out
      >
        <Image
          src={content.backgroundImage.src}
          alt=""
          fill
          priority
          className="object-cover opacity-70"
          sizes="100vw"
        />
        {/* Editorial gradient: deep at the bottom (where text lives) so
            display type sits on near-black, lifting to ~45% opacity at the
            top so the artwork still reads. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(220 14% 4% / 0.55) 0%, hsl(220 14% 4% / 0.78) 40%, hsl(220 14% 4% / 0.94) 100%)",
          }}
        />
        {/* Subtle magenta wash from the right edge for warmth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 80% at 88% 20%, hsl(322 88% 58% / 0.18) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Content column */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-24 pt-40 md:pb-28 lg:px-8 lg:pt-44">
        {/* 01 eyebrow */}
        <div
          className="animate-on-scroll is-visible flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[hsl(42_28%_96%)]/70"
          style={{ animationDelay: "1900ms" }}
        >
          <span className="h-px w-10 bg-[hsl(322_88%_58%)]" />
          {content.badgeText}
        </div>

        {/* Giant display H1 — the section's whole reason for being. Masked
            reveal plays line by line; matches the PageIntro wordmark
            position so the transition feels like one continuous word. */}
        <SplitReveal
          as="h1"
          split="lines"
          direction="mask"
          immediate
          delay={0.2}
          className="mt-6 font-serif font-bold leading-[0.95] tracking-tight text-[hsl(42_28%_96%)] text-balance"
          style={{ fontSize: "clamp(44px, 9.2vw, 156px)" }}
        >
          {content.title}
        </SplitReveal>

        {/* Condensed subtitle — short, sets the pitch */}
        <SplitReveal
          as="p"
          split="lines"
          direction="up"
          immediate
          delay={1.1}
          className="mt-8 max-w-xl text-base leading-relaxed text-[hsl(42_28%_96%)]/75 md:text-lg"
        >
          {content.subtitle}
        </SplitReveal>

        {/* CTA row — one strong button, one quiet text link */}
        <div
          className="animate-on-scroll is-visible mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          style={{ animationDelay: "2400ms" }}
        >
          <Link
            href="/contact"
            className="group/cta inline-flex items-center gap-3 rounded-full bg-[hsl(322_88%_58%)] px-7 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-[0_10px_40px_-10px_hsl(322_88%_58%/0.7)] transition-transform duration-300 hover:scale-[1.02]"
            aria-label={content.primaryCtaLabel}
          >
            {content.primaryCtaLabel}
            <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:translate-y-0.5" />
          </Link>
          <Link
            href="/realisations"
            className="group/link inline-flex items-center gap-2 text-sm font-medium text-[hsl(42_28%_96%)]/80 transition-colors hover:text-[hsl(42_28%_96%)]"
          >
            <span className="relative">
              {content.secondaryCtaLabel}
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[hsl(322_88%_58%)] transition-transform duration-300 group-hover/link:scale-x-100" />
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Capability tag marquee — runs edge-to-edge at the bottom of the
          hero. Uses CSS keyframes from globals.css for a cheap, GPU-only
          infinite loop. Two copies of the list in the track so the
          -50% translate wraps seamlessly. */}
      <div
        className="relative z-10 overflow-hidden border-t border-[hsl(42_28%_96%)]/10 py-6"
        aria-hidden="true"
        data-journey-opt-out
      >
        <div
          className="flex w-max items-center gap-12 whitespace-nowrap will-change-transform"
          style={{ animation: "text-marquee-ltr 42s linear infinite" }}
        >
          {[...HERO_TAGS, ...HERO_TAGS].map((tag, idx) => (
            <span
              key={`${tag}-${idx}`}
              className="flex items-center gap-12 text-sm font-medium uppercase tracking-[0.22em] text-[hsl(42_28%_96%)]/50"
            >
              {tag}
              <span className="h-1 w-1 rounded-full bg-[hsl(322_88%_58%)]/80" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="animate-on-scroll is-visible absolute bottom-20 right-6 z-10 flex flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-[hsl(42_28%_96%)]/60 md:bottom-24 md:right-10"
        style={{ animationDelay: "2700ms" }}
        aria-hidden="true"
      >
        <span>Scroll</span>
        <span className="h-12 w-px bg-gradient-to-b from-[hsl(42_28%_96%)]/60 to-transparent">
          <span className="block h-3 w-px animate-[page-intro-word_1.4s_cubic-bezier(0.22,1,0.36,1)_infinite] bg-[hsl(322_88%_58%)]" />
        </span>
        <ChevronDown className="h-3 w-3 text-[hsl(42_28%_96%)]/60" />
      </div>
    </section>
  )
}
