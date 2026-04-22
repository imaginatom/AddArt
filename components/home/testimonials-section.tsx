"use client"

import { useEffect, useState } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"

type TestimonialsContent = HomePageContent["testimonials"]

export function TestimonialsSection({
  content = homePageDefaults.testimonials,
}: {
  content?: TestimonialsContent
}) {
  const [current, setCurrent] = useState(0)
  const testimonials = content.items

  useEffect(() => {
    if (current >= testimonials.length) {
      setCurrent(0)
    }
  }, [current, testimonials.length])

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1))

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="animate-on-scroll mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">{content.eyebrow}</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            {content.title}
          </h2>
        </div>

        {/* Carousel */}
        <div className="animate-on-scroll relative mt-14">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="w-full shrink-0 px-4">
                  <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center md:p-10 transition-shadow duration-300 hover:shadow-lg">
                    {/* Stars */}
                    <div className="flex items-center justify-center gap-1">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${s < t.stars ? "fill-accent text-accent" : "fill-muted text-muted"}`}
                        />
                      ))}
                    </div>
                    <blockquote className="mt-6 font-serif text-lg leading-relaxed text-foreground md:text-xl">
                      {`\u201c${t.text}\u201d`}
                    </blockquote>
                    <div className="mt-6">
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all duration-200 ease-out hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110 active:scale-95"
              aria-label={"T\u00e9moignage pr\u00e9c\u00e9dent"}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-primary" : "w-2 bg-border"}`}
                  aria-label={`Aller au t\u00e9moignage ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all duration-200 ease-out hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110 active:scale-95"
              aria-label={"T\u00e9moignage suivant"}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
