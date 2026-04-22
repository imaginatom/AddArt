import Link from "next/link"
import { Mail, MapPin, Instagram, Linkedin } from "lucide-react"

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/illustration", label: "Illustration" },
  { href: "/motion", label: "Motion" },
  { href: "/realisations", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
]

export function SiteFooter() {
  return (
    <footer
      role="contentinfo"
      className="relative bg-[hsl(var(--footer))] text-[hsl(var(--footer-foreground))]"
    >
      {/* Magenta hairline + subtle glow on top edge */}
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
          {/* Column 1 - About */}
          <div>
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <span className="text-sm font-bold text-accent-foreground font-serif">A</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-base font-bold">AddArt</span>
                <span className="text-[10px] tracking-widest uppercase opacity-60">Studio</span>
              </div>
            </div>
            <p className="mb-6 text-sm leading-relaxed opacity-75">
              {"Studio d'illustration, de cartoon art et de motion design bas\u00e9 \u00e0 Oran. Character design, jaquettes de jeux, graphismes commerciaux et courtes animations."}
            </p>
            <ul className="flex flex-col gap-3 text-sm opacity-80">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a href="mailto:addart69@gmail.com" className="hover:text-accent transition-colors">addart69@gmail.com</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
                <span>{"Oran, Alg\u00e9rie"}</span>
              </li>
            </ul>
          </div>

          {/* Column 2 - Navigation */}
          <div>
            <h3 className="mb-6 font-serif text-lg font-semibold">Navigation</h3>
            <nav aria-label="Navigation du pied de page">
              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block text-sm opacity-75 transition-all hover:opacity-100 hover:text-accent hover:translate-x-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 opacity-75 transition-all duration-200 ease-out hover:bg-accent hover:text-accent-foreground hover:opacity-100 hover:scale-110 active:scale-95"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 opacity-75 transition-all duration-200 ease-out hover:bg-accent hover:text-accent-foreground hover:opacity-100 hover:scale-110 active:scale-95"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 3 - Artist */}
          <div>
            <h3 className="mb-6 font-serif text-lg font-semibold">{"Derri\u00e8re AddArt"}</h3>
            <ul className="flex flex-col gap-4 text-sm opacity-80">
              <li>
                <p className="font-medium opacity-100">{"{{ARTIST_NAME}}"}</p>
                <p className="text-xs opacity-60">{"Illustrateur & Motion Designer"}</p>
              </li>
              <li className="text-xs leading-relaxed opacity-70">
                {"Studio ind\u00e9pendant bas\u00e9 \u00e0 Oran. Disponible pour des collaborations en Alg\u00e9rie et \u00e0 l'international."}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs opacity-55 md:flex-row lg:px-8">
          <p>{"\u00a9 2026 AddArt \u2014 Tous droits r\u00e9serv\u00e9s"}</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="transition-colors hover:opacity-100 hover:text-accent">{"Mentions l\u00e9gales"}</Link>
            <Link href="#" className="transition-colors hover:opacity-100 hover:text-accent">{"Politique de confidentialit\u00e9"}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
