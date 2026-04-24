"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AdminInfoPanel, AdminPageHeader, AdminPageShell } from "@/components/admin/admin-ui"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import {
  contactPageDefaults,
  contactSectionOrder,
  mergeContactContent,
  type ContactPageContent,
  type ContactPageSectionKey,
} from "@/lib/content/contact"

type SaveState = {
  isSaving: boolean
  message: string | null
  error: string | null
}

const createInitialSaveState = (): Record<ContactPageSectionKey, SaveState> =>
  contactSectionOrder.reduce(
    (acc, section) => {
      acc[section] = {
        isSaving: false,
        message: null,
        error: null,
      }
      return acc
    },
    {} as Record<ContactPageSectionKey, SaveState>,
  )

const updateListItem = <T,>(list: T[], index: number, value: T): T[] => {
  const next = [...list]
  next[index] = value
  return next
}

export default function AdminContactEditor() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [content, setContent] = useState<ContactPageContent>(contactPageDefaults)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveStates, setSaveStates] = useState<Record<ContactPageSectionKey, SaveState>>(
    () => createInitialSaveState(),
  )

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true)
      setLoadError(null)
      const { data, error } = await supabase
        .from("site_content")
        .select("section, content")
        .eq("page", "contact")

      if (error) {
        setLoadError(error.message || "Unable to load contact page content.")
        setIsLoading(false)
        return
      }

      setContent(mergeContactContent(data ?? []))
      setIsLoading(false)
    }

    void loadContent()
  }, [supabase])

  const updateSection = <K extends ContactPageSectionKey>(
    section: K,
    updater: (prev: ContactPageContent[K]) => ContactPageContent[K],
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: updater(prev[section]),
    }))
  }

  const setSectionState = (section: ContactPageSectionKey, partial: Partial<SaveState>) => {
    setSaveStates((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...partial,
      },
    }))
  }

  const saveSection = async (section: ContactPageSectionKey) => {
    setSectionState(section, { isSaving: true, message: null, error: null })
    const payload = content[section]
    const sortOrder = contactSectionOrder.indexOf(section)

    const { data: existing, error: fetchError } = await supabase
      .from("site_content")
      .select("id")
      .eq("page", "contact")
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
      page: "contact",
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
        badge="Contact"
        title="Contact page content"
        description="Manage contact-page copy blocks (hero, form intro, artist card, FAQ). Shared contact info is managed in Settings."
      />

      {loadError ? (
        <AdminInfoPanel tone="error" className="mt-6">
          {loadError}
        </AdminInfoPanel>
      ) : null}

      {isLoading ? (
        <AdminInfoPanel className="mt-6">Loading contact page content...</AdminInfoPanel>
      ) : (
        <div className="mt-8 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Hero</CardTitle>
              <CardDescription>Top title block of the contact page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-hero-eyebrow">Eyebrow</Label>
                  <Input
                    id="contact-hero-eyebrow"
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
                  <Label htmlFor="contact-hero-title">Title</Label>
                  <Input
                    id="contact-hero-title"
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
                <Label htmlFor="contact-hero-subtitle">Subtitle</Label>
                <Textarea
                  id="contact-hero-subtitle"
                  value={content.hero.subtitle}
                  onChange={(event) =>
                    updateSection("hero", (prev) => ({
                      ...prev,
                      subtitle: event.target.value,
                    }))
                  }
                />
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
              <CardTitle>Form intro</CardTitle>
              <CardDescription>Title and subtitle above the contact form.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-form-title">Title</Label>
                <Input
                  id="contact-form-title"
                  value={content.form.title}
                  onChange={(event) =>
                    updateSection("form", (prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-form-subtitle">Subtitle</Label>
                <Textarea
                  id="contact-form-subtitle"
                  value={content.form.subtitle}
                  onChange={(event) =>
                    updateSection("form", (prev) => ({
                      ...prev,
                      subtitle: event.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Button onClick={() => saveSection("form")} disabled={saveStates.form.isSaving}>
                {saveStates.form.isSaving ? "Saving..." : "Save form intro"}
              </Button>
              {saveStates.form.error ? (
                <span className="text-sm text-destructive">{saveStates.form.error}</span>
              ) : null}
              {saveStates.form.message ? (
                <span className="text-sm text-emerald-600">{saveStates.form.message}</span>
              ) : null}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Artist card</CardTitle>
              <CardDescription>Card copy displayed beside the contact form.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-artist-title">Card title</Label>
                <Input
                  id="contact-artist-title"
                  value={content.artist.title}
                  onChange={(event) =>
                    updateSection("artist", (prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-artist-name">Name</Label>
                  <Input
                    id="contact-artist-name"
                    value={content.artist.name}
                    onChange={(event) =>
                      updateSection("artist", (prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-artist-role">Role</Label>
                  <Input
                    id="contact-artist-role"
                    value={content.artist.role}
                    onChange={(event) =>
                      updateSection("artist", (prev) => ({
                        ...prev,
                        role: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-artist-bio">Bio</Label>
                <Textarea
                  id="contact-artist-bio"
                  value={content.artist.bio}
                  onChange={(event) =>
                    updateSection("artist", (prev) => ({
                      ...prev,
                      bio: event.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Button onClick={() => saveSection("artist")} disabled={saveStates.artist.isSaving}>
                {saveStates.artist.isSaving ? "Saving..." : "Save artist card"}
              </Button>
              {saveStates.artist.error ? (
                <span className="text-sm text-destructive">{saveStates.artist.error}</span>
              ) : null}
              {saveStates.artist.message ? (
                <span className="text-sm text-emerald-600">{saveStates.artist.message}</span>
              ) : null}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
              <CardDescription>FAQ section title and question/answer pairs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-faq-eyebrow">Eyebrow</Label>
                  <Input
                    id="contact-faq-eyebrow"
                    value={content.faq.eyebrow}
                    onChange={(event) =>
                      updateSection("faq", (prev) => ({
                        ...prev,
                        eyebrow: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-faq-title">Title</Label>
                  <Input
                    id="contact-faq-title"
                    value={content.faq.title}
                    onChange={(event) =>
                      updateSection("faq", (prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                {content.faq.items.map((item, index) => (
                  <div key={`contact-faq-${index}`} className="space-y-3 rounded-lg border border-border p-4">
                    <div className="space-y-2">
                      <Label htmlFor={`contact-faq-question-${index}`}>Question</Label>
                      <Input
                        id={`contact-faq-question-${index}`}
                        value={item.question}
                        onChange={(event) =>
                          updateSection("faq", (prev) => ({
                            ...prev,
                            items: updateListItem(prev.items, index, {
                              ...item,
                              question: event.target.value,
                            }),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`contact-faq-answer-${index}`}>Answer</Label>
                      <Textarea
                        id={`contact-faq-answer-${index}`}
                        value={item.answer}
                        onChange={(event) =>
                          updateSection("faq", (prev) => ({
                            ...prev,
                            items: updateListItem(prev.items, index, {
                              ...item,
                              answer: event.target.value,
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
              <Button onClick={() => saveSection("faq")} disabled={saveStates.faq.isSaving}>
                {saveStates.faq.isSaving ? "Saving..." : "Save FAQ"}
              </Button>
              {saveStates.faq.error ? (
                <span className="text-sm text-destructive">{saveStates.faq.error}</span>
              ) : null}
              {saveStates.faq.message ? (
                <span className="text-sm text-emerald-600">{saveStates.faq.message}</span>
              ) : null}
            </CardFooter>
          </Card>
        </div>
      )}
    </AdminPageShell>
  )
}
