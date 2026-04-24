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
import { SectionIndex } from "@/design-system/chrome/section-index"
import { JourneySpine } from "@/design-system/chrome/journey-spine"
import { ActFlash } from "@/design-system/chrome/act-flash"
import { CursorLens } from "@/design-system/chrome/cursor-lens"
import { PageIntro } from "@/design-system/chrome/page-intro"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { mergeSiteSettingsContent } from "@/lib/content/settings"
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("site_content")
    .select("section, content")
    .eq("page", "settings")
  const settings = mergeSiteSettingsContent(error ? [] : data ?? [])
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.brand.studioName,
    image: "/images/hero-bg.jpg",
    email: settings.contact.email,
    telephone: settings.contact.phone,
    founder: {
      "@type": "Person",
      name: settings.brand.artistName,
      jobTitle: settings.brand.artistRole,
    },
    url: "https://addart.dz",
    description: settings.brand.footerDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.contact.location,
      addressCountry: "DZ",
    },
    areaServed: ["Oran", "Algerie", "International"],
    priceRange: "$$",
  }

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
            <PageIntro />
            <ScrollProgress />
            <JourneySpine />
            <SectionIndex />
            <ActFlash />
            <CursorLens />
            <SiteHeader settings={settings} />
            <main id="main-content">{children}</main>
            <SiteFooter settings={settings} />
            <FloatingCTA settings={settings} />
            <BackToTop />
            <ScrollAnimations />
          </JourneyProvider>
        </LenisProvider>
      </body>
    </html>
  )
}
