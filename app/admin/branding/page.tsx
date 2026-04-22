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
  brandingPageDefaults,
  brandingSectionOrder,
  mergeBrandingContent,
  type BrandingPageContent,
  type BrandingPageSectionKey,
} from "@/lib/content/branding"

type SaveState = {
  isSaving: boolean
  message: string | null
  error: string | null
}

const createInitialSaveState = (): Record<BrandingPageSectionKey, SaveState> =>
  brandingSectionOrder.reduce(
    (acc, section) => {
      acc[section] = {
        isSaving: false,
        message: null,
        error: null,
      }
      return acc
    },
    {} as Record<BrandingPageSectionKey, SaveState>,
  )

const updateListItem = <T,>(list: T[], index: number, value: T): T[] => {
  const next = [...list]
  next[index] = value
  return next
}

export default function AdminBrandingEditor() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [content, setContent] = useState<BrandingPageContent>(brandingPageDefaults)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveStates, setSaveStates] = useState<Record<BrandingPageSectionKey, SaveState>>(
    () => createInitialSaveState(),
  )

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true)
      setLoadError(null)

      const { data, error } = await supabase
        .from("site_content")
        .select("section, content")
        .eq("page", "branding")

      if (error) {
        setLoadError(error.message || "Unable to load branding content.")
        setIsLoading(false)
        return
      }

      setContent(mergeBrandingContent(data ?? []))
      setIsLoading(false)
    }

    void loadContent()
  }, [supabase])

  const updateSection = <K extends BrandingPageSectionKey>(
    section: K,
    updater: (prev: BrandingPageContent[K]) => BrandingPageContent[K],
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: updater(prev[section]),
    }))
  }

  const setSectionState = (section: BrandingPageSectionKey, partial: Partial<SaveState>) => {
    setSaveStates((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...partial,
      },
    }))
  }

  const saveSection = async (section: BrandingPageSectionKey) => {
    setSectionState(section, { isSaving: true, message: null, error: null })
    const payload = content[section]
    const sortOrder = brandingSectionOrder.indexOf(section)

    const { data: existing, error: fetchError } = await supabase
      .from("site_content")
      .select("id")
      .eq("page", "branding")
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
      page: "branding",
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
          <h1 className="mt-2 text-3xl font-semibold text-foreground">Branding content</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Edit branding page sections. Changes publish immediately after saving.
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
          Loading branding content...
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Hero</CardTitle>
              <CardDescription>Hero copy, background image, and breadcrumb labels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="branding-hero-title">Title</Label>
                  <Input
                    id="branding-hero-title"
                    value={content.hero.title}
                    onChange={(event) =>
                      updateSection("hero", (prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branding-hero-breadcrumb-home">Breadcrumb home label</Label>
                  <Input
                    id="branding-hero-breadcrumb-home"
                    value={content.hero.breadcrumbHomeLabel}
                    onChange={(event) =>
                      updateSection("hero", (prev) => ({
                        ...prev,
                        breadcrumbHomeLabel: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="branding-hero-subtitle">Subtitle</Label>
                  <Textarea
                    id="branding-hero-subtitle"
                    value={content.hero.subtitle}
                    onChange={(event) =>
                      updateSection("hero", (prev) => ({
                        ...prev,
                        subtitle: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branding-hero-breadcrumb-current">Breadcrumb current label</Label>
                  <Input
                    id="branding-hero-breadcrumb-current"
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
              <div className="grid gap-4 md:grid-cols-2">
                <ImageUpload
                  label="Hero background image"
                  value={{
                    src: content.hero.backgroundImage.src,
                    path: content.hero.backgroundImage.path ?? null,
                  }}
                  onChange={(nextValue) =>
                    updateSection("hero", (prev) => ({
                      ...prev,
                      backgroundImage: {
                        ...prev.backgroundImage,
                        src: nextValue.src,
                        path: nextValue.path ?? null,
                      },
                    }))
                  }
                />
                <div className="space-y-2">
                  <Label htmlFor="branding-hero-bg-alt">Background alt text</Label>
                  <Input
                    id="branding-hero-bg-alt"
                    value={content.hero.backgroundImage.alt}
                    onChange={(event) =>
                      updateSection("hero", (prev) => ({
                        ...prev,
                        backgroundImage: {
                          ...prev.backgroundImage,
                          alt: event.target.value,
                        },
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
              <CardTitle>Intro</CardTitle>
              <CardDescription>Intro headline and supporting paragraph.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branding-intro-title">Title</Label>
                <Input
                  id="branding-intro-title"
                  value={content.intro.title}
                  onChange={(event) =>
                    updateSection("intro", (prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branding-intro-body">Body</Label>
                <Textarea
                  id="branding-intro-body"
                  value={content.intro.body}
                  onChange={(event) =>
                    updateSection("intro", (prev) => ({
                      ...prev,
                      body: event.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Button onClick={() => saveSection("intro")} disabled={saveStates.intro.isSaving}>
                {saveStates.intro.isSaving ? "Saving..." : "Save intro"}
              </Button>
              {saveStates.intro.error ? (
                <span className="text-sm text-destructive">{saveStates.intro.error}</span>
              ) : null}
              {saveStates.intro.message ? (
                <span className="text-sm text-emerald-600">{saveStates.intro.message}</span>
              ) : null}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>Service cards, features, and images.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="branding-services-title">Title</Label>
                  <Input
                    id="branding-services-title"
                    value={content.services.title}
                    onChange={(event) =>
                      updateSection("services", (prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branding-services-subtitle">Subtitle</Label>
                  <Input
                    id="branding-services-subtitle"
                    value={content.services.subtitle}
                    onChange={(event) =>
                      updateSection("services", (prev) => ({
                        ...prev,
                        subtitle: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                {content.services.items.map((service, index) => (
                  <div key={`branding-service-${index}`} className="space-y-4 rounded-lg border border-border p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`branding-service-title-${index}`}>Service title</Label>
                        <Input
                          id={`branding-service-title-${index}`}
                          value={service.title}
                          onChange={(event) =>
                            updateSection("services", (prev) => ({
                              ...prev,
                              items: updateListItem(prev.items, index, {
                                ...service,
                                title: event.target.value,
                              }),
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`branding-service-description-${index}`}>Description</Label>
                        <Textarea
                          id={`branding-service-description-${index}`}
                          value={service.description}
                          onChange={(event) =>
                            updateSection("services", (prev) => ({
                              ...prev,
                              items: updateListItem(prev.items, index, {
                                ...service,
                                description: event.target.value,
                              }),
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label>Features</Label>
                      <div className="grid gap-3 md:grid-cols-2">
                        {service.features.map((feature, featureIndex) => (
                          <Input
                            key={`branding-service-${index}-feature-${featureIndex}`}
                            value={feature}
                            onChange={(event) =>
                              updateSection("services", (prev) => ({
                                ...prev,
                                items: updateListItem(prev.items, index, {
                                  ...service,
                                  features: updateListItem(
                                    service.features,
                                    featureIndex,
                                    event.target.value,
                                  ),
                                }),
                              }))
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <ImageUpload
                        label="Service image"
                        value={{
                          src: service.image.src,
                          path: service.image.path ?? null,
                        }}
                        onChange={(nextValue) =>
                          updateSection("services", (prev) => ({
                            ...prev,
                            items: updateListItem(prev.items, index, {
                              ...service,
                              image: {
                                ...service.image,
                                src: nextValue.src,
                                path: nextValue.path ?? null,
                              },
                            }),
                          }))
                        }
                      />
                      <div className="space-y-2">
                        <Label htmlFor={`branding-service-image-alt-${index}`}>Image alt text</Label>
                        <Input
                          id={`branding-service-image-alt-${index}`}
                          value={service.image.alt}
                          onChange={(event) =>
                            updateSection("services", (prev) => ({
                              ...prev,
                              items: updateListItem(prev.items, index, {
                                ...service,
                                image: {
                                  ...service.image,
                                  alt: event.target.value,
                                },
                              }),
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Button onClick={() => saveSection("services")} disabled={saveStates.services.isSaving}>
                {saveStates.services.isSaving ? "Saving..." : "Save services"}
              </Button>
              {saveStates.services.error ? (
                <span className="text-sm text-destructive">{saveStates.services.error}</span>
              ) : null}
              {saveStates.services.message ? (
                <span className="text-sm text-emerald-600">{saveStates.services.message}</span>
              ) : null}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CTA</CardTitle>
              <CardDescription>Call-to-action copy above the contact form.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="branding-cta-title">Title</Label>
                  <Input
                    id="branding-cta-title"
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
                  <Label htmlFor="branding-cta-subtitle">Subtitle</Label>
                  <Input
                    id="branding-cta-subtitle"
                    value={content.cta.subtitle}
                    onChange={(event) =>
                      updateSection("cta", (prev) => ({
                        ...prev,
                        subtitle: event.target.value,
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

          <Card>
            <CardHeader>
              <CardTitle>Cross-links</CardTitle>
              <CardDescription>Other expertise cards at the bottom.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="branding-crosslinks-title">Section title</Label>
                <Input
                  id="branding-crosslinks-title"
                  value={content.crossLinks.title}
                  onChange={(event) =>
                    updateSection("crossLinks", (prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-4">
                {content.crossLinks.cards.map((card, index) => (
                  <div key={`branding-crosslink-${index}`} className="space-y-3 rounded-lg border border-border p-4">
                    <div className="space-y-2">
                      <Label htmlFor={`branding-crosslink-title-${index}`}>Card title</Label>
                      <Input
                        id={`branding-crosslink-title-${index}`}
                        value={card.title}
                        onChange={(event) =>
                          updateSection("crossLinks", (prev) => ({
                            ...prev,
                            cards: updateListItem(prev.cards, index, {
                              ...card,
                              title: event.target.value,
                            }),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`branding-crosslink-description-${index}`}>Description</Label>
                      <Textarea
                        id={`branding-crosslink-description-${index}`}
                        value={card.description}
                        onChange={(event) =>
                          updateSection("crossLinks", (prev) => ({
                            ...prev,
                            cards: updateListItem(prev.cards, index, {
                              ...card,
                              description: event.target.value,
                            }),
                          }))
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Button onClick={() => saveSection("crossLinks")} disabled={saveStates.crossLinks.isSaving}>
                {saveStates.crossLinks.isSaving ? "Saving..." : "Save cross-links"}
              </Button>
              {saveStates.crossLinks.error ? (
                <span className="text-sm text-destructive">{saveStates.crossLinks.error}</span>
              ) : null}
              {saveStates.crossLinks.message ? (
                <span className="text-sm text-emerald-600">{saveStates.crossLinks.message}</span>
              ) : null}
            </CardFooter>
          </Card>
        </div>
      )}
    </section>
  )
}
