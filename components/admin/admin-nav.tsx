"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoutButton } from "@/components/admin/logout-button"
import { cn } from "@/lib/utils"

const adminLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "Homepage", href: "/admin/homepage" },
  { label: "Portfolio", href: "/admin/portfolio" },
  { label: "Architecture", href: "/admin/architecture" },
  { label: "Branding", href: "/admin/branding" },
]

export function AdminNav() {
  const pathname = usePathname()

  if (pathname === "/admin/login") {
    return null
  }

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
        <LogoutButton variant="outline" />
      </div>
    </nav>
  )
}
