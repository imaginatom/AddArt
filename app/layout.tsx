import React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans, Playfair_Display } from "next/font/google"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FloatingCTA } from "@/components/floating-cta"
import { BackToTop } from "@/components/back-to-top"
import { ScrollAnimations } from "@/components/scroll-animations"
import { LenisProvider } from "@/design-system/providers/lenis-provider"
import { JourneyProvider } from "@/design-system/providers/journey-provider"
import { ScrollProgress } from "@/design-system/chrome/scroll-progress"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://addart.dz"),
  title: {
    default: "AddArt | Studio d'illustration & motion à Oran",
    template: "%s | AddArt",
  },
  description:
    "AddArt — studio d'illustration, de cartoon art et de motion design à Oran, Algérie. Character design, jaquettes de jeux, graphismes commerciaux et courtes animations.",
  keywords: [
    "illustrateur Oran",
    "cartoon art",
    "character design",
    "jaquette de jeu",
    "motion design Algérie",
    "animation courte",
    "graphiste Oran",
    "game cover art",
    "AddArt",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    url: "/",
    siteName: "AddArt",
    title: "AddArt | Studio d'illustration & motion à Oran",
    description:
      "Studio d'illustration et motion design à Oran. Cartoon art, jaquettes de jeux, graphismes commerciaux et courtes animations.",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Illustrations et animations cartoon par AddArt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AddArt | Studio d'illustration & motion à Oran",
    description:
      "Studio d'illustration et motion design à Oran. Cartoon art, jaquettes de jeux, graphismes commerciaux et courtes animations.",
    images: ["/images/hero-bg.jpg"],
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#101216",
  width: "device-width",
  initialScale: 1,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AddArt",
  image: "/images/hero-bg.jpg",
  email: "addart69@gmail.com",
  founder: {
    "@type": "Person",
    name: "{{ARTIST_NAME}}",
    jobTitle: "Illustrateur & Motion Designer",
  },
  url: "https://addart.dz",
  description:
    "Studio d'illustration, de cartoon art et de motion design à Oran, Algérie.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Oran",
    addressRegion: "Oran",
    addressCountry: "DZ",
  },
  areaServed: ["Oran", "Algérie", "International"],
  priceRange: "$$",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr-DZ" className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <LenisProvider>
          <JourneyProvider>
            <ScrollProgress />
            <SiteHeader />
            <main id="main-content">{children}</main>
            <SiteFooter />
            <FloatingCTA />
            <BackToTop />
            <ScrollAnimations />
          </JourneyProvider>
        </LenisProvider>
      </body>
    </html>
  )
}
