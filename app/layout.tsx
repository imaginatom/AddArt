import React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans, Playfair_Display } from "next/font/google"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FloatingCTA } from "@/components/floating-cta"
import { BackToTop } from "@/components/back-to-top"
import { ScrollAnimations } from "@/components/scroll-animations"
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
  metadataBase: new URL("https://nounstudio.dz"),
  title: {
    default: "Noun Studio | Cabinet d'architecture \u00e0 Oran",
    template: "%s | Noun Studio",
  },
  description:
    "Noun Studio, cabinet d'architecture et studio de design \u00e0 Oran, Alg\u00e9rie. Architecture r\u00e9sidentielle et commerciale, branding et contenu culturel.",
  keywords: [
    "architecte Oran",
    "cabinet d'architecture Oran",
    "architecture Oran",
    "studio design Oran",
    "branding Oran",
    "Noun Studio",
    "Alg\u00e9rie",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    url: "/",
    siteName: "Noun Studio",
    title: "Noun Studio | Cabinet d'architecture \u00e0 Oran",
    description:
      "Cabinet d'architecture et studio de design \u00e0 Oran, Alg\u00e9rie. Architecture, branding et contenu culturel.",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Noun Studio \u00e0 Oran, Alg\u00e9rie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noun Studio | Cabinet d'architecture \u00e0 Oran",
    description:
      "Cabinet d'architecture et studio de design \u00e0 Oran, Alg\u00e9rie. Architecture, branding et contenu culturel.",
    images: ["/images/hero-bg.jpg"],
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#2d2521",
  width: "device-width",
  initialScale: 1,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Architect",
  name: "Noun Studio",
  image: "/images/hero-bg.jpg",
  email: "contact@nounstudio.dz",
  founder: {
    "@type": "Person",
    name: "SAHNOUNE Mohammed",
    jobTitle: "Architecte & Directeur Cr\u00e9atif",
  },
  url: "https://nounstudio.dz",
  description:
    "Cabinet d'architecture et studio de design \u00e0 Oran, Alg\u00e9rie. Architecture, branding et contenu culturel.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Oran",
    addressRegion: "Oran",
    addressCountry: "DZ",
  },
  areaServed: ["Oran", "Alg\u00e9rie"],
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
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <FloatingCTA />
        <BackToTop />
        <ScrollAnimations />
      </body>
    </html>
  )
}
