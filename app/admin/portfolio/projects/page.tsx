"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AdminInfoPanel, AdminPageHeader, AdminPageShell } from "@/components/admin/admin-ui"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import {
  mapProjectRecords,
  type PortfolioProjectRecord,
  type ProjectStatus,
} from "@/lib/content/portfolio-projects"

type StatusFilter = "all" | ProjectStatus

export default function AdminPortfolioProjectsPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const router = useRouter()

  const [projects, setProjects] = useState<PortfolioProjectRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const loadProjects = async () => {
    setIsLoading(true)
    setLoadError(null)

    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, slug, title, description, location, category, image_src, image_alt, image_path, status, sort_order, updated_at",
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })

    if (error) {
      setLoadError(error.message || "Unable to load projects.")
      setIsLoading(false)
      return
    }

    setProjects(mapProjectRecords((data as PortfolioProjectRecord[] | null) ?? null, []))
    setIsLoading(false)
  }

  useEffect(() => {
    void loadProjects()
  }, [])

  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((project) => project.category).filter(Boolean)))
    return unique.sort((a, b) => a.localeCompare(b))
  }, [projects])

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      if (statusFilter !== "all" && project.status !== statusFilter) return false
      if (categoryFilter !== "all" && project.category !== categoryFilter) return false
      if (!query.trim()) return true

      const normalized = query.trim().toLowerCase()
      return (
        project.title.toLowerCase().includes(normalized) ||
        project.location.toLowerCase().includes(normalized) ||
        project.category.toLowerCase().includes(normalized)
      )
    })
  }, [projects, statusFilter, categoryFilter, query])

  const createProject = async () => {
    setIsCreating(true)
    const nextOrder = projects.length === 0 ? 0 : Math.max(...projects.map((project) => project.sort_order)) + 1
    const timestamp = Date.now()

    const draft = {
      title: "Nouveau projet",
      slug: `projet-${timestamp}`,
      description: "",
      location: "Oran",
      category: "Commercial",
      image_src: "/images/gallery-1.jpg",
      image_alt: "Nouveau projet AddArt",
      image_path: null,
      status: "draft" as ProjectStatus,
      sort_order: nextOrder,
    }

    const { data, error } = await supabase
      .from("projects")
      .insert(draft)
      .select("id")
      .single()

    setIsCreating(false)

    if (error || !data?.id) {
      setLoadError(error?.message || "Unable to create project.")
      return
    }

    router.push(`/admin/portfolio/projects/${data.id}`)
  }

  const deleteProject = async (project: PortfolioProjectRecord) => {
    const confirmDelete = window.confirm(`Delete "${project.title}"? This action cannot be undone.`)
    if (!confirmDelete) return

    const { error } = await supabase.from("projects").delete().eq("id", project.id)
    if (error) {
      setLoadError(error.message || "Unable to delete project.")
      return
    }

    const remaining = projects.filter((entry) => entry.id !== project.id)
    setProjects(remaining)
  }

  const moveProject = async (projectId: string, direction: "up" | "down") => {
    const index = projects.findIndex((project) => project.id === projectId)
    if (index < 0) return
    const swapIndex = direction === "up" ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= projects.length) return

    const current = projects[index]
    const target = projects[swapIndex]

    const [firstUpdate, secondUpdate] = await Promise.all([
      supabase.from("projects").update({ sort_order: target.sort_order }).eq("id", current.id),
      supabase.from("projects").update({ sort_order: current.sort_order }).eq("id", target.id),
    ])
    const error = firstUpdate.error ?? secondUpdate.error

    if (error) {
      setLoadError(error.message || "Unable to reorder projects.")
      return
    }

    const next = [...projects]
    next[index] = { ...target, sort_order: current.sort_order }
    next[swapIndex] = { ...current, sort_order: target.sort_order }
    setProjects(next)
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        badge="Portfolio"
        title="Projects manager"
        description="Add, edit, delete, reorder, and publish portfolio projects."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/admin/portfolio">Back to portfolio copy</Link>
            </Button>
            <Button onClick={() => void createProject()} disabled={isCreating}>
              <Plus className="mr-2 h-4 w-4" />
              {isCreating ? "Creating..." : "New project"}
            </Button>
          </>
        }
      />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{projects.length}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">Total projects</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {projects.filter((project) => project.status === "published").length}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">Published</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {projects.filter((project) => project.status === "draft").length}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">Draft</CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, category, location..."
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loadError ? (
        <AdminInfoPanel tone="error" className="mt-6">
          {loadError}
        </AdminInfoPanel>
      ) : null}

      {isLoading ? (
        <AdminInfoPanel className="mt-6">Loading projects...</AdminInfoPanel>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card/70">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => {
                const currentIndex = projects.findIndex((entry) => entry.id === project.id)
                return (
                  <tr key={project.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => void moveProject(project.id, "up")}
                          disabled={currentIndex <= 0}
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => void moveProject(project.id, "down")}
                          disabled={currentIndex < 0 || currentIndex >= projects.length - 1}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={`/admin/portfolio/projects/${project.id}`}
                        className="hover:text-primary"
                      >
                        {project.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{project.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{project.location}</td>
                    <td className="px-4 py-3">
                      <Badge variant={project.status === "published" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                          <Link href={`/admin/portfolio/projects/${project.id}`}>Edit</Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => void deleteProject(project)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No projects match your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </AdminPageShell>
  )
}
