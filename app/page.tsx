import type { Metadata } from "next"
import { HeroSection } from "@/components/home/hero-section"
import { SocialProofBar } from "@/components/home/social-proof-bar"
import { ServicesOverview } from "@/components/home/services-overview"
import { WhyUsSection } from "@/components/home/why-us-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { GalleryPreview } from "@/components/home/gallery-preview"
import { LocalSeoSection } from "@/components/home/local-seo-section"
import { ContactCtaSection } from "@/components/home/contact-cta-section"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { mergeHomePageContent } from "@/lib/content/homepage"
import { mergePortfolioContent } from "@/lib/content/portfolio"

export const metadata: Metadata = {
  title: "Architecte \u00e0 Oran | Noun Studio",
  description:
    "Cabinet d'architecture et studio de design \u00e0 Oran, Alg\u00e9rie. Projets r\u00e9sidentiels, commerciaux et branding local.",
}

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()
  const [homeResult, portfolioResult] = await Promise.all([
    supabase.from("site_content").select("section, content").eq("page", "home"),
    supabase.from("site_content").select("section, content").eq("page", "portfolio").eq("section", "gallery"),
  ])
  const content = mergeHomePageContent(homeResult.error ? [] : homeResult.data ?? [])
  const portfolioContent = mergePortfolioContent(
    portfolioResult.error ? [] : portfolioResult.data ?? [],
  )
  const previewImages = portfolioContent.gallery.projects.slice(0, 6).map((project) => ({
    src: project.image.src,
    alt: project.image.alt,
    label: project.category,
  }))

  return (
    <>
      <HeroSection content={content.hero} />
      <SocialProofBar content={content.socialProof} />
      <ServicesOverview content={content.services} />
      <WhyUsSection content={content.whyUs} />
      <TestimonialsSection content={content.testimonials} />
      <GalleryPreview content={content.galleryPreview} images={previewImages} />
      <LocalSeoSection content={content.localSeo} />
      <ContactCtaSection content={content.contactCta} />
    </>
  )
}
