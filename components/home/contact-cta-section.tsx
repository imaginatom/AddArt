"use client";

import type React from "react";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SplitReveal } from "@/design-system/animations/split-reveal";
import { JourneyBridge } from "@/design-system/chrome/journey-bridge";
import {
  homePageDefaults,
  type HomePageContent,
} from "@/lib/content/homepage";
import type { SiteSettingsContent } from "@/lib/content/settings";

type ContactCtaContent = HomePageContent["contactCta"];

/**
 * Act 07 · Parlons
 *
 * The closer. Palette flips to magenta — the first time the journey
 * allows the accent to take over the full page. The form is framed as
 * the final editorial spread: oversized serif headline, a minute-hand
 * counter in the corner, an email stencil set like a mailing label, and
 * the form itself dropped into an off-white card that feels like a
 * cutout sheet. Every earlier section has been quietly preparing the
 * reader for this decision — so the typography gets out of the way and
 * lets the action breathe.
 */
export function ContactCtaSection({
  content = homePageDefaults.contactCta,
  settings,
}: {
  content?: ContactCtaContent;
  settings: SiteSettingsContent;
}) {
  return (
    <section
      id="contact"
      data-journey-palette="magenta"
      data-journey-label="Parlons"
      className="relative overflow-hidden bg-background py-28 text-foreground lg:py-36"
    >
      {/* Film grain / vignette for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, hsl(var(--accent) / 0.22), transparent 60%), radial-gradient(ellipse at 10% 90%, hsl(var(--foreground) / 0.12), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <JourneyBridge
          roman="VII"
          ordinal="07 · 07"
          from="Territoire"
          to="Parlons"
          whisper="Le rideau tombe sur le décor. On parle enfin — brièvement, précisément, entre vous et nous."
        />
        {/* Chapter marker */}
        <div className="flex items-end justify-between border-b border-[hsl(var(--foreground)/0.25)] pb-6">
          <p className="font-serif text-xl italic text-[hsl(var(--foreground)/0.8)]">
            Dernier acte.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[hsl(var(--foreground)/0.7)]">
            Réponse &lt; 48 h
          </p>
        </div>

        <div className="mt-14 grid gap-16 lg:mt-20 lg:grid-cols-12 lg:gap-20">
          {/* Editorial column */}
          <div className="lg:col-span-6">
            <h2 className="font-serif text-[clamp(2.8rem,7vw,6rem)] leading-[0.95] tracking-[-0.02em] text-[hsl(var(--foreground))]">
              <SplitReveal direction="mask" split="lines" duration={1.05}>
                {content.title.replace(/\.$/, "")}
              </SplitReveal>
              <span className="text-[hsl(var(--accent))]">.</span>
            </h2>

            <p className="mt-8 max-w-lg font-serif text-lg leading-relaxed text-[hsl(var(--foreground)/0.85)] lg:text-xl">
              {content.subtitle}
            </p>

            {/* Mailing label */}
            <a
              href={`mailto:${settings.contact.email}`}
              className="group mt-10 block max-w-md border border-[hsl(var(--foreground)/0.25)] bg-[hsl(var(--foreground)/0.04)] p-6 transition-all duration-500 hover:border-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground)/0.08)]"
              aria-label="Envoyer un email à AddArt"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(var(--foreground)/0.65)]">
                    {settings.contact.emailLabel}
                  </p>
                  <p className="mt-2 font-serif text-xl text-[hsl(var(--foreground))] lg:text-2xl">
                    {settings.contact.email}
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-[hsl(var(--foreground))] transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </a>

            <div className="mt-14 flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-[hsl(var(--foreground)/0.6)]">
              <span className="inline-block h-px w-10 bg-[hsl(var(--foreground)/0.6)]" />
              Oran · Algérie · International
            </div>
          </div>

          {/* Form cutout */}
          <div className="lg:col-span-6">
            <div
              className="relative border border-[hsl(220_22%_10%/0.14)] bg-[hsl(42_28%_98%)] p-6 text-[hsl(220_22%_10%)] shadow-[0_40px_80px_-40px_hsl(220_25%_6%/0.55)] md:p-10"
              data-journey-opt-out
              style={
                {
                  "--background": "42 28% 98%",
                  "--foreground": "220 22% 10%",
                  "--card": "42 28% 98%",
                  "--card-foreground": "220 22% 10%",
                  "--muted": "40 22% 88%",
                  "--muted-foreground": "220 14% 32%",
                  "--accent": "322 88% 48%",
                  "--accent-foreground": "42 28% 98%",
                  "--border": "220 22% 10% / 0.14",
                  "--primary": "220 22% 10%",
                  "--primary-foreground": "42 28% 98%",
                  "--input": "40 22% 88%",
                } as React.CSSProperties
              }
            >
              <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(220_14%_32%)]">
                Formulaire · Brief
              </p>
              <ContactForm settings={settings} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
