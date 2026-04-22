"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type ImageUploadValue = {
  src: string
  path?: string | null
}

type ImageUploadProps = {
  label: string
  value?: ImageUploadValue
  onChange: (value: ImageUploadValue) => void
  bucket?: string
  helperText?: string
  disabled?: boolean
}

const createStoragePath = (fileName: string) => {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-")
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${crypto.randomUUID()}-${safeName}`
  }
  return `${Date.now()}-${Math.round(Math.random() * 1_000_000)}-${safeName}`
}

export function ImageUpload({
  label,
  value,
  onChange,
  bucket = "site-images",
  helperText,
  disabled = false,
}: ImageUploadProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(value?.src ?? null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setPreviewUrl(value?.src ?? null)
  }, [value?.src])

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) {
      return
    }

    setError(null)
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current)
      }
      return localPreview
    })
    setIsUploading(true)

    const path = createStoragePath(file.name)
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: false,
      contentType: file.type,
    })

    if (uploadError) {
      setError(uploadError.message || "Unable to upload image.")
      setIsUploading(false)
      return
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    if (!data?.publicUrl) {
      setError("Unable to resolve public URL.")
      setIsUploading(false)
      return
    }

    onChange({ src: data.publicUrl, path })
    setIsUploading(false)
  }

  const handleRemove = async () => {
    if (disabled) {
      return
    }

    setError(null)

    if (value?.path) {
      setIsUploading(true)
      const { error: removeError } = await supabase.storage.from(bucket).remove([value.path])
      if (removeError) {
        setError(removeError.message || "Unable to delete image.")
        setIsUploading(false)
        return
      }
    }

    onChange({ src: "", path: null })
    setPreviewUrl(null)
    setIsUploading(false)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground transition",
          isDragging && "border-primary/50 bg-primary/5",
          disabled && "cursor-not-allowed opacity-60",
        )}
        onDragOver={(event) => {
          if (disabled) return
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          if (disabled) return
          event.preventDefault()
          setIsDragging(false)
          void handleFiles(event.dataTransfer.files)
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Drag and drop or upload</p>
              <p className="text-xs text-muted-foreground">
                {helperText ?? "PNG, JPG, or WebP up to 10MB."}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              disabled={disabled || isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? "Uploading..." : "Choose image"}
            </Button>
            {value?.src ? (
              <Button
                type="button"
                variant="ghost"
                disabled={disabled || isUploading}
                onClick={handleRemove}
              >
                Remove
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={disabled}
        onChange={(event) => void handleFiles(event.target.files)}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
