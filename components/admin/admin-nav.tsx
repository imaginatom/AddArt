"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutDashboard, FolderKanban, Mail, PanelTopOpen, Settings } from "lucide-react"
import { LogoutButton } from "@/components/admin/logout-button"
import { cn } from "@/lib/utils"

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Homepage", href: "/admin/homepage", icon: Home },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Contact", href: "/admin/contact", icon: Mail },
  { label: "Portfolio", href: "/admin/portfolio", icon: PanelTopOpen },
  { label: "Projects", href: "/admin/portfolio/projects", icon: FolderKanban },
]

export function AdminNav() {
  const pathname = usePathname()

  if (pathname === "/admin/login" || pathname === "/admin/reset-password") {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-2 hidden rounded-lg border border-border/80 bg-card px-2.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:block">
            AddArt Admin
          </div>
          {adminLinks.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-card hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            )
          })}
        </div>
        <LogoutButton variant="outline" className="rounded-lg">
          Sign out
        </LogoutButton>
      </div>
    </nav>
  )
}
