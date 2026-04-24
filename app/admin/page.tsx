"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowRight, FolderKanban, Mail, PanelsTopLeft, PencilRuler, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminInfoPanel, AdminPageHeader, AdminPageShell } from "@/components/admin/admin-ui"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type AdminPageKey = "home" | "portfolio" | "contact" | "settings"

type PageSummary = {
  count: number
  lastUpdated: string | null
}

type ProjectSummary = {
  total: number
  published: number
  draft: number
}

const dashboardPages: Array<{
  key: AdminPageKey
  name: string
  description: string
  href: string
}> = [
  {
    key: "home",
    name: "Homepage",
    description: "Hero, services, testimonials, and contact CTA sections.",
    href: "/admin/homepage",
  },
  {
    key: "portfolio",
    name: "Portfolio",
    description: "Hero copy, project manager, and CTA messaging.",
    href: "/admin/portfolio",
  },
  {
    key: "contact",
    name: "Contact",
    description: "Contact hero, info blocks, artist card, and FAQ.",
    href: "/admin/contact",
  },
  {
    key: "settings",
    name: "Settings",
    description: "Global contact info, socials, legal links, and form config.",
    href: "/admin/settings",
  },
]

const createInitialSummaries = (): Record<AdminPageKey, PageSummary> => ({
  home: { count: 0, lastUpdated: null },
  portfolio: { count: 0, lastUpdated: null },
  contact: { count: 0, lastUpdated: null },
  settings: { count: 0, lastUpdated: null },
})

const createInitialProjectSummary = (): ProjectSummary => ({
  total: 0,
  published: 0,
  draft: 0,
})

const formatTimestamp = (value: string | null) =>
  value ? new Date(value).toLocaleString() : "No updates yet"

export default function AdminIndexPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [summaries, setSummaries] = useState<Record<AdminPageKey, PageSummary>>(
    () => createInitialSummaries(),
  )
  const [projectSummary, setProjectSummary] = useState<ProjectSummary>(() =>
    createInitialProjectSummary(),
  )
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const loadSummaries = async () => {
      setIsLoading(true)
      setLoadError(null)

      const [{ data, error }, { data: projectRows, error: projectError }] = await Promise.all([
        supabase
          .from("site_content")
          .select("page, updated_at")
          .in(
            "page",
            dashboardPages.map((page) => page.key),
          ),
        supabase.from("projects").select("status"),
      ])

      if (error) {
        setLoadError(error.message || "Unable to load admin overview.")
        setIsLoading(false)
        return
      }

      if (projectError) {
        setLoadError(projectError.message || "Unable to load projects overview.")
        setIsLoading(false)
        return
      }

      const next = createInitialSummaries()
      for (const row of data ?? []) {
        const pageKey = row.page as AdminPageKey
        if (!next[pageKey]) {
          continue
        }
        next[pageKey].count += 1
        if (!row.updated_at) {
          continue
        }
        if (!next[pageKey].lastUpdated) {
          next[pageKey].lastUpdated = row.updated_at
          continue
        }
        if (new Date(row.updated_at) > new Date(next[pageKey].lastUpdated as string)) {
          next[pageKey].lastUpdated = row.updated_at
        }
      }

      setSummaries(next)
      const projectStats = createInitialProjectSummary()
      for (const row of projectRows ?? []) {
        projectStats.total += 1
        if (row.status === "published") {
          projectStats.published += 1
        } else {
          projectStats.draft += 1
        }
      }
      setProjectSummary(projectStats)
      setIsLoading(false)
    }

    void loadSummaries()
  }, [supabase])

  return (
    <AdminPageShell>
      <AdminPageHeader
        badge="Overview"
        title="Admin CMS"
        description="Manage page content, portfolio projects, and publishing state from one dashboard."
        actions={
          <Button asChild>
            <Link href="/admin/portfolio/projects">
              Open projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        }
      />

      {loadError ? (
        <AdminInfoPanel tone="error" className="mt-6">
          {loadError}
        </AdminInfoPanel>
      ) : null}

      {isLoading ? (
        <AdminInfoPanel className="mt-6">Loading admin overview...</AdminInfoPanel>
      ) : (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total projects</CardDescription>
                <CardTitle className="text-3xl">{projectSummary.total}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2 pt-0">
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Portfolio manager</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Published</CardDescription>
                <CardTitle className="text-3xl">{projectSummary.published}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge>Live on site</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Draft</CardDescription>
                <CardTitle className="text-3xl">{projectSummary.draft}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge variant="secondary">Pending publish</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {dashboardPages.map((page) => {
              const summary = summaries[page.key]
              return (
                <Card key={page.key} className="flex h-full flex-col border-border/80 bg-card/80">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {page.key === "home" ? (
                        <PanelsTopLeft className="h-4 w-4 text-muted-foreground" />
                      ) : page.key === "settings" ? (
                        <Settings className="h-4 w-4 text-muted-foreground" />
                      ) : page.key === "contact" ? (
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <PencilRuler className="h-4 w-4 text-muted-foreground" />
                      )}
                      {page.name}
                    </CardTitle>
                    <CardDescription>{page.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Sections</span>
                      <span className="font-medium text-foreground">{summary.count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last updated</span>
                      <span className="text-right">{formatTimestamp(summary.lastUpdated)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button asChild variant="outline">
                      <Link href={page.href}>Manage content</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </AdminPageShell>
  )
}
