"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/admin/image-upload"
import { MediaUpload } from "@/components/admin/media-upload"
import { AdminInfoPanel, AdminPageHeader, AdminPageShell } from "@/components/admin/admin-ui"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import {
  homePageDefaults,
  homePageSectionOrder,
  mergeHomePageContent,
  type HomePageContent,
  type HomePageSectionKey,
} from "@/lib/content/homepage"

type SaveState = {
  isSaving: boolean
  message: string | null
  error: string | null
}

const createInitialSaveState = (): Record<HomePageSectionKey, SaveState> =>
  homePageSectionOrder.reduce(
    (acc, section) => {
      acc[section] = {
        isSaving: false,
        message: null,
        error: null,
      }
      return acc
    },
    {} as Record<HomePageSectionKey, SaveState>,
  )

const updateListItem = <T,>(list: T[], index: number, value: T): T[] => {
  const next = [...list]
  next[index] = value
  return next
}

export default function AdminHomepageEditor() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [content, setContent] = useState<HomePageContent>(homePageDefaults)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveStates, setSaveStates] = useState<Record<HomePageSectionKey, SaveState>>(
    () => createInitialSaveState(),
  )

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true)
      setLoadError(null)
      const { data, error } = await supabase
        .from("site_content")
        .select("section, content")
        .eq("page", "home")

      if (error) {
        setLoadError(error.message || "Unable to load homepage content.")
        setIsLoading(false)
        return
      }

      setContent(mergeHomePageContent(data ?? []))
      setIsLoading(false)
    }

    void loadContent()
  }, [supabase])

  const updateSection = <K extends HomePageSectionKey>(
    section: K,
    updater: (prev: HomePageContent[K]) => HomePageContent[K],
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: updater(prev[section]),
    }))
  }

  const setSectionState = (
    section: HomePageSectionKey,
    partial: Partial<SaveState>,
  ) => {
    setSaveStates((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...partial,
      },
    }))
  }

  const saveSection = async (section: HomePageSectionKey) => {
    setSectionState(section, { isSaving: true, message: null, error: null })
    const payload = content[section]
    const sortOrder = homePageSectionOrder.indexOf(section)

    const { data: existing, error: fetchError } = await supabase
      .from("site_content")
      .select("id")
      .eq("page", "home")
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
      page: "home",
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
        badge="Homepage"
        title="Homepage content"
        description="Edit hero messaging, section copy, and list content. Changes publish immediately after saving."
      />

      {loadError ? (
        <AdminInfoPanel tone="error" className="mt-6">
          {loadError}
        </AdminInfoPanel>
      ) : null}

      {isLoading ? (
        <AdminInfoPanel className="mt-6">Loading homepage content...</AdminInfoPanel>
      ) : (
        <div className="mt-8 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Hero</CardTitle>
              <CardDescription>Primary headline, intro, and CTAs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hero-badge">Badge text</Label>
                  <Input
                    id="hero-badge"
                    value={content.hero.badgeText}
                    onChange={(event) =>
                      updateSection("hero", (prev) => ({
                        ...prev,
                        badgeText: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Headline</Label>
                  <Input
                    id="hero-title"
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
                <Label htmlFor="hero-subtitle">Intro paragraph</Label>
                <Textarea
                  id="hero-subtitle"
                  value={content.hero.subtitle}
                  onChange={(event) =>
                    updateSection("hero", (prev) => ({
                      ...prev,
                      subtitle: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-3">
                <Label>Trust bullets</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {content.hero.trustBullets.map((bullet, index) => (
                    <Input
                      key={`hero-bullet-${index}`}
                      value={bullet}
                      onChange={(event) =>
                        updateSection("hero", (prev) => ({
                          ...prev,
                          trustBullets: updateListItem(prev.trustBullets, index, event.target.value),
                        }))
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hero-cta-primary">Primary CTA label</Label>
                  <Input
                    id="hero-cta-primary"
                    value={content.hero.primaryCtaLabel}
                    onChange={(event) =>
                      updateSection("hero", (prev) => ({
                        ...prev,
                        primaryCtaLabel: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-cta-secondary">Secondary CTA label</Label>
                  <Input
                    id="hero-cta-secondary"
                    value={content.hero.secondaryCtaLabel}
                    onChange={(event) =>
                      updateSection("hero", (prev) => ({
                        ...prev,
                        secondaryCtaLabel: event.target.value,
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
                  <Label htmlFor="hero-bg-alt">Background alt text</Label>
                  <Input
                    id="hero-bg-alt"
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
              <Button
                onClick={() => saveSection("hero")}
                disabled={saveStates.hero.isSaving}
              >
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
              <CardTitle>Social proof</CardTitle>
              <CardDescription>Short stats under the hero.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.socialProof.stats.map((stat, index) => (
                <div key={`social-proof-${index}`} className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`social-proof-value-${index}`}>Value</Label>
                    <Input
                      id={`social-proof-value-${index}`}
                      value={stat.value}
                      onChange={(event) =>
                        updateSection("socialProof", (prev) => ({
                          ...prev,
                          stats: updateListItem(prev.stats, index, {
                            ...stat,
                            value: event.target.value,
                          }),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`social-proof-label-${index}`}>Label</Label>
                    <Input
                      id={`social-proof-label-${index}`}
                      value={stat.label}
                      onChange={(event) =>
                        updateSection("socialProof", (prev) => ({
                          ...prev,
                          stats: updateListItem(prev.stats, index, {
                            ...stat,
                            label: event.target.value,
                          }),
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Button
                onClick={() => saveSection("socialProof")}
                disabled={saveStates.socialProof.isSaving}
              >
                {saveStates.socialProof.isSaving ? "Saving..." : "Save social proof"}
              </Button>
              {saveStates.socialProof.error ? (
                <span className="text-sm text-destructive">{saveStates.socialProof.error}</span>
              ) : null}
              {saveStates.socialProof.message ? (
                <span className="text-sm text-emerald-600">{saveStates.socialProof.message}</span>
              ) : null}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>Service overview section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="services-eyebrow">Eyebrow</Label>
                  <Input
                    id="services-eyebrow"
                    value={content.services.eyebrow}
                    onChange={(event) =>
                      updateSection("services", (prev) => ({
                        ...prev,
                        eyebrow: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="services-title">Title</Label>
                  <Input
                    id="services-title"
                    value={content.services.title}
                    onChange={(event) =>
                      updateSection("services", (prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                {content.services.items.map((service, index) => (
                  <div key={`service-${index}`} className="space-y-3 rounded-lg border border-border p-4">
                    <div className="space-y-2">
                      <Label htmlFor={`service-title-${index}`}>Service title</Label>
                      <Input
                        id={`service-title-${index}`}
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
                      <Label htmlFor={`service-description-${index}`}>Description</Label>
                      <Textarea
                        id={`service-description-${index}`}
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
                    <MediaUpload
                      label={
                        index === 1
                          ? "Motion media (video)"
                          : index === 0
                            ? "Illustration media (image)"
                            : "Commandes sur-mesure media (image)"
                      }
                      kind={index === 1 ? "video" : "image"}
                      value={service.media}
                      onChange={(nextMedia) =>
                        updateSection("services", (prev) => ({
                          ...prev,
                          items: updateListItem(prev.items, index, {
                            ...service,
                            media: {
                              ...service.media,
                              ...nextMedia,
                              type: index === 1 ? "video" : "image",
                            },
                          }),
                        }))
                      }
                      helperText={
                        index === 1
                          ? "Upload MP4/WebM with transparent background if available."
                          : "Upload PNG/WebP (transparent background recommended)."
                      }
                    />
                    <div className="space-y-2">
                      <Label htmlFor={`service-media-alt-${index}`}>Media alt text</Label>
                      <Input
                        id={`service-media-alt-${index}`}
                        value={service.media.alt ?? ""}
                        onChange={(event) =>
                          updateSection("services", (prev) => ({
                            ...prev,
                            items: updateListItem(prev.items, index, {
                              ...service,
                              media: {
                                ...service.media,
                                alt: event.target.value,
                              },
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
              <Button
                onClick={() => saveSection("services")}
                disabled={saveStates.services.isSaving}
              >
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
              <CardTitle>Act III · Manifeste</CardTitle>
              <CardDescription>
                Manifest section content used on homepage (benefits strip, badge, and manifesto CTA).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="whyus-badge-value">Manifest badge value</Label>
                  <Input
                    id="whyus-badge-value"
                    value={content.whyUs.floatingBadge.value}
                    onChange={(event) =>
                      updateSection("whyUs", (prev) => ({
                        ...prev,
                        floatingBadge: {
                          ...prev.floatingBadge,
                          value: event.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whyus-badge-label">Manifest badge label</Label>
                  <Input
                    id="whyus-badge-label"
                    value={content.whyUs.floatingBadge.label}
                    onChange={(event) =>
                      updateSection("whyUs", (prev) => ({
                        ...prev,
                        floatingBadge: {
                          ...prev.floatingBadge,
                          label: event.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                {content.whyUs.benefits.map((benefit, index) => (
                  <div key={`whyus-benefit-${index}`} className="space-y-3 rounded-lg border border-border p-4">
                    <div className="space-y-2">
                      <Label htmlFor={`whyus-benefit-title-${index}`}>Benefit title</Label>
                      <Input
                        id={`whyus-benefit-title-${index}`}
                        value={benefit.title}
                        onChange={(event) =>
                          updateSection("whyUs", (prev) => ({
                            ...prev,
                            benefits: updateListItem(prev.benefits, index, {
                              ...benefit,
                              title: event.target.value,
                            }),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`whyus-benefit-description-${index}`}>Description</Label>
                      <Textarea
                        id={`whyus-benefit-description-${index}`}
                        value={benefit.description}
                        onChange={(event) =>
                          updateSection("whyUs", (prev) => ({
                            ...prev,
                            benefits: updateListItem(prev.benefits, index, {
                              ...benefit,
                              description: event.target.value,
                            }),
                          }))
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="whyus-cta">Manifest CTA label</Label>
                <Input
                  id="whyus-cta"
                  value={content.whyUs.ctaLabel}
                  onChange={(event) =>
                    updateSection("whyUs", (prev) => ({
                      ...prev,
                      ctaLabel: event.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Button
                onClick={() => saveSection("whyUs")}
                disabled={saveStates.whyUs.isSaving}
              >
                {saveStates.whyUs.isSaving ? "Saving..." : "Save manifesto"}
              </Button>
              {saveStates.whyUs.error ? (
                <span className="text-sm text-destructive">{saveStates.whyUs.error}</span>
              ) : null}
              {saveStates.whyUs.message ? (
                <span className="text-sm text-emerald-600">{saveStates.whyUs.message}</span>
              ) : null}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testimonials</CardTitle>
              <CardDescription>Client feedback carousel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="testimonials-eyebrow">Eyebrow</Label>
                  <Input
                    id="testimonials-eyebrow"
                    value={content.testimonials.eyebrow}
                    onChange={(event) =>
                      updateSection("testimonials", (prev) => ({
                        ...prev,
                        eyebrow: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testimonials-title">Title</Label>
                  <Input
                    id="testimonials-title"
                    value={content.testimonials.title}
                    onChange={(event) =>
                      updateSection("testimonials", (prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                {content.testimonials.items.map((testimonial, index) => (
                  <div key={`testimonial-${index}`} className="space-y-3 rounded-lg border border-border p-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`testimonial-name-${index}`}>Name</Label>
                        <Input
                          id={`testimonial-name-${index}`}
                          value={testimonial.name}
                          onChange={(event) =>
                            updateSection("testimonials", (prev) => ({
                              ...prev,
                              items: updateListItem(prev.items, index, {
                                ...testimonial,
                                name: event.target.value,
                              }),
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`testimonial-city-${index}`}>City</Label>
                        <Input
                          id={`testimonial-city-${index}`}
                          value={testimonial.city}
                          onChange={(event) =>
                            updateSection("testimonials", (prev) => ({
                              ...prev,
                              items: updateListItem(prev.items, index, {
                                ...testimonial,
                                city: event.target.value,
                              }),
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`testimonial-stars-${index}`}>Stars (1-5)</Label>
                        <Input
                          id={`testimonial-stars-${index}`}
                          type="number"
                          min={1}
                          max={5}
                          value={testimonial.stars}
                          onChange={(event) => {
                            const parsed = Number(event.target.value)
                            updateSection("testimonials", (prev) => ({
                              ...prev,
                              items: updateListItem(prev.items, index, {
                                ...testimonial,
                                stars: Number.isNaN(parsed) ? 5 : Math.min(5, Math.max(1, parsed)),
                              }),
                            }))
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`testimonial-text-${index}`}>Quote</Label>
                      <Textarea
                        id={`testimonial-text-${index}`}
                        value={testimonial.text}
                        onChange={(event) =>
                          updateSection("testimonials", (prev) => ({
                            ...prev,
                            items: updateListItem(prev.items, index, {
                              ...testimonial,
                              text: event.target.value,
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
              <Button
                onClick={() => saveSection("testimonials")}
                disabled={saveStates.testimonials.isSaving}
              >
                {saveStates.testimonials.isSaving ? "Saving..." : "Save testimonials"}
              </Button>
              {saveStates.testimonials.error ? (
                <span className="text-sm text-destructive">{saveStates.testimonials.error}</span>
              ) : null}
              {saveStates.testimonials.message ? (
                <span className="text-sm text-emerald-600">{saveStates.testimonials.message}</span>
              ) : null}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery preview copy</CardTitle>
              <CardDescription>Headline and CTA for the portfolio preview.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gallery-preview-eyebrow">Eyebrow</Label>
                  <Input
                    id="gallery-preview-eyebrow"
                    value={content.galleryPreview.eyebrow}
                    onChange={(event) =>
                      updateSection("galleryPreview", (prev) => ({
                        ...prev,
                        eyebrow: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gallery-preview-title">Title</Label>
                  <Input
                    id="gallery-preview-title"
                    value={content.galleryPreview.title}
                    onChange={(event) =>
                      updateSection("galleryPreview", (prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gallery-preview-subtitle">Subtitle</Label>
                  <Textarea
                    id="gallery-preview-subtitle"
                    value={content.galleryPreview.subtitle}
                    onChange={(event) =>
                      updateSection("galleryPreview", (prev) => ({
                        ...prev,
                        subtitle: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gallery-preview-cta">CTA label</Label>
                  <Input
                    id="gallery-preview-cta"
                    value={content.galleryPreview.ctaLabel}
                    onChange={(event) =>
                      updateSection("galleryPreview", (prev) => ({
                        ...prev,
                        ctaLabel: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Button
                onClick={() => saveSection("galleryPreview")}
                disabled={saveStates.galleryPreview.isSaving}
              >
                {saveStates.galleryPreview.isSaving ? "Saving..." : "Save gallery preview"}
              </Button>
              {saveStates.galleryPreview.error ? (
                <span className="text-sm text-destructive">{saveStates.galleryPreview.error}</span>
              ) : null}
              {saveStates.galleryPreview.message ? (
                <span className="text-sm text-emerald-600">{saveStates.galleryPreview.message}</span>
              ) : null}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Local SEO</CardTitle>
              <CardDescription>Location-focused copy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="localseo-eyebrow">Eyebrow</Label>
                  <Input
                    id="localseo-eyebrow"
                    value={content.localSeo.eyebrow}
                    onChange={(event) =>
                      updateSection("localSeo", (prev) => ({
                        ...prev,
                        eyebrow: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localseo-title">Title</Label>
                  <Input
                    id="localseo-title"
                    value={content.localSeo.title}
                    onChange={(event) =>
                      updateSection("localSeo", (prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="localseo-body">Body</Label>
                <Textarea
                  id="localseo-body"
                  value={content.localSeo.body}
                  onChange={(event) =>
                    updateSection("localSeo", (prev) => ({
                      ...prev,
                      body: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-4">
                {content.localSeo.highlights.map((highlight, index) => (
                  <div key={`localseo-highlight-${index}`} className="space-y-3 rounded-lg border border-border p-4">
                    <div className="space-y-2">
                      <Label htmlFor={`localseo-highlight-title-${index}`}>Highlight title</Label>
                      <Input
                        id={`localseo-highlight-title-${index}`}
                        value={highlight.title}
                        onChange={(event) =>
                          updateSection("localSeo", (prev) => ({
                            ...prev,
                            highlights: updateListItem(prev.highlights, index, {
                              ...highlight,
                              title: event.target.value,
                            }),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`localseo-highlight-description-${index}`}>Description</Label>
                      <Textarea
                        id={`localseo-highlight-description-${index}`}
                        value={highlight.description}
                        onChange={(event) =>
                          updateSection("localSeo", (prev) => ({
                            ...prev,
                            highlights: updateListItem(prev.highlights, index, {
                              ...highlight,
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
              <Button
                onClick={() => saveSection("localSeo")}
                disabled={saveStates.localSeo.isSaving}
              >
                {saveStates.localSeo.isSaving ? "Saving..." : "Save local SEO"}
              </Button>
              {saveStates.localSeo.error ? (
                <span className="text-sm text-destructive">{saveStates.localSeo.error}</span>
              ) : null}
              {saveStates.localSeo.message ? (
                <span className="text-sm text-emerald-600">{saveStates.localSeo.message}</span>
              ) : null}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact CTA</CardTitle>
              <CardDescription>Footer call-to-action copy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-title">Title</Label>
                  <Input
                    id="contact-title"
                    value={content.contactCta.title}
                    onChange={(event) =>
                      updateSection("contactCta", (prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-subtitle">Subtitle</Label>
                  <Input
                    id="contact-subtitle"
                    value={content.contactCta.subtitle}
                    onChange={(event) =>
                      updateSection("contactCta", (prev) => ({
                        ...prev,
                        subtitle: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Button
                onClick={() => saveSection("contactCta")}
                disabled={saveStates.contactCta.isSaving}
              >
                {saveStates.contactCta.isSaving ? "Saving..." : "Save contact CTA"}
              </Button>
              {saveStates.contactCta.error ? (
                <span className="text-sm text-destructive">{saveStates.contactCta.error}</span>
              ) : null}
              {saveStates.contactCta.message ? (
                <span className="text-sm text-emerald-600">{saveStates.contactCta.message}</span>
              ) : null}
            </CardFooter>
          </Card>
        </div>
      )}
    </AdminPageShell>
  )
}
