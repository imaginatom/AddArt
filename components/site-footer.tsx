import Link from "next/link"
import { Mail, MapPin, Phone, Instagram, Facebook } from "lucide-react"
import type { SiteSettingsContent } from "@/lib/content/settings"

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/realisations", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
]

export function SiteFooter({ settings }: { settings: SiteSettingsContent }) {
  return (
    <footer
      role="contentinfo"
      data-journey-palette="abyss"
      data-journey-label="Colophon"
      className="relative bg-[hsl(var(--footer))] text-[hsl(var(--footer-foreground))]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent/[0.06] to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <span className="font-serif text-sm font-bold text-accent-foreground">A</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-base font-bold">{settings.brand.studioName}</span>
                <span className="text-[10px] uppercase tracking-widest opacity-60">
                  {settings.brand.studioLabel}
                </span>
              </div>
            </div>
            <p className="mb-6 text-sm leading-relaxed opacity-75">
              {settings.brand.footerDescription}
            </p>
            <ul className="flex flex-col gap-3 text-sm opacity-80">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a href={`mailto:${settings.contact.email}`} className="transition-colors hover:text-accent">
                  {settings.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a
                  href={`tel:${settings.contact.phone.replace(/\s+/g, "")}`}
                  className="transition-colors hover:text-accent"
                >
                  {settings.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{settings.contact.location}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 font-serif text-lg font-semibold">Navigation</h3>
            <nav aria-label="Navigation du pied de page">
              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block text-sm opacity-75 transition-all hover:translate-x-0.5 hover:text-accent hover:opacity-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={settings.social.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 opacity-75 transition-all duration-200 ease-out hover:scale-110 hover:bg-accent hover:text-accent-foreground hover:opacity-100 active:scale-95"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={settings.social.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 opacity-75 transition-all duration-200 ease-out hover:scale-110 hover:bg-accent hover:text-accent-foreground hover:opacity-100 active:scale-95"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-6 font-serif text-lg font-semibold">Derriere AddArt</h3>
            <ul className="flex flex-col gap-4 text-sm opacity-80">
              <li>
                <p className="font-medium opacity-100">{settings.brand.artistName}</p>
                <p className="text-xs opacity-60">{settings.brand.artistRole}</p>
              </li>
              <li className="text-xs leading-relaxed opacity-70">{settings.brand.artistBio}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs opacity-55 md:flex-row lg:px-8">
          <p>{settings.legal.copyrightLine}</p>
          <div className="flex items-center gap-4">
            <Link href={settings.legal.legalHref} className="transition-colors hover:text-accent hover:opacity-100">
              {settings.legal.legalLabel}
            </Link>
            <Link href={settings.legal.privacyHref} className="transition-colors hover:text-accent hover:opacity-100">
              {settings.legal.privacyLabel}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
