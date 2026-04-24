import type { Metadata } from "next"
import { RealisationsHero } from "@/components/realisations/realisations-hero"
import { RealisationsIndex } from "@/components/realisations/realisations-index"
import { RealisationsCloser } from "@/components/realisations/realisations-closer"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { mergePortfolioContent } from "@/lib/content/portfolio"
import {
  derivePortfolioCategories,
  mapProjectRecords,
  type PortfolioProjectRecord,
} from "@/lib/content/portfolio-projects"
import { mergeSiteSettingsContent } from "@/lib/content/settings"

export const metadata: Metadata = {
  title: "Portfolio \u2014 Illustrations, Jaquettes & Animations",
  description:
    "D\u00e9couvrez le portfolio d'AddArt : personnages cartoon, jaquettes de jeux, illustrations commerciales et animations courtes r\u00e9alis\u00e9es \u00e0 Oran.",
}

/**
 * Portfolio route — a three-act journey of its own.
 *
 *   I · Seuil  (graphite)  — editorial masthead + project ledger (TOC)
 *   II · Index (graphite)  — hairline filters + asymmetric editorial grid
 *   III · Suite (magenta)  — closer with brief ledger, mailing label, CTA
 *
 * Content is still CMS-editable through the same `portfolio` page entry
 * in Supabase; the three components above are pure presentation shells
 * wired to the merged content object. No data shape has changed, so
 * existing admin overrides keep working.
 */
export default async function RealisationsPage() {
  const supabase = await createSupabaseServerClient()
  const [contentResult, projectResult, settingsResult] = await Promise.all([
    supabase.from("site_content").select("section, content").eq("page", "portfolio"),
    supabase
      .from("projects")
      .select(
        "id, slug, title, description, location, category, image_src, image_alt, image_path, status, sort_order",
      )
      .eq("status", "published")
      .order("sort_order", { ascending: true }),
    supabase.from("site_content").select("section, content").eq("page", "settings"),
  ])

  const merged = mergePortfolioContent(contentResult.error ? [] : contentResult.data ?? [])
  const projects = mapProjectRecords((projectResult.data as PortfolioProjectRecord[] | null) ?? null)
  const categories = derivePortfolioCategories(projects)
  const settings = mergeSiteSettingsContent(settingsResult.error ? [] : settingsResult.data ?? [])

  const content = {
    ...merged,
    gallery: {
      ...merged.gallery,
      categories,
      projects: projects.map((project) => ({
        title: project.title,
        description: project.description,
        location: project.location,
        category: project.category,
        image: {
          src: project.image_src,
          alt: project.image_alt,
          path: project.image_path ?? undefined,
        },
      })),
    },
  }

  return (
    <>
      <RealisationsHero content={content} />
      <RealisationsIndex content={content} />
      <RealisationsCloser content={content} settings={settings} />
    </>
  )
}
