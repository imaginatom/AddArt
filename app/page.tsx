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
import { mapProjectRecords, type PortfolioProjectRecord } from "@/lib/content/portfolio-projects"
import { mergeSiteSettingsContent } from "@/lib/content/settings"

export const metadata: Metadata = {
  title: "AddArt \u2014 Illustration, Cartoon Art & Motion \u00e0 Oran",
  description:
    "Studio d'illustration et motion design \u00e0 Oran, Alg\u00e9rie. Character design, jaquettes de jeux, graphismes commerciaux et courtes animations.",
}

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()
  const [homeResult, projectResult, settingsResult] = await Promise.all([
    supabase.from("site_content").select("section, content").eq("page", "home"),
    supabase
      .from("projects")
      .select(
        "id, slug, title, description, location, category, image_src, image_alt, image_path, status, sort_order",
      )
      .eq("status", "published")
      .order("sort_order", { ascending: true }),
    supabase.from("site_content").select("section, content").eq("page", "settings"),
  ])
  const content = mergeHomePageContent(homeResult.error ? [] : homeResult.data ?? [])
  const settings = mergeSiteSettingsContent(settingsResult.error ? [] : settingsResult.data ?? [])
  const projects = mapProjectRecords((projectResult.data as PortfolioProjectRecord[] | null) ?? null)
  const previewImages = projects.slice(0, 6).map((project) => ({
    src: project.image_src,
    alt: project.image_alt,
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
      <ContactCtaSection content={content.contactCta} settings={settings} />
    </>
  )
}
