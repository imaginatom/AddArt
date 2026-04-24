"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AdminInfoPanel, AdminPageHeader, AdminPageShell } from "@/components/admin/admin-ui"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import {
  mergePortfolioContent,
  portfolioPageDefaults,
  portfolioSectionOrder,
  type PortfolioPageContent,
  type PortfolioPageSectionKey,
} from "@/lib/content/portfolio"

type SaveState = {
  isSaving: boolean
  message: string | null
  error: string | null
}

const createInitialSaveState = (): Record<PortfolioPageSectionKey, SaveState> =>
  portfolioSectionOrder.reduce(
    (acc, section) => {
      acc[section] = {
        isSaving: false,
        message: null,
        error: null,
      }
      return acc
    },
    {} as Record<PortfolioPageSectionKey, SaveState>,
  )

export default function AdminPortfolioEditor() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [content, setContent] = useState<PortfolioPageContent>(portfolioPageDefaults)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveStates, setSaveStates] = useState<Record<PortfolioPageSectionKey, SaveState>>(
    () => createInitialSaveState(),
  )

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true)
      setLoadError(null)

      const portfolioResult = await supabase
        .from("site_content")
        .select("section, content")
        .eq("page", "portfolio")

      if (portfolioResult.error) {
        setLoadError(portfolioResult.error.message || "Unable to load portfolio content.")
        setIsLoading(false)
        return
      }

      setContent(mergePortfolioContent(portfolioResult.data ?? []))
      setIsLoading(false)
    }

    void loadContent()
  }, [supabase])

  const updateSection = <K extends PortfolioPageSectionKey>(
    section: K,
    updater: (prev: PortfolioPageContent[K]) => PortfolioPageContent[K],
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: updater(prev[section]),
    }))
  }

  const setSectionState = (section: PortfolioPageSectionKey, partial: Partial<SaveState>) => {
    setSaveStates((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...partial,
      },
    }))
  }

  const saveSection = async (section: PortfolioPageSectionKey) => {
    setSectionState(section, { isSaving: true, message: null, error: null })
    const payload = content[section]
    const sortOrder = portfolioSectionOrder.indexOf(section)

    const { data: existing, error: fetchError } = await supabase
      .from("site_content")
      .select("id")
      .eq("page", "portfolio")
      .eq("section", section)
      .maybeSingle()

    if (fetchError) {
      setSectionState(section, {
        isSaving: false,
        error: fetchError.message || "Unable to fetch content entry.",
      })
      return
    }

    const upsertPayload = {
      page: "portfolio",
      section,
      content_type: "text",
      content: payload,
      sort_order: sortOrder,
    }

    const { error: saveError } = existing?.id
      ? await supabase.from("site_content").update(upsertPayload).eq("id", existing.id)
      : await supabase.from("site_content").insert(upsertPayload)

    if (saveError) {
      setSectionState(section, {
        isSaving: false,
        error: saveError.message || "Unable to save changes.",
      })
      return
    }

    setSectionState(section, {
      isSaving: false,
      message: "Saved successfully.",
    })
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        badge="Portfolio"
        title="Portfolio content"
        description="Manage the editorial copy for the portfolio route. Shared contact/email links come from Settings, while projects are managed in the dedicated manager."
        actions={
          <Button asChild>
            <Link href="/admin/portfolio/projects">Manage projects</Link>
          </Button>
        }
      />

      {loadError ? (
        <AdminInfoPanel tone="error" className="mt-6">
          {loadError}
        </AdminInfoPanel>
      ) : null}

      {isLoading ? (
        <AdminInfoPanel className="mt-6">Loading portfolio content...</AdminInfoPanel>
      ) : (
        <div className="mt-8 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Hero</CardTitle>
              <CardDescription>Header copy and breadcrumb labels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="portfolio-hero-eyebrow">Eyebrow</Label>
                  <Input
                    id="portfolio-hero-eyebrow"
                    value={content.hero.eyebrow}
                    onChange={(event) =>
                      updateSection("hero", (prev) => ({
                        ...prev,
                        eyebrow: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio-hero-title">Title</Label>
                  <Input
                    id="portfolio-hero-title"
                    value={content.hero.title}
                    onChange={(event) =>
                      updateSection("hero", (prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio-hero-subtitle">Subtitle</Label>
                <Textarea
                  id="portfolio-hero-subtitle"
                  value={content.hero.subtitle}
                  onChange={(event) =>
                    updateSection("hero", (prev) => ({
                      ...prev,
                      subtitle: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="portfolio-hero-breadcrumb-home">Breadcrumb home label</Label>
                  <Input
                    id="portfolio-hero-breadcrumb-home"
                    value={content.hero.breadcrumbHomeLabel}
                    onChange={(event) =>
                      updateSection("hero", (prev) => ({
                        ...prev,
                        breadcrumbHomeLabel: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio-hero-breadcrumb-current">Breadcrumb current label</Label>
                  <Input
                    id="portfolio-hero-breadcrumb-current"
                    value={content.hero.breadcrumbCurrentLabel}
                    onChange={(event) =>
                      updateSection("hero", (prev) => ({
                        ...prev,
                        breadcrumbCurrentLabel: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Button onClick={() => saveSection("hero")} disabled={saveStates.hero.isSaving}>
                {saveStates.hero.isSaving ? "Saving..." : "Save hero"}
              </Button>
              {saveStates.hero.error ? (
                <span className="text-sm text-destructive">{saveStates.hero.error}</span>
              ) : null}
              {saveStates.hero.message ? (
                <span className="text-sm text-emerald-600">{saveStates.hero.message}</span>
              ) : null}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects source</CardTitle>
              <CardDescription>
                Project records now come from the dedicated projects table.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use the projects manager to add, edit, delete, reorder, and publish portfolio items.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href="/admin/portfolio/projects">Open projects manager</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CTA</CardTitle>
              <CardDescription>Primary and secondary call-to-action content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="portfolio-cta-title">Title</Label>
                <Input
                  id="portfolio-cta-title"
                  value={content.cta.title}
                  onChange={(event) =>
                    updateSection("cta", (prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio-cta-subtitle">Subtitle</Label>
                <Textarea
                  id="portfolio-cta-subtitle"
                  value={content.cta.subtitle}
                  onChange={(event) =>
                    updateSection("cta", (prev) => ({
                      ...prev,
                      subtitle: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="portfolio-cta-primary-label">Primary CTA label</Label>
                  <Input
                    id="portfolio-cta-primary-label"
                    value={content.cta.primaryCtaLabel}
                    onChange={(event) =>
                      updateSection("cta", (prev) => ({
                        ...prev,
                        primaryCtaLabel: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio-cta-primary-href">Primary CTA link</Label>
                  <Input
                    id="portfolio-cta-primary-href"
                    value={content.cta.primaryCtaHref}
                    onChange={(event) =>
                      updateSection("cta", (prev) => ({
                        ...prev,
                        primaryCtaHref: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Button onClick={() => saveSection("cta")} disabled={saveStates.cta.isSaving}>
                {saveStates.cta.isSaving ? "Saving..." : "Save CTA"}
              </Button>
              {saveStates.cta.error ? (
                <span className="text-sm text-destructive">{saveStates.cta.error}</span>
              ) : null}
              {saveStates.cta.message ? (
                <span className="text-sm text-emerald-600">{saveStates.cta.message}</span>
              ) : null}
            </CardFooter>
          </Card>
        </div>
      )}
    </AdminPageShell>
  )
}
