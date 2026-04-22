"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/admin/image-upload"
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

const updateListItem = <T,>(list: T[], index: number, value: T): T[] => {
  const next = [...list]
  next[index] = value
  return next
}

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
    <section className="mx-auto w-full max-w-5xl px-4 py-14">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Admin CMS</p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground">Portfolio content</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Edit portfolio hero copy, gallery projects, and CTA messaging.
          </p>
        </div>
      </div>

      {loadError ? (
        <div className="mt-8 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {loadError}
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-10 rounded-lg border border-border bg-card px-4 py-6 text-sm text-muted-foreground">
          Loading portfolio content...
        </div>
      ) : (
        <div className="mt-10 space-y-8">
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
              <CardTitle>Gallery</CardTitle>
              <CardDescription>Filter categories and portfolio projects.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Categories</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {content.gallery.categories.map((category, index) => (
                    <Input
                      key={`portfolio-category-${index}`}
                      value={category}
                      onChange={(event) =>
                        updateSection("gallery", (prev) => ({
                          ...prev,
                          categories: updateListItem(prev.categories, index, event.target.value),
                        }))
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {content.gallery.projects.map((project, index) => (
                  <div key={`portfolio-project-${index}`} className="space-y-4 rounded-lg border border-border p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`portfolio-project-title-${index}`}>Project title</Label>
                          <Input
                            id={`portfolio-project-title-${index}`}
                            value={project.title}
                            onChange={(event) =>
                              updateSection("gallery", (prev) => ({
                                ...prev,
                                projects: updateListItem(prev.projects, index, {
                                  ...project,
                                  title: event.target.value,
                                }),
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`portfolio-project-location-${index}`}>Location</Label>
                          <Input
                            id={`portfolio-project-location-${index}`}
                            value={project.location}
                            onChange={(event) =>
                              updateSection("gallery", (prev) => ({
                                ...prev,
                                projects: updateListItem(prev.projects, index, {
                                  ...project,
                                  location: event.target.value,
                                }),
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`portfolio-project-category-${index}`}>Category</Label>
                          <Input
                            id={`portfolio-project-category-${index}`}
                            value={project.category}
                            onChange={(event) =>
                              updateSection("gallery", (prev) => ({
                                ...prev,
                                projects: updateListItem(prev.projects, index, {
                                  ...project,
                                  category: event.target.value,
                                }),
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`portfolio-project-image-alt-${index}`}>Image alt text</Label>
                          <Input
                            id={`portfolio-project-image-alt-${index}`}
                            value={project.image.alt}
                            onChange={(event) =>
                              updateSection("gallery", (prev) => ({
                                ...prev,
                                projects: updateListItem(prev.projects, index, {
                                  ...project,
                                  image: {
                                    ...project.image,
                                    alt: event.target.value,
                                  },
                                }),
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`portfolio-project-description-${index}`}>Description</Label>
                        <Textarea
                          id={`portfolio-project-description-${index}`}
                          value={project.description}
                          onChange={(event) =>
                            updateSection("gallery", (prev) => ({
                              ...prev,
                              projects: updateListItem(prev.projects, index, {
                                ...project,
                                description: event.target.value,
                              }),
                            }))
                          }
                        />
                      </div>
                      <ImageUpload
                        label="Project image"
                        value={{
                          src: project.image.src,
                          path: project.image.path ?? null,
                        }}
                        onChange={(nextValue) =>
                          updateSection("gallery", (prev) => ({
                            ...prev,
                            projects: updateListItem(prev.projects, index, {
                              ...project,
                              image: {
                                ...project.image,
                                src: nextValue.src,
                                path: nextValue.path ?? null,
                              },
                            }),
                          }))
                        }
                      />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Button onClick={() => saveSection("gallery")} disabled={saveStates.gallery.isSaving}>
                {saveStates.gallery.isSaving ? "Saving..." : "Save gallery"}
              </Button>
              {saveStates.gallery.error ? (
                <span className="text-sm text-destructive">{saveStates.gallery.error}</span>
              ) : null}
              {saveStates.gallery.message ? (
                <span className="text-sm text-emerald-600">{saveStates.gallery.message}</span>
              ) : null}
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
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="portfolio-cta-email-label">Email button label</Label>
                  <Input
                    id="portfolio-cta-email-label"
                    value={content.cta.emailLabel}
                    onChange={(event) =>
                      updateSection("cta", (prev) => ({
                        ...prev,
                        emailLabel: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio-cta-email-address">Email address</Label>
                  <Input
                    id="portfolio-cta-email-address"
                    value={content.cta.emailAddress}
                    onChange={(event) =>
                      updateSection("cta", (prev) => ({
                        ...prev,
                        emailAddress: event.target.value,
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
    </section>
  )
}
