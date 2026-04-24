import type { ReactNode } from "react"
import { AdminNav } from "@/components/admin/admin-nav"

type AdminLayoutProps = {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <AdminNav />
      <div className="pb-10">{children}</div>
    </div>
  )
}
