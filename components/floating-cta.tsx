"use client"

import { useState, useEffect } from "react"
import { Mail } from "lucide-react"
import { cn } from "@/lib/utils"

export function FloatingCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 lg:hidden transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      <a
        href="mailto:contact@nounstudio.dz"
        aria-label="Contacter Noun Studio par email"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 ease-out hover:scale-110 hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
        <Mail className="h-6 w-6 relative z-10" />
      </a>
    </div>
  )
}
