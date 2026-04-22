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
  architecturePageDefaults,
  architectureSectionOrder,
  mergeArchitectureContent,
  type ArchitecturePageContent,
  type ArchitecturePageSectionKey,
} from "@/lib/content/architecture"

type SaveState = {
  isSaving: boolean
  message: string | null
  error: string | null
}

const createInitialSaveState = (): Record<ArchitecturePageSectionKey, SaveState> =>
  architectureSectionOrder.reduce(
    (acc, section) => {
      acc[section] = {
        isSaving: false,
        message: null,
        error: null,
      }
      return acc
    },
    {} as Record<ArchitecturePageSectionKey, SaveState>,
  )

const updateListItem = <T,>(list: T[], index: number, value: T): T[] => {
  const next = [...list]
  next[index] = value
  return next
}

export default function AdminArchitectureEditor() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [content, setContent] = useState<ArchitecturePageContent>(architecturePageDefaults)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveStates, setSaveStates] = useState<Record<ArchitecturePageSectionKey, SaveState>>(
    () => createInitialSaveState(),
  )

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true)
      setLoadError(null)

      const { data, error } = await supabase
        .from("site_content")
        .select("section, content")
        .eq("page", "architecture")

      if (error) {
        setLoadError(error.message || "Unable to load architecture content.")
        setIsLoading(false)
        return
      }

      setContent(mergeArchitectureContent(data ?? []))
      setIsLoading(false)
    }

    void loadContent()
  }, [supabase])

  const updateSection = <K extends ArchitecturePageSectionKey>(
    section: K,
    updater: (prev: ArchitecturePageContent[K]) => ArchitecturePageContent[K],
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: updater(prev[section]),
    }))
  }

  const setSectionState = (section: ArchitecturePageSectionKey, partial: Partial<SaveState>) => {
    setSaveStates((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...partial,
      },
    }))
  }

  const saveSection = async (section: ArchitecturePageSectionKey) => {
    setSectionState(section, { isSaving: true, message: null, error: null })
    const payload = content[section]
    const sortOrder = architectureSectionOrder.indexOf(section)

    const { data: existing, error: fetchError } = await supabase
      .from("site_content")
      .select("id")
      .eq("page", "architecture")
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
      page: "architecture",
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
          <h1 className="mt-2 text-3xl font-semibold text-foreground">Architecture content</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Edit architecture page sections. Changes publish immediately after saving.
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
          Loading architecture content...
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
                  <Label htmlFor="architecture-hero-title">Title</Label>
                  <Input
                    id="architecture-hero-title"
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
                  <Label htmlFor="architecture-hero-breadcrumb-home">Breadcrumb home label</Label>
                  <Input
                    id="architecture-hero-breadcrumb-home"
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
                  <Label htmlFor="architecture-hero-subtitle">Subtitle</Label>
                  <Textarea
                    id="architecture-hero-subtitle"
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
                  <Label htmlFor="architecture-hero-breadcrumb-current">Breadcrumb current label</Label>
                  <Input
                    id="architecture-hero-breadcrumb-current"
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
                  <Label htmlFor="architecture-hero-bg-alt">Background alt text</Label>
                  <Input
                    id="architecture-hero-bg-alt"
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
                <Label htmlFor="architecture-intro-title">Title</Label>
                <Input
                  id="architecture-intro-title"
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
                <Label htmlFor="architecture-intro-body">Body</Label>
                <Textarea
                  id="architecture-intro-body"
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
                  <Label htmlFor="architecture-services-title">Title</Label>
                  <Input
                    id="architecture-services-title"
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
                  <Label htmlFor="architecture-services-subtitle">Subtitle</Label>
                  <Input
                    id="architecture-services-subtitle"
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
                  <div key={`architecture-service-${index}`} className="space-y-4 rounded-lg border border-border p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`architecture-service-title-${index}`}>Service title</Label>
                        <Input
                          id={`architecture-service-title-${index}`}
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
                        <Label htmlFor={`architecture-service-description-${index}`}>Description</Label>
                        <Textarea
                          id={`architecture-service-description-${index}`}
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
                            key={`architecture-service-${index}-feature-${featureIndex}`}
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
                        <Label htmlFor={`architecture-service-image-alt-${index}`}>Image alt text</Label>
                        <Input
                          id={`architecture-service-image-alt-${index}`}
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
              <CardTitle>Process</CardTitle>
              <CardDescription>Step labels and descriptions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="architecture-process-title">Title</Label>
                  <Input
                    id="architecture-process-title"
                    value={content.process.title}
                    onChange={(event) =>
                      updateSection("process", (prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="architecture-process-subtitle">Subtitle</Label>
                  <Input
                    id="architecture-process-subtitle"
                    value={content.process.subtitle}
                    onChange={(event) =>
                      updateSection("process", (prev) => ({
                        ...prev,
                        subtitle: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                {content.process.steps.map((step, index) => (
                  <div key={`architecture-process-${index}`} className="space-y-3 rounded-lg border border-border p-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`architecture-process-step-${index}`}>Step</Label>
                        <Input
                          id={`architecture-process-step-${index}`}
                          value={step.step}
                          onChange={(event) =>
                            updateSection("process", (prev) => ({
                              ...prev,
                              steps: updateListItem(prev.steps, index, {
                                ...step,
                                step: event.target.value,
                              }),
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`architecture-process-title-${index}`}>Title</Label>
                        <Input
                          id={`architecture-process-title-${index}`}
                          value={step.title}
                          onChange={(event) =>
                            updateSection("process", (prev) => ({
                              ...prev,
                              steps: updateListItem(prev.steps, index, {
                                ...step,
                                title: event.target.value,
                              }),
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`architecture-process-description-${index}`}>Description</Label>
                      <Textarea
                        id={`architecture-process-description-${index}`}
                        value={step.description}
                        onChange={(event) =>
                          updateSection("process", (prev) => ({
                            ...prev,
                            steps: updateListItem(prev.steps, index, {
                              ...step,
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
              <Button onClick={() => saveSection("process")} disabled={saveStates.process.isSaving}>
                {saveStates.process.isSaving ? "Saving..." : "Save process"}
              </Button>
              {saveStates.process.error ? (
                <span className="text-sm text-destructive">{saveStates.process.error}</span>
              ) : null}
              {saveStates.process.message ? (
                <span className="text-sm text-emerald-600">{saveStates.process.message}</span>
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
                  <Label htmlFor="architecture-cta-title">Title</Label>
                  <Input
                    id="architecture-cta-title"
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
                  <Label htmlFor="architecture-cta-subtitle">Subtitle</Label>
                  <Input
                    id="architecture-cta-subtitle"
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
                <Label htmlFor="architecture-crosslinks-title">Section title</Label>
                <Input
                  id="architecture-crosslinks-title"
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
                  <div key={`architecture-crosslink-${index}`} className="space-y-3 rounded-lg border border-border p-4">
                    <div className="space-y-2">
                      <Label htmlFor={`architecture-crosslink-title-${index}`}>Card title</Label>
                      <Input
                        id={`architecture-crosslink-title-${index}`}
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
                      <Label htmlFor={`architecture-crosslink-description-${index}`}>Description</Label>
                      <Textarea
                        id={`architecture-crosslink-description-${index}`}
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
