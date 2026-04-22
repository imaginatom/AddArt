"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mail, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/architecture", label: "Architecture" },
  { href: "/branding", label: "Branding" },
  { href: "/realisations", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isTransparent = isHome && !scrolled

  return (
    <header
      role="banner"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isTransparent
          ? "bg-transparent py-4"
          : "bg-background/95 backdrop-blur-md shadow-sm py-2"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" aria-label="Noun Studio \u2014 Accueil" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground font-serif">N</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className={cn(
              "font-serif text-lg font-bold tracking-tight transition-colors",
              isTransparent ? "text-background" : "text-foreground"
            )}>
              Noun
            </span>
            <span className={cn(
              "text-xs font-medium tracking-widest uppercase transition-colors",
              isTransparent ? "text-background/70" : "text-muted-foreground"
            )}>
              Studio
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={cn(
                "rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? isTransparent
                    ? "text-background bg-background/10"
                    : "text-primary bg-primary/5"
                  : isTransparent
                    ? "text-background/80 hover:text-background hover:bg-background/10"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button
            asChild
            variant="outline"
            size="sm"
            className={cn(
              "bg-transparent transition-colors",
              isTransparent
                ? "border-background/30 text-background hover:bg-background/10 hover:text-background"
                : "border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
            )}
          >
            <a href="mailto:contact@nounstudio.dz" aria-label="Envoyer un email">
              <Mail className="mr-1.5 h-3.5 w-3.5" />
              Contact
            </a>
          </Button>
          <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/contact">Demander un devis</Link>
          </Button>
        </div>

        {/* Mobile: Sheet drawer */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-md lg:hidden transition-colors",
                isTransparent
                  ? "text-background hover:bg-background/10"
                  : "text-foreground hover:bg-muted"
              )}
              aria-label="Ouvrir le menu de navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-background p-0">
            <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
            <div className="flex flex-col h-full">
              {/* Drawer header */}
              <div className="flex items-center gap-2 border-b border-border px-6 py-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-sm font-bold text-primary-foreground font-serif">N</span>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-serif text-base font-bold text-foreground">Noun</span>
                  <span className="text-[10px] tracking-widest uppercase text-muted-foreground">Studio</span>
                </div>
              </div>

              {/* Nav links */}
              <nav aria-label="Navigation mobile" className="flex-1 px-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSheetOpen(false)}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-primary/5 text-primary"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Drawer footer CTAs */}
              <div className="border-t border-border px-4 py-5 flex flex-col gap-3">
                <Button asChild variant="outline" className="w-full border-primary/30 text-primary bg-transparent hover:bg-primary/5 hover:text-primary">
                  <a href="mailto:contact@nounstudio.dz" aria-label="Envoyer un email">
                    <Mail className="mr-2 h-4 w-4" />
                    contact@nounstudio.dz
                  </a>
                </Button>
                <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/contact" onClick={() => setSheetOpen(false)}>
                    Demander un devis
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
