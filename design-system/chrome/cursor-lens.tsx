"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * CursorLens — the magenta lens that trails the pointer.
 *
 * The native cursor stays where it is; we overlay a 24px ring that
 * lerps toward the pointer position. On interactive elements (a,
 * button, [role=button], [data-cursor-lens="grow"]) the ring blows up
 * to ~72px with the accent fill and inverts its foreground so it reads
 * like a magnifier sitting on the target. That single element persists
 * across every act, silently morphing its color with the palette (it
 * uses `--accent` which the journey provider rewrites), which is the
 * cheapest, most visible cross-section continuity trick there is.
 *
 * Hidden on coarse pointers (touch devices), on admin / login routes,
 * and when `prefers-reduced-motion` is set.
 *
 * Implementation notes:
 *   - Updates via `requestAnimationFrame` with a 0.2 easing factor, so
 *     it trails the pointer with a cinematic lag without feeling laggy.
 *   - Uses `mix-blend-mode: difference` on dark palettes for automatic
 *     legibility, reverts to normal on light palettes via the palette
 *     variable `--cursor-blend`.
 */
export function CursorLens() {
  const pathname = usePathname() ?? "/";
  const isMarketingRoute =
    !pathname.startsWith("/admin") && !pathname.startsWith("/login");

  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!isMarketingRoute) {
      setEnabled(false);
      return;
    }
    if (typeof window === "undefined") return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!(coarse || reduced));
  }, [isMarketingRoute, pathname]);

  useEffect(() => {
    if (!enabled || !isMarketingRoute) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: pointer.x, y: pointer.y };
    const dotPos = { x: pointer.x, y: pointer.y };
    let mode: "default" | "grow" | "text" = "default";
    let raf = 0;
    let moved = false;

    const applyMode = (next: "default" | "grow" | "text") => {
      if (next === mode) return;
      mode = next;
      ring.dataset.mode = mode;
    };

    const findInteractiveTarget = (t: EventTarget | null): HTMLElement | null => {
      let el = t as HTMLElement | null;
      while (el && el !== document.body) {
        if (
          el instanceof HTMLElement &&
          (el.tagName === "A" ||
            el.tagName === "BUTTON" ||
            el.getAttribute("role") === "button" ||
            el.dataset.cursorLens === "grow")
        ) {
          return el;
        }
        el = el.parentElement;
      }
      return null;
    };

    const snapToPointer = () => {
      ringPos.x = pointer.x;
      ringPos.y = pointer.y;
      dotPos.x = pointer.x;
      dotPos.y = pointer.y;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!moved) {
        moved = true;
        snapToPointer();
      }
      const target = findInteractiveTarget(e.target);
      applyMode(target ? "grow" : "default");
    };

    const onDown = () => ring.classList.add("is-pressed");
    const onUp = () => ring.classList.remove("is-pressed");
    const onLeave = () => ring.classList.add("is-hidden");
    const onEnter = () => ring.classList.remove("is-hidden");

    const tick = () => {
      ringPos.x += (pointer.x - ringPos.x) * 0.18;
      ringPos.y += (pointer.y - ringPos.y) * 0.18;
      dotPos.x += (pointer.x - dotPos.x) * 0.45;
      dotPos.y += (pointer.y - dotPos.y) * 0.45;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    snapToPointer();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled, isMarketingRoute, pathname]);

  if (!isMarketingRoute) return null;
  if (!enabled) return null;

  return (
    <>
      {/* Ring (follows pointer with lag) */}
      <div
        ref={ringRef}
        aria-hidden="true"
        data-journey-chrome="cursor-ring"
        data-mode="default"
        className="pointer-events-none fixed left-0 top-0 z-[70] h-6 w-6 rounded-full border transition-[width,height,background,border-color,opacity] duration-300 ease-out"
        style={{
          borderColor: "hsl(var(--accent))",
          background: "transparent",
          willChange: "transform, width, height, background",
        }}
      />
      {/* Dot (faster, lives inside the ring) */}
      <div
        ref={dotRef}
        aria-hidden="true"
        data-journey-chrome="cursor-dot"
        className="pointer-events-none fixed left-0 top-0 z-[71] h-1 w-1 rounded-full"
        style={{
          background: "hsl(var(--accent))",
          willChange: "transform",
        }}
      />
    </>
  );
}
