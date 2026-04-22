import { cn } from "@/lib/utils"

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6" aria-hidden="true">
      <SkeletonBlock className="h-12 w-12 rounded-lg" />
      <SkeletonBlock className="mt-2 h-5 w-3/4" />
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-5/6" />
    </div>
  )
}

export function SkeletonImage({ className }: { className?: string }) {
  return (
    <div className={cn("skeleton overflow-hidden rounded-xl", className)} aria-hidden="true" />
  )
}
