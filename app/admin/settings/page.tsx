"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AdminInfoPanel, AdminPageHeader, AdminPageShell } from "@/components/admin/admin-ui"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { mergeSiteSettingsContent, siteSettingsDefaults, type SiteSettingsContent } from "@/lib/content/settings"

type SaveState = {
  isSaving: boolean
  message: string | null
  error: string | null
}

const serializeTypes = (types: SiteSettingsContent["contactForm"]["projectTypes"]) =>
  types.map((entry) => `${entry.value}|${entry.label}`).join("\n")

const parseTypes = (raw: string): SiteSettingsContent["contactForm"]["projectTypes"] => {
  const parsed = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [value, ...labelParts] = line.split("|")
      return {
        value: (value ?? "").trim(),
        label: labelParts.join("|").trim(),
      }
    })
    .filter((entry) => entry.value && entry.label)
  return parsed.length > 0 ? parsed : siteSettingsDefaults.contactForm.projectTypes
}

export default function AdminSettingsPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [settings, setSettings] = useState<SiteSettingsContent>(siteSettingsDefaults)
  const [projectTypesRaw, setProjectTypesRaw] = useState(
    serializeTypes(siteSettingsDefaults.contactForm.projectTypes),
  )
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<SaveState>({
    isSaving: false,
    message: null,
    error: null,
  })

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true)
      setLoadError(null)
      const { data, error } = await supabase
        .from("site_content")
        .select("section, content")
        .eq("page", "settings")

      if (error) {
        setLoadError(error.message || "Unable to load site settings.")
        setIsLoading(false)
        return
      }

      const merged = mergeSiteSettingsContent(data ?? [])
      setSettings(merged)
      setProjectTypesRaw(serializeTypes(merged.contactForm.projectTypes))
      setIsLoading(false)
    }

    void loadSettings()
  }, [supabase])

  const saveGlobalSettings = async () => {
    setSaveState({ isSaving: true, message: null, error: null })
    const payload: SiteSettingsContent = {
      ...settings,
      contactForm: {
        ...settings.contactForm,
        projectTypes: parseTypes(projectTypesRaw),
      },
    }

    const { data: existing, error: fetchError } = await supabase
      .from("site_content")
      .select("id")
      .eq("page", "settings")
      .eq("section", "global")
      .maybeSingle()

    if (fetchError) {
      setSaveState({
        isSaving: false,
        message: null,
        error: fetchError.message || "Unable to fetch settings entry.",
      })
      return
    }

    const upsertPayload = {
      page: "settings",
      section: "global",
      content_type: "text",
      content: payload,
      sort_order: 0,
    }

    const { error: saveError } = existing?.id
      ? await supabase.from("site_content").update(upsertPayload).eq("id", existing.id)
      : await supabase.from("site_content").insert(upsertPayload)

    if (saveError) {
      setSaveState({
        isSaving: false,
        message: null,
        error: saveError.message || "Unable to save settings.",
      })
      return
    }

    setSaveState({
      isSaving: false,
      message: "Saved successfully.",
      error: null,
    })
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        badge="Settings"
        title="Global settings"
        description="Single root source for contact info, social links, legal links, shared CTA labels, and contact form config."
      />

      {loadError ? (
        <AdminInfoPanel tone="error" className="mt-6">
          {loadError}
        </AdminInfoPanel>
      ) : null}

      {isLoading ? (
        <AdminInfoPanel className="mt-6">Loading global settings...</AdminInfoPanel>
      ) : (
        <div className="mt-8 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Brand & artist</CardTitle>
              <CardDescription>Studio identity used in header/footer/contact.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-studio-name">Studio name</Label>
                  <Input
                    id="settings-studio-name"
                    value={settings.brand.studioName}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, studioName: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-studio-label">Studio label</Label>
                  <Input
                    id="settings-studio-label"
                    value={settings.brand.studioLabel}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, studioLabel: event.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-artist-name">Artist name</Label>
                  <Input
                    id="settings-artist-name"
                    value={settings.brand.artistName}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, artistName: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-artist-role">Artist role</Label>
                  <Input
                    id="settings-artist-role"
                    value={settings.brand.artistRole}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, artistRole: event.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-footer-description">Footer description</Label>
                <Textarea
                  id="settings-footer-description"
                  value={settings.brand.footerDescription}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      brand: { ...prev.brand, footerDescription: event.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-artist-bio">Artist bio</Label>
                <Textarea
                  id="settings-artist-bio"
                  value={settings.brand.artistBio}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      brand: { ...prev.brand, artistBio: event.target.value },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact & social</CardTitle>
              <CardDescription>
                Shared email/phone/location and social links across header/footer/contact page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-email">Email</Label>
                  <Input
                    id="settings-email"
                    value={settings.contact.email}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, email: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-phone">Phone number</Label>
                  <Input
                    id="settings-phone"
                    value={settings.contact.phone}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, phone: event.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-location">Location</Label>
                <Input
                  id="settings-location"
                  value={settings.contact.location}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, location: event.target.value },
                    }))
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-instagram">Instagram URL</Label>
                  <Input
                    id="settings-instagram"
                    value={settings.social.instagramUrl}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        social: { ...prev.social, instagramUrl: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-facebook">Facebook URL</Label>
                  <Input
                    id="settings-facebook"
                    value={settings.social.facebookUrl}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        social: { ...prev.social, facebookUrl: event.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal & CTA labels</CardTitle>
              <CardDescription>Footer legal links and shared call-to-action labels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="settings-copyright">Copyright line</Label>
                <Input
                  id="settings-copyright"
                  value={settings.legal.copyrightLine}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      legal: { ...prev.legal, copyrightLine: event.target.value },
                    }))
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-legal-label">Legal link label</Label>
                  <Input
                    id="settings-legal-label"
                    value={settings.legal.legalLabel}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        legal: { ...prev.legal, legalLabel: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-legal-href">Legal link URL</Label>
                  <Input
                    id="settings-legal-href"
                    value={settings.legal.legalHref}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        legal: { ...prev.legal, legalHref: event.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-privacy-label">Privacy link label</Label>
                  <Input
                    id="settings-privacy-label"
                    value={settings.legal.privacyLabel}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        legal: { ...prev.legal, privacyLabel: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-privacy-href">Privacy link URL</Label>
                  <Input
                    id="settings-privacy-href"
                    value={settings.legal.privacyHref}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        legal: { ...prev.legal, privacyHref: event.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="settings-contact-btn">Contact button label</Label>
                  <Input
                    id="settings-contact-btn"
                    value={settings.cta.contactButtonLabel}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        cta: { ...prev.cta, contactButtonLabel: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-quote-btn">Quote button label</Label>
                  <Input
                    id="settings-quote-btn"
                    value={settings.cta.quoteButtonLabel}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        cta: { ...prev.cta, quoteButtonLabel: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-floating-cta">Floating CTA aria-label</Label>
                  <Input
                    id="settings-floating-cta"
                    value={settings.cta.floatingCtaLabel}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        cta: { ...prev.cta, floatingCtaLabel: event.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact form config</CardTitle>
              <CardDescription>
                Managed from one global source; used by the contact form component.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-project-type-label">Project type label</Label>
                  <Input
                    id="settings-project-type-label"
                    value={settings.contactForm.projectTypeLabel}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        contactForm: { ...prev.contactForm, projectTypeLabel: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-project-type-placeholder">Project type placeholder</Label>
                  <Input
                    id="settings-project-type-placeholder"
                    value={settings.contactForm.projectTypePlaceholder}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        contactForm: { ...prev.contactForm, projectTypePlaceholder: event.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-project-types">Project types (one per line, format: value|label)</Label>
                <Textarea
                  id="settings-project-types"
                  value={projectTypesRaw}
                  onChange={(event) => setProjectTypesRaw(event.target.value)}
                  rows={8}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-submit-label">Submit button label</Label>
                  <Input
                    id="settings-submit-label"
                    value={settings.contactForm.submitLabel}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        contactForm: { ...prev.contactForm, submitLabel: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-submitting-label">Submitting label</Label>
                  <Input
                    id="settings-submitting-label"
                    value={settings.contactForm.submittingLabel}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        contactForm: { ...prev.contactForm, submittingLabel: event.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-success-title">Success title</Label>
                  <Input
                    id="settings-success-title"
                    value={settings.contactForm.successTitle}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        contactForm: { ...prev.contactForm, successTitle: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-success-message">Success message</Label>
                  <Input
                    id="settings-success-message"
                    value={settings.contactForm.successMessage}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        contactForm: { ...prev.contactForm, successMessage: event.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-disclaimer">Form disclaimer</Label>
                <Textarea
                  id="settings-disclaimer"
                  value={settings.contactForm.disclaimer}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      contactForm: { ...prev.contactForm, disclaimer: event.target.value },
                    }))
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Button onClick={saveGlobalSettings} disabled={saveState.isSaving}>
                {saveState.isSaving ? "Saving..." : "Save global settings"}
              </Button>
              {saveState.error ? <span className="text-sm text-destructive">{saveState.error}</span> : null}
              {saveState.message ? <span className="text-sm text-emerald-600">{saveState.message}</span> : null}
            </CardFooter>
          </Card>
        </div>
      )}
    </AdminPageShell>
  )
}
