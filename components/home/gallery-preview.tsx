"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"

function GalleryImage({
  img,
  i,
}: {
  img: { src: string; alt: string; label: string; span: string }
  i: number
}) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div
      className={`group relative overflow-hidden rounded-xl ${img.span} ${i === 0 ? "aspect-square md:aspect-auto" : "aspect-[4/3]"}`}
    >
      {!loaded && <div className="skeleton absolute inset-0 z-10" aria-hidden="true" />}
      <Image
        src={img.src}
        alt={img.alt}
        fill
        className={cn(
          "object-cover transition-all duration-500 group-hover:scale-105",
          loaded ? "opacity-100" : "opacity-0"
        )}
        sizes={i === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/40" />
      <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
        <span className="inline-block rounded-md bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
          {img.label}
        </span>
      </div>
    </div>
  )
}

type GalleryContent = HomePageContent["galleryPreview"]

export function GalleryPreview({
  content = homePageDefaults.galleryPreview,
  images = [],
}: {
  content?: GalleryContent
  images?: Array<{ src: string; alt: string; label: string }>
}) {
  const previewImages = images.map((image, index) => ({
    ...image,
    span: index === 0 ? "md:col-span-2 md:row-span-2" : "",
  }))
  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="animate-on-scroll mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">{content.eyebrow}</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            {content.title}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {content.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="animate-on-scroll mt-14 grid gap-3 md:grid-cols-3 md:grid-rows-3">
          {previewImages.map((img, i) => (
            <GalleryImage key={`${img.src}-${i}`} img={img} i={i} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 hover:text-primary bg-transparent">
            <Link href="/realisations">
              {content.ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
