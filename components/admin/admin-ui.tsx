import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type AdminPageShellProps = {
  children: ReactNode
  className?: string
}

export function AdminPageShell({ children, className }: AdminPageShellProps) {
  return (
    <section className={cn("mx-auto w-full max-w-6xl px-4 py-10 md:py-12", className)}>
      {children}
    </section>
  )
}

type AdminPageHeaderProps = {
  badge: string
  title: string
  description: string
  actions?: ReactNode
}

export function AdminPageHeader({
  badge,
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/80 pb-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{badge}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{title}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}

type AdminInfoPanelProps = {
  tone?: "error" | "success" | "neutral"
  children: ReactNode
  className?: string
}

export function AdminInfoPanel({
  tone = "neutral",
  children,
  className,
}: AdminInfoPanelProps) {
  const toneClass =
    tone === "error"
      ? "border-destructive/40 bg-destructive/10 text-destructive"
      : tone === "success"
        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        : "border-border bg-card text-muted-foreground"

  return (
    <div className={cn("rounded-xl border px-4 py-3 text-sm", toneClass, className)}>
      {children}
    </div>
  )
}
