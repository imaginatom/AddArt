"use client";

/**
 * <AsymmetricMarquee> — horizontal auto-scrolling carousel with non-uniform cards,
 * hover-pause, and a data-reveal overlay.
 *
 * Inspired by sonder.design's case-study reel (Splide + autoscroll) crossed with
 * hellomonday's masonry aspect-ratio mix. Cards rotate between three size presets
 * (tall, wide, square), stagger vertically for editorial feel, and pause when the
 * cursor enters with an overlay showing title + subtitle.
 *
 * Use this for
 * ────────────
 *  - Portfolio preview strips (gallery teaser on home)
 *  - Client logo walls that want personality
 *  - "Nos réalisations" reels on sub-pages
 *
 * Props
 * ─────
 *  items: MarqueeItem[] — image, alt, title, optional subtitle, optional href
 *  speed: number        — pixels per second; default 40 (slow magazine reel)
 *  pauseOnHover: boolean — default true
 *  className: string    — wrapper classes
 *
 * Accessibility
 * ─────────────
 *  - `prefers-reduced-motion` → animation halts, items flow in a static grid.
 *  - Each card is a keyboard-focusable link (when href provided); focus pauses motion.
 *  - The duplicated set for seamless loop is marked aria-hidden to avoid reader duplication.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { CSS_EASE_EDITORIAL } from "../easings";

export type MarqueeItem = {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  href?: string;
};

type MarqueeProps = {
  items: MarqueeItem[];
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
};

const ASPECTS = ["tall", "wide", "square"] as const;
type Aspect = (typeof ASPECTS)[number];

const aspectClass: Record<Aspect, string> = {
  tall: "aspect-[3/4] w-[260px] md:w-[320px]",
  wide: "aspect-[4/3] w-[320px] md:w-[400px]",
  square: "aspect-square w-[280px] md:w-[340px]",
};

const offsetClass: Record<number, string> = {
  0: "mt-0",
  1: "mt-10 md:mt-16",
  2: "mt-4 md:mt-6",
  3: "mt-14 md:mt-24",
  4: "mt-2",
};

export function AsymmetricMarquee({
  items,
  speed = 40,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion || items.length === 0) return;

    // Measure half the track (we render two copies for seamless loop).
    const halfWidth = track.scrollWidth / 2;
    const durationSec = halfWidth / speed;

    gsap.set(track, { x: 0 });
    tweenRef.current = gsap.to(track, {
      x: -halfWidth,
      duration: durationSec,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [items, speed, reducedMotion]);

  const handleEnter = () => {
    if (pauseOnHover) tweenRef.current?.pause();
  };
  const handleLeave = () => {
    if (pauseOnHover) tweenRef.current?.resume();
  };

  if (items.length === 0) return null;

  // Duplicate the items for seamless loop.
  const displayItems = [...items, ...items];

  return (
    <div
      className={`group/marquee relative overflow-hidden ${className ?? ""}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocusCapture={handleEnter}
      onBlurCapture={handleLeave}
    >
      {/* Edge fades so cards emerge from and dissolve into the background. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 md:w-40"
        style={{
          background:
            "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 md:w-40"
        style={{
          background:
            "linear-gradient(to left, hsl(var(--background)) 0%, hsl(var(--background) / 0) 100%)",
        }}
      />

      <div
        ref={trackRef}
        className="flex items-start gap-5 py-12 will-change-transform md:gap-8 md:py-16"
        style={{
          transition: reducedMotion ? "none" : undefined,
        }}
      >
        {displayItems.map((item, idx) => {
          const aspect = ASPECTS[idx % ASPECTS.length];
          const offset = offsetClass[idx % 5] ?? "mt-0";
          const isClone = idx >= items.length;

          const Card = (
            <article
              className={`group/card relative shrink-0 overflow-hidden rounded-2xl bg-card ${aspectClass[aspect]} ${offset}`}
            >
              <Image
                src={item.src}
                alt={isClone ? "" : item.alt}
                fill
                sizes="(max-width: 768px) 60vw, 340px"
                className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.04]"
              />

              {/* Data-reveal overlay. Visible on card hover + always on keyboard focus. */}
              <div
                className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 group-focus-within/card:opacity-100"
                style={{ transitionTimingFunction: CSS_EASE_EDITORIAL }}
              >
                <p className="font-serif text-lg font-semibold leading-tight text-background md:text-xl">
                  {item.title}
                </p>
                {item.subtitle ? (
                  <p className="mt-1 text-xs font-medium uppercase tracking-widest text-background/80">
                    {item.subtitle}
                  </p>
                ) : null}
              </div>
            </article>
          );

          const key = `${item.src}-${idx}`;

          if (item.href && !isClone) {
            return (
              <Link
                key={key}
                href={item.href}
                className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
                aria-label={item.title}
              >
                {Card}
              </Link>
            );
          }

          return (
            <div key={key} aria-hidden={isClone || undefined} className="shrink-0">
              {Card}
            </div>
          );
        })}
      </div>
    </div>
  );
}
