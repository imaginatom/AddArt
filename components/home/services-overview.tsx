"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"
import { JourneyBridge } from "@/design-system/chrome/journey-bridge"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

type ServicesContent = HomePageContent["services"]
type ServiceItem = ServicesContent["items"][number]

/**
 * Services as Act 02 · Zoom in — pinned storytelling panel.
 *
 * The section is ~3 viewports tall. Inside, a single sticky container holds
 * the layout and the active service changes as the user scrolls through
 * the pin. Instead of three identical cards sitting next to each other, the
 * user sees one service at a time at display scale, with a visible index
 * (01 / 02 / 03) on the left — closer to how an editorial magazine reveals
 * chapters.
 *
 * Each service has:
 *   - An oversized numeral (01, 02, 03)
 *   - A display-scale serif title (line reveal)
 *   - A condensed body (mask wipe)
 *   - A gradient plate on the right (service-specific, abstract cover art)
 *   - A background media layer (image or video) sitting on the black
 *     section background on the left side. Transparent assets keep the
 *     black showing through behind them.
 */

const SERVICE_HREFS = ["/realisations", "/realisations", "/contact"]

/** Service-specific gradient plates — act as abstract cover art. */
const SERVICE_PLATES = [
  "radial-gradient(80% 60% at 30% 30%, hsl(322 88% 58% / 0.75) 0%, transparent 60%), radial-gradient(70% 60% at 70% 70%, hsl(38 95% 58% / 0.55) 0%, transparent 60%), linear-gradient(135deg, hsl(280 70% 22%) 0%, hsl(322 60% 14%) 100%)",
  "radial-gradient(80% 60% at 70% 25%, hsl(200 90% 58% / 0.65) 0%, transparent 60%), radial-gradient(70% 60% at 30% 80%, hsl(322 88% 58% / 0.55) 0%, transparent 60%), linear-gradient(135deg, hsl(220 50% 18%) 0%, hsl(200 40% 12%) 100%)",
  "radial-gradient(80% 60% at 50% 40%, hsl(145 65% 52% / 0.55) 0%, transparent 60%), radial-gradient(60% 60% at 80% 80%, hsl(322 88% 58% / 0.55) 0%, transparent 60%), linear-gradient(135deg, hsl(160 40% 16%) 0%, hsl(200 30% 12%) 100%)",
]

function ServiceChapterMobile({
  item,
  index,
  href,
}: {
  item: ServiceItem
  index: number
  href: string
}) {
  return (
    <article className="animate-on-scroll relative overflow-hidden bg-black p-6">
      {item.media?.src ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {item.media.type === "video" ? (
            <video
              src={item.media.src}
              className="h-full w-full object-contain opacity-80"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.media.src}
              alt={item.media.alt || item.title}
              className="h-full w-full object-contain opacity-80"
            />
          )}
        </div>
      ) : null}

      <div
        className="relative z-10 font-serif font-bold leading-none text-accent/90"
        style={{ fontSize: "clamp(120px, 30vw, 180px)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="relative z-10">
        <h3 className="mt-4 font-serif text-3xl font-bold leading-tight text-balance text-white md:text-4xl">
          {item.title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-white/90">
          {item.description}
        </p>
        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-white"
        >
          <span className="border-b border-white pb-0.5">En savoir plus</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}

export function ServicesOverview({
  content = homePageDefaults.services,
}: {
  content?: ServicesContent
}) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const stickyRef = useRef<HTMLDivElement | null>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    // Pinning on narrow viewports fights the mobile rubber-band scroll;
    // the stacked fallback in the DOM handles those sizes.
    if (window.matchMedia("(max-width: 1023px)").matches) return

    const section = sectionRef.current
    const sticky = stickyRef.current
    if (!section || !sticky) return

    const count = content.items.length
    if (count === 0) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        // Three chapters × ~100vh of scroll each keeps pacing readable —
        // fast enough to feel responsive, slow enough to absorb each one.
        end: () => `+=${window.innerHeight * (count - 0.2)}`,
        pin: sticky,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = Math.min(
            count - 1,
            Math.floor(self.progress * count * 1.001),
          )
          setActiveIdx((prev) => (prev === idx ? prev : idx))
        },
      })
    }, section)

    return () => ctx.revert()
  }, [content.items.length])

  return (
    <section
      ref={sectionRef}
      data-journey-palette="graphite"
      data-journey-label="Pratique"
      className="relative bg-black text-foreground"
    >
      {/* Sticky chapter frame (pinned on ≥lg, absolute on mobile so stacked
          fallback below renders instead) */}
      <div
        ref={stickyRef}
        className="relative isolate hidden h-screen overflow-hidden lg:block"
      >
        {/* Media background layer — sits on the black section background,
            spans everything to the left of the right gradient plate.
            Transparent PNGs / WebM keep the black showing behind them. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 right-[28%] hidden lg:block"
          data-journey-opt-out
        >
          {content.items.map((item, i) => (
            <div
              key={`media-${item.title}`}
              className="absolute inset-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ opacity: activeIdx === i ? 1 : 0 }}
            >
              {item.media?.src ? (
                item.media.type === "video" ? (
                  <video
                    src={item.media.src}
                    className="h-full w-full object-contain"
                    autoPlay={activeIdx === i}
                    muted
                    loop
                    playsInline
                    controls={false}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.media.src}
                    alt={item.media.alt || item.title}
                    className="h-full w-full object-contain"
                  />
                )
              ) : null}
            </div>
          ))}
        </div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-4 py-16 lg:px-8">
          {/* Eyebrow row — now a JourneyBridge so the act reads as Acte II,
              explicitly picking up from Arrivée (Act I). */}
          <div className="flex items-center justify-between">
            <JourneyBridge
              roman="II"
              ordinal="02 · 07"
              from="Arrivée"
              to={content.eyebrow}
              whisper="Le studio passe du souffle au geste — comment la pratique se structure au quotidien."
              className="flex-1 pb-0"
            />
            {/* Chapter pagination */}
            <ol className="flex items-center gap-2">
              {content.items.map((item, i) => (
                <li key={item.title}>
                  <span
                    aria-hidden="true"
                    className="block h-px transition-all duration-500 ease-out"
                    style={{
                      width: activeIdx === i ? "48px" : "16px",
                      background:
                        activeIdx === i
                          ? "hsl(322 88% 58%)"
                          : "hsl(var(--border))",
                    }}
                  />
                </li>
              ))}
            </ol>
          </div>

          {/* Main chapter body */}
          <div className="grid flex-1 grid-cols-12 items-center gap-8 py-10">
            {/* Oversized numeral, cross-faded per chapter */}
            <div className="col-span-4 relative flex items-center">
              <div className="relative h-[clamp(180px,26vw,320px)] w-full">
                {content.items.map((item, i) => (
                  <span
                    key={item.title}
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center font-serif font-bold leading-none tracking-tight text-accent/90 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      fontSize: "clamp(180px, 26vw, 320px)",
                      opacity: activeIdx === i ? 1 : 0,
                      transform:
                        activeIdx === i
                          ? "translateY(0)"
                          : activeIdx > i
                            ? "translateY(-30%)"
                            : "translateY(30%)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-span-8 relative">
              <div className="relative min-h-[280px]">
                {content.items.map((item, i) => (
                  <article
                    key={item.title}
                    className="absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    aria-hidden={activeIdx !== i}
                    style={{
                      opacity: activeIdx === i ? 1 : 0,
                      transform:
                        activeIdx === i
                          ? "translateY(0)"
                          : activeIdx > i
                            ? "translateY(-20px)"
                            : "translateY(20px)",
                      pointerEvents: activeIdx === i ? "auto" : "none",
                    }}
                  >
                    <h3
                      className="font-serif font-bold leading-[1.02] tracking-tight text-balance text-white"
                      style={{ fontSize: "clamp(40px, 5.4vw, 84px)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
                      {item.description}
                    </p>
                    <Link
                      href={SERVICE_HREFS[i] ?? "/contact"}
                      className="group/link mt-8 inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-white"
                    >
                      <span className="relative">
                        En savoir plus
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-500 group-hover/link:scale-x-100"
                        />
                      </span>
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll-through hint */}
          <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <span>
              {String(activeIdx + 1).padStart(2, "0")} / {String(content.items.length).padStart(2, "0")}
            </span>
            <span className="flex items-center gap-3">
              Faites défiler
              <span className="inline-block h-px w-12 bg-muted-foreground/50" />
            </span>
          </div>
        </div>

        {/* Right-edge color plate. Restored to the original gradient behavior.
            Fixed at the right 28% of the frame, softly morphing between
            service-specific gradients. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[28%] lg:block"
          data-journey-opt-out
        >
          <div className="relative h-full w-full overflow-hidden">
            {content.items.map((item, i) => (
              <div
                key={item.title}
                className="absolute inset-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  background: SERVICE_PLATES[i] ?? SERVICE_PLATES[0],
                  opacity: activeIdx === i ? 1 : 0,
                }}
              />
            ))}
            {/* Softening gradient at the plate's left edge so it blends
                into the black section rather than looking pasted on. */}
            <div
              className="absolute inset-y-0 left-0 w-16"
              style={{
                background:
                  "linear-gradient(to right, hsl(0 0% 0%) 0%, transparent 100%)",
              }}
            />
            {/* Top-right journey mark */}
            <span className="absolute right-6 top-6 text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
              Act 02
            </span>
          </div>
        </div>
      </div>

      {/* Mobile fallback — stacked chapters, no pinning */}
      <div className="mx-auto flex max-w-2xl flex-col gap-14 px-4 py-24 lg:hidden">
        <JourneyBridge
          roman="II"
          ordinal="02 · 07"
          from="Arrivée"
          to={content.eyebrow}
        />
        {content.items.map((item, i) => (
          <ServiceChapterMobile
            key={item.title}
            item={item}
            index={i}
            href={SERVICE_HREFS[i] ?? "/contact"}
          />
        ))}
      </div>
    </section>
  )
}
