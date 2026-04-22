import Link from "next/link"
import { Mail, MapPin, Instagram, Linkedin } from "lucide-react"

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/architecture", label: "Architecture" },
  { href: "/branding", label: "Branding" },
  { href: "/realisations", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
]

export function SiteFooter() {
  return (
    <footer role="contentinfo" className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Column 1 - About */}
          <div>
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <span className="text-sm font-bold text-accent-foreground font-serif">N</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-base font-bold text-background">Noun</span>
                <span className="text-[10px] tracking-widest uppercase text-background/60">Studio</span>
              </div>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-background/70">
              {"Cabinet d'architecture et studio de design multidisciplinaire. Architecture, identit\u00e9 visuelle et contenu culturel entre l'Alg\u00e9rie et la France."}
            </p>
            <ul className="flex flex-col gap-3 text-sm text-background/70">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a href="mailto:contact@nounstudio.dz" className="hover:text-accent transition-colors">contact@nounstudio.dz</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
                <span>{"Alg\u00e9rie & France"}</span>
              </li>
            </ul>
          </div>

          {/* Column 2 - Navigation */}
          <div>
            <h3 className="mb-6 font-serif text-lg font-semibold text-background">Navigation</h3>
            <nav aria-label="Navigation du pied de page">
              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-background/70 transition-colors hover:text-accent hover:translate-x-0.5 inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-background/70 transition-all duration-200 ease-out hover:bg-accent hover:text-accent-foreground hover:scale-110 active:scale-95">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-background/70 transition-all duration-200 ease-out hover:bg-accent hover:text-accent-foreground hover:scale-110 active:scale-95">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 3 - Team */}
          <div>
            <h3 className="mb-6 font-serif text-lg font-semibold text-background">{"L'\u00e9quipe"}</h3>
            <ul className="flex flex-col gap-4 text-sm text-background/70">
              <li>
                <p className="font-medium text-background">SAHNOUNE Mohammed</p>
                <p className="text-xs text-background/50">{"Architecte & Directeur Cr\u00e9atif"}</p>
              </li>
              <li>
                <p className="font-medium text-background">Adda Echikh</p>
                <p className="text-xs text-background/50">{"Designer Graphique & Direction Artistique"}</p>
              </li>
              <li>
                <p className="font-medium text-background">Sid Ahmed Lakber</p>
                <p className="text-xs text-background/50">{"D\u00e9veloppement Web & Digital"}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-background/50 md:flex-row lg:px-8">
          <p>{"© 2026 Noun Studio — Tous droits r\u00e9serv\u00e9s"}</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-background/70 transition-colors">{"Mentions l\u00e9gales"}</Link>
            <Link href="#" className="hover:text-background/70 transition-colors">{"Politique de confidentialit\u00e9"}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
