"use client"

import { useState, type FormEvent } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SiteSettingsContent } from "@/lib/content/settings"

export function ContactForm({ settings }: { settings: SiteSettingsContent }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
          <Send className="h-5 w-5 text-accent" />
        </div>
        <h3 className="font-serif text-lg font-bold text-foreground">{settings.contactForm.successTitle}</h3>
        <p className="text-sm text-muted-foreground">
          {settings.contactForm.successMessage}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="form-nom" className="mb-1.5 block text-sm font-medium text-foreground">
            Nom <span className="text-accent">*</span>
          </label>
          <input
            id="form-nom"
            name="nom"
            type="text"
            required
            placeholder="Votre nom"
            aria-required="true"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary focus:shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="form-prenom" className="mb-1.5 block text-sm font-medium text-foreground">
            {"Pr\u00e9nom"} <span className="text-accent">*</span>
          </label>
          <input
            id="form-prenom"
            name="prenom"
            type="text"
            required
            placeholder="Votre pr\u00e9nom"
            aria-required="true"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary focus:shadow-sm"
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="form-email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="form-email"
            name="email"
            type="email"
            required
            placeholder="votre@email.com"
            aria-required="true"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary focus:shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="form-phone" className="mb-1.5 block text-sm font-medium text-foreground">
            {"T\u00e9l\u00e9phone"}
          </label>
          <input
            id="form-phone"
            name="telephone"
            type="tel"
            placeholder="+213 XX XX XX XX"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary focus:shadow-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="form-service" className="mb-1.5 block text-sm font-medium text-foreground">
          {settings.contactForm.projectTypeLabel}
        </label>
        <select
          id="form-service"
          name="service"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary focus:shadow-sm"
          defaultValue=""
        >
          <option value="" disabled>{settings.contactForm.projectTypePlaceholder}</option>
          {settings.contactForm.projectTypes.map((projectType) => (
            <option key={projectType.value} value={projectType.value}>
              {projectType.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="form-message" className="mb-1.5 block text-sm font-medium text-foreground">
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          id="form-message"
          name="message"
          rows={5}
          required
          placeholder={"D\u00e9crivez votre projet, l'univers recherch\u00e9, la plateforme de diffusion et votre budget approximatif..."}
          aria-required="true"
          className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary focus:shadow-sm"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-70 md:w-auto"
        aria-label="Envoyer le formulaire de contact"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {settings.contactForm.submittingLabel}
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {settings.contactForm.submitLabel}
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground">
        {settings.contactForm.disclaimer}
      </p>
    </form>
  )
}
