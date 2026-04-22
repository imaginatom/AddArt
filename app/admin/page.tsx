"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type AdminPageKey = "home" | "portfolio" | "architecture" | "branding"

type PageSummary = {
  count: number
  lastUpdated: string | null
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
    description: "Hero copy, gallery filters, projects, and CTA messaging.",
    href: "/admin/portfolio",
  },
  {
    key: "architecture",
    name: "Architecture",
    description: "Hero, services, process steps, and page CTAs.",
    href: "/admin/architecture",
  },
  {
    key: "branding",
    name: "Branding",
    description: "Hero, services, and cross-link content blocks.",
    href: "/admin/branding",
  },
]

const createInitialSummaries = (): Record<AdminPageKey, PageSummary> => ({
  home: { count: 0, lastUpdated: null },
  portfolio: { count: 0, lastUpdated: null },
  architecture: { count: 0, lastUpdated: null },
  branding: { count: 0, lastUpdated: null },
})

const formatTimestamp = (value: string | null) =>
  value ? new Date(value).toLocaleString() : "No updates yet"

export default function AdminIndexPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [summaries, setSummaries] = useState<Record<AdminPageKey, PageSummary>>(
    () => createInitialSummaries(),
  )
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const loadSummaries = async () => {
      setIsLoading(true)
      setLoadError(null)

      const { data, error } = await supabase
        .from("site_content")
        .select("page, updated_at")
        .in(
          "page",
          dashboardPages.map((page) => page.key),
        )

      if (error) {
        setLoadError(error.message || "Unable to load admin overview.")
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
      setIsLoading(false)
    }

    void loadSummaries()
  }, [supabase])

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-14">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground">Admin CMS</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage core page content, monitor section counts, and jump into page editors.
        </p>
      </div>

      {loadError ? (
        <div className="mt-8 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {loadError}
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-10 rounded-lg border border-border bg-card px-4 py-6 text-sm text-muted-foreground">
          Loading admin overview...
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {dashboardPages.map((page) => {
            const summary = summaries[page.key]
            return (
              <Card key={page.key} className="flex h-full flex-col">
                <CardHeader>
                  <CardTitle>{page.name}</CardTitle>
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
                  <Button asChild>
                    <Link href={page.href}>Manage content</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}
