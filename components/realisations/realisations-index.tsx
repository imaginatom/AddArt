"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { JourneyBridge } from "@/design-system/chrome/journey-bridge";
import type { PortfolioPageContent } from "@/lib/content/portfolio";

type Project = PortfolioPageContent["gallery"]["projects"][number];

/**
 * Portfolio · Act II — Index.
 *
 * The gallery itself. Replaces the pill-tab + rounded-masonry pattern with
 * an editorial index:
 *
 *   · A hairline-underlined filter row where each discipline reads as a
 *     typographic label followed by its count ("Cartoons · 04"). Active
 *     filter gets the magenta underline + accent text. No rounded pills.
 *
 *   · A 12-column asymmetric grid that loops through a 6-tile rhythm
 *     (tall / wide / square / wide / portrait / square). No rounded
 *     corners; each tile is a framed rectangle with:
 *       - a serif numeral overlay ("N° 03")
 *       - a category mono eyebrow
 *       - title + location revealed on hover
 *       - a magenta hairline that grows from left to right on hover
 *
 *   · The lightbox is preserved (same keyboard nav, same focus trap)
 *     but reskinned to match the editorial language — no rounded corners
 *     on the image frame, mono metadata, magenta hairline accents.
 *
 * Pure client component; no scroll math beyond hover / focus states.
 */
export type RealisationsIndexProps = {
  content: PortfolioPageContent;
};

type GridTile = {
  colSpan: number;
  aspect: string;
};

/**
 * Rhythm for the asymmetric grid — 6 tiles per cycle, col spans sum to
 * 12 per row. Keeps the page from looking like a CSS grid demo while
 * staying predictable enough that missing images don't warp the page.
 */
const GRID_RHYTHM: GridTile[] = [
  { colSpan: 7, aspect: "4/5" }, // row 1: portrait hero
  { colSpan: 5, aspect: "4/3" }, // row 1: landscape companion
  { colSpan: 4, aspect: "1/1" }, // row 2: square
  { colSpan: 8, aspect: "16/9" }, // row 2: wide
  { colSpan: 6, aspect: "5/4" }, // row 3
  { colSpan: 6, aspect: "5/4" }, // row 3
];

export function RealisationsIndex({ content }: RealisationsIndexProps) {
  const { gallery } = content;
  const allLabel = gallery.categories[0] ?? "Tous";
  const [activeCategory, setActiveCategory] = useState<string>(allLabel);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    map.set(allLabel, gallery.projects.length);
    for (const project of gallery.projects) {
      map.set(project.category, (map.get(project.category) ?? 0) + 1);
    }
    return map;
  }, [gallery.projects, allLabel]);

  const filtered = useMemo(() => {
    if (activeCategory === allLabel) return gallery.projects;
    return gallery.projects.filter(
      (project) => project.category === activeCategory,
    );
  }, [activeCategory, gallery.projects, allLabel]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const goTo = useCallback(
    (direction: "prev" | "next") => {
      if (lightboxIndex === null) return;
      if (direction === "prev") {
        setLightboxIndex(
          lightboxIndex === 0 ? filtered.length - 1 : lightboxIndex - 1,
        );
      } else {
        setLightboxIndex(
          lightboxIndex === filtered.length - 1 ? 0 : lightboxIndex + 1,
        );
      }
    },
    [lightboxIndex, filtered.length],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") goTo("prev");
      if (event.key === "ArrowRight") goTo("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, closeLightbox, goTo]);

  const activeProject =
    lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <section
      data-journey-palette="graphite"
      data-journey-label="Index"
      className="relative bg-background pb-28 pt-20 text-foreground lg:pb-36 lg:pt-24"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <JourneyBridge
          roman="II"
          ordinal="02 · 03"
          from="Seuil"
          to="Index"
          whisper="On ouvre les pages. Chaque vignette est une entrée, lue de gauche à droite, comme un contact sheet."
        />

        {/* Filter row — hairline-underlined mono labels instead of pills */}
        <div
          role="tablist"
          aria-label="Filtrer par discipline"
          className="mt-2 flex flex-wrap items-end gap-x-8 gap-y-4 border-b border-[hsl(var(--foreground)/0.14)] pb-6"
        >
          {gallery.categories.map((category) => {
            const isActive = activeCategory === category;
            const count = counts.get(category) ?? 0;
            return (
              <button
                key={category}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "group relative pb-1 font-mono text-[11px] uppercase tracking-[0.3em] transition-colors duration-300",
                  isActive
                    ? "text-[hsl(var(--accent))]"
                    : "text-[hsl(var(--foreground)/0.7)] hover:text-[hsl(var(--foreground))]",
                )}
              >
                <span className="flex items-baseline gap-3">
                  {category}
                  <span
                    className={cn(
                      "font-serif text-base tabular-nums italic tracking-tight transition-opacity duration-300",
                      isActive
                        ? "opacity-100"
                        : "opacity-60 group-hover:opacity-100",
                    )}
                  >
                    {String(count).padStart(2, "0")}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 -bottom-[7px] h-px origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isActive
                      ? "scale-x-100 bg-[hsl(var(--accent))]"
                      : "scale-x-0 bg-[hsl(var(--foreground)/0.4)] group-hover:scale-x-100",
                  )}
                />
              </button>
            );
          })}

          <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))] md:inline">
            {String(filtered.length).padStart(2, "0")} ·{" "}
            {activeCategory === allLabel ? "tout afficher" : activeCategory}
          </span>
        </div>

        {/* Asymmetric editorial grid */}
        {filtered.length > 0 ? (
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-12">
            {filtered.map((project, idx) => {
              const tile = GRID_RHYTHM[idx % GRID_RHYTHM.length];
              return (
                <li
                  key={`${project.title}-${idx}`}
                  className="lg:col-span-[var(--col-span)]"
                  style={
                    {
                      gridColumn: `span ${tile.colSpan} / span ${tile.colSpan}`,
                    } as React.CSSProperties
                  }
                >
                  <GridTile
                    project={project}
                    index={idx}
                    aspect={tile.aspect}
                    onOpen={() => openLightbox(idx)}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-24 flex flex-col items-center gap-4 border-y border-[hsl(var(--foreground)/0.1)] py-24 text-center">
            <span
              aria-hidden="true"
              className="h-px w-16"
              style={{ background: "hsl(var(--accent))" }}
            />
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
              Aucune création dans cette discipline pour le moment.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {activeProject && lightboxIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Aperçu : ${activeProject.title}`}
          className="fixed inset-0 z-[60] flex items-center justify-center"
          data-journey-opt-out
        >
          {/* Close-on-veil */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute inset-0 bg-[hsl(220_18%_4%/0.94)] backdrop-blur-md"
            aria-label="Fermer l'aperçu"
          />

          {/* Frame */}
          <div className="relative z-10 flex max-h-[92vh] w-full max-w-6xl flex-col px-4 md:px-10">
            {/* Top bar */}
            <div className="flex items-center justify-between pb-5 text-[hsl(42_28%_96%)]">
              <div className="flex items-baseline gap-4 font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(42_28%_96%/0.7)]">
                <span>
                  N° {String(lightboxIndex + 1).padStart(2, "0")} /{" "}
                  {String(filtered.length).padStart(2, "0")}
                </span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">
                  {activeProject.category}
                </span>
              </div>
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Fermer l'aperçu"
                className="flex h-10 w-10 items-center justify-center border border-[hsl(42_28%_96%/0.3)] text-[hsl(42_28%_96%)] transition-colors duration-300 hover:border-[hsl(322_88%_58%)] hover:text-[hsl(322_88%_58%)]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[hsl(220_12%_8%)]">
              <Image
                src={activeProject.image.src}
                alt={activeProject.image.alt}
                fill
                className="object-contain"
                sizes="92vw"
                priority
              />
            </div>

            {/* Caption */}
            <div className="flex flex-col gap-3 pt-5 text-[hsl(42_28%_96%)] md:flex-row md:items-start md:justify-between md:gap-10">
              <div className="flex-1">
                <p className="font-serif text-2xl tracking-tight md:text-3xl">
                  {activeProject.title}
                </p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[hsl(42_28%_96%/0.75)]">
                  {activeProject.description}
                </p>
              </div>
              <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[hsl(42_28%_96%/0.7)]">
                <span
                  aria-hidden="true"
                  className="h-px w-8"
                  style={{ background: "hsl(322 88% 58%)" }}
                />
                {activeProject.location}
              </div>
            </div>
          </div>

          {/* Prev / Next */}
          <button
            type="button"
            onClick={() => goTo("prev")}
            aria-label="Projet précédent"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center border border-[hsl(42_28%_96%/0.25)] text-[hsl(42_28%_96%)] transition-colors duration-300 hover:border-[hsl(322_88%_58%)] hover:text-[hsl(322_88%_58%)] md:left-6"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo("next")}
            aria-label="Projet suivant"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center border border-[hsl(42_28%_96%/0.25)] text-[hsl(42_28%_96%)] transition-colors duration-300 hover:border-[hsl(322_88%_58%)] hover:text-[hsl(322_88%_58%)] md:right-6"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </section>
  );
}

type GridTileProps = {
  project: Project;
  index: number;
  aspect: string;
  onOpen: () => void;
};

function GridTile({ project, index, aspect, onOpen }: GridTileProps) {
  const [loaded, setLoaded] = useState(false);
  const numeral = `N° ${String(index + 1).padStart(2, "0")}`;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Ouvrir l'aperçu : ${project.title}`}
      className="group relative block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-4 focus-visible:ring-offset-[hsl(var(--background))]"
    >
      {/* Frame */}
      <div
        className="relative overflow-hidden bg-[hsl(var(--muted)/0.5)]"
        style={{ aspectRatio: aspect }}
      >
        {!loaded ? (
          <div
            className="skeleton absolute inset-0 z-10"
            aria-hidden="true"
          />
        ) : null}
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          className={cn(
            "object-cover transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]",
            loaded ? "opacity-100" : "opacity-0",
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
          onLoad={() => setLoaded(true)}
        />

        {/* Numeral overlay — lives on the image */}
        <span
          aria-hidden="true"
          className="absolute left-4 top-4 z-10 font-mono text-[11px] uppercase tracking-[0.35em] text-[hsl(42_28%_96%/0.9)] mix-blend-difference"
        >
          {numeral}
        </span>

        {/* Top-right cue — reveals on hover */}
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center border border-[hsl(42_28%_96%/0.4)] bg-[hsl(220_18%_4%/0.45)] text-[hsl(42_28%_96%)] opacity-0 backdrop-blur-sm transition-all duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <ArrowUpRight className="h-4 w-4" />
        </span>

        {/* Dim veil on hover to lift the caption */}
        <span
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-gradient-to-t from-[hsl(220_18%_4%/0.78)] via-[hsl(220_18%_4%/0.2)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        />

        {/* Caption that slides up */}
        <div className="absolute inset-x-4 bottom-4 z-10 translate-y-3 text-[hsl(42_28%_96%)] opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(322_88%_70%)]">
            {project.category}
          </p>
          <p className="mt-1.5 font-serif text-xl leading-tight tracking-tight">
            {project.title}
          </p>
        </div>
      </div>

      {/* Footer line under the frame */}
      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-[hsl(var(--foreground)/0.14)] pt-3">
        <span className="flex min-w-0 items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
          <span className="text-[hsl(var(--foreground)/0.8)]">{numeral}</span>
          <span className="truncate">{project.category}</span>
        </span>
        <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
          {project.location}
        </span>
      </div>

      {/* Magenta hairline that grows on hover — the "read more" gesture */}
      <span
        aria-hidden="true"
        className="block h-px w-full origin-left scale-x-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        style={{ background: "hsl(var(--accent))" }}
      />
    </button>
  );
}
