import { portfolioPageDefaults } from "@/lib/content/portfolio"

export type ProjectStatus = "draft" | "published"

export type PortfolioProjectRecord = {
  id: string
  slug: string
  title: string
  description: string
  location: string
  category: string
  image_src: string
  image_alt: string
  image_path: string | null
  status: ProjectStatus
  sort_order: number
  updated_at?: string
}

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "project"

export const portfolioProjectDefaults: PortfolioProjectRecord[] = portfolioPageDefaults.gallery.projects.map(
  (project, index) => ({
    id: `default-${index + 1}`,
    slug: `${toSlug(project.title)}-${index + 1}`,
    title: project.title,
    description: project.description,
    location: project.location,
    category: project.category,
    image_src: project.image.src,
    image_alt: project.image.alt,
    image_path: project.image.path ?? null,
    status: "published",
    sort_order: index,
  }),
)

export const mapProjectRecords = (
  rows: PortfolioProjectRecord[] | null | undefined,
  fallback: PortfolioProjectRecord[] = [],
) => {
  if (!rows || rows.length === 0) {
    return fallback
  }

  return rows
    .filter((row) => Boolean(row.title && row.image_src))
    .map((row) => ({
      ...row,
      description: row.description ?? "",
      location: row.location ?? "",
      category: row.category ?? "Uncategorized",
      image_alt: row.image_alt ?? row.title,
      image_path: row.image_path ?? null,
      sort_order: Number.isFinite(row.sort_order) ? row.sort_order : 0,
      status: row.status === "published" ? "published" : "draft",
    }))
    .sort((a, b) => a.sort_order - b.sort_order)
}

export const derivePortfolioCategories = (projects: PortfolioProjectRecord[]) => {
  const categories = Array.from(
    new Set(
      projects
        .map((project) => project.category.trim())
        .filter((value) => value.length > 0),
    ),
  )
  return ["Tous", ...categories]
}

