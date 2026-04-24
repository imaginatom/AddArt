"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/admin/image-upload"
import { AdminInfoPanel, AdminPageHeader, AdminPageShell } from "@/components/admin/admin-ui"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { mapProjectRecords, type PortfolioProjectRecord } from "@/lib/content/portfolio-projects"

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "project"

export default function AdminPortfolioProjectDetailPage() {
  const params = useParams<{ projectId: string }>()
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const projectId = params.projectId

  const [project, setProject] = useState<PortfolioProjectRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true)
      setError(null)

      const { data, error: loadError } = await supabase
        .from("projects")
        .select(
          "id, slug, title, description, location, category, image_src, image_alt, image_path, status, sort_order, updated_at",
        )
        .eq("id", projectId)
        .maybeSingle()

      if (loadError || !data) {
        setError(loadError?.message || "Unable to load project.")
        setIsLoading(false)
        return
      }

      const normalized = mapProjectRecords([data as PortfolioProjectRecord], [])
      setProject(normalized[0] ?? null)
      setIsLoading(false)
    }

    if (projectId) {
      void loadProject()
    }
  }, [projectId, supabase])

  const saveProject = async () => {
    if (!project) return
    setIsSaving(true)
    setSaveMessage(null)
    setError(null)

    const payload = {
      slug: toSlug(project.slug || project.title),
      title: project.title,
      description: project.description,
      location: project.location,
      category: project.category,
      image_src: project.image_src,
      image_alt: project.image_alt,
      image_path: project.image_path,
      status: project.status,
      sort_order: project.sort_order,
    }

    const { error: saveError } = await supabase.from("projects").update(payload).eq("id", project.id)

    setIsSaving(false)

    if (saveError) {
      setError(saveError.message || "Unable to save project.")
      return
    }

    setSaveMessage("Project saved successfully.")
  }

  const deleteProject = async () => {
    if (!project) return
    const confirmed = window.confirm(`Delete "${project.title}"? This action cannot be undone.`)
    if (!confirmed) return

    const { error: deleteError } = await supabase.from("projects").delete().eq("id", project.id)
    if (deleteError) {
      setError(deleteError.message || "Unable to delete project.")
      return
    }

    router.push("/admin/portfolio/projects")
  }

  if (isLoading) {
    return (
      <AdminPageShell>
        <AdminInfoPanel>Loading project...</AdminInfoPanel>
      </AdminPageShell>
    )
  }

  if (!project) {
    return (
      <AdminPageShell>
        <AdminInfoPanel tone="error">
          {error ?? "Project not found."}
        </AdminInfoPanel>
      </AdminPageShell>
    )
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        badge="Portfolio"
        title="Edit project"
        description="Update content fields, image, and publishing state."
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/portfolio/projects">Back to projects</Link>
          </Button>
        }
      />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Project details</CardTitle>
          <CardDescription>These fields drive the portfolio grid and lightbox.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-title">Title</Label>
              <Input
                id="project-title"
                value={project.title}
                onChange={(event) =>
                  setProject((prev) => (prev ? { ...prev, title: event.target.value } : prev))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-slug">Slug</Label>
              <Input
                id="project-slug"
                value={project.slug}
                onChange={(event) =>
                  setProject((prev) => (prev ? { ...prev, slug: event.target.value } : prev))
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-category">Category</Label>
              <Input
                id="project-category"
                value={project.category}
                onChange={(event) =>
                  setProject((prev) => (prev ? { ...prev, category: event.target.value } : prev))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-location">Location</Label>
              <Input
                id="project-location"
                value={project.location}
                onChange={(event) =>
                  setProject((prev) => (prev ? { ...prev, location: event.target.value } : prev))
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={project.status}
                onValueChange={(value) =>
                  setProject((prev) =>
                    prev ? { ...prev, status: value === "published" ? "published" : "draft" } : prev,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-sort-order">Sort order</Label>
              <Input
                id="project-sort-order"
                type="number"
                value={project.sort_order}
                onChange={(event) =>
                  setProject((prev) =>
                    prev ? { ...prev, sort_order: Number.parseInt(event.target.value || "0", 10) } : prev,
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              value={project.description}
              onChange={(event) =>
                setProject((prev) => (prev ? { ...prev, description: event.target.value } : prev))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-image-alt">Image alt text</Label>
            <Input
              id="project-image-alt"
              value={project.image_alt}
              onChange={(event) =>
                setProject((prev) => (prev ? { ...prev, image_alt: event.target.value } : prev))
              }
            />
          </div>

          <ImageUpload
            label="Project image"
            value={{ src: project.image_src, path: project.image_path }}
            onChange={(nextValue) =>
              setProject((prev) =>
                prev
                  ? {
                      ...prev,
                      image_src: nextValue.src,
                      image_path: nextValue.path ?? null,
                    }
                  : prev,
              )
            }
          />
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button onClick={() => void saveProject()} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save project"}
            </Button>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => void deleteProject()}
            >
              Delete project
            </Button>
          </div>
          {error ? <span className="text-sm text-destructive">{error}</span> : null}
          {saveMessage ? <span className="text-sm text-emerald-600">{saveMessage}</span> : null}
        </CardFooter>
      </Card>
    </AdminPageShell>
  )
}
