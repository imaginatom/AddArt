"use client"

import { useState, type FormEvent } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContactForm() {
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
        <h3 className="font-serif text-lg font-bold text-foreground">{"Demande envoy\u00e9e\u00a0!"}</h3>
        <p className="text-sm text-muted-foreground">
          {"Merci pour votre message. Nous vous recontactons sous 48\u00a0h."}
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
            placeholder="SAHNOUNE"
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
            placeholder="Mohammed"
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
          Type de projet
        </label>
        <select
          id="form-service"
          name="service"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary focus:shadow-sm"
          defaultValue=""
        >
          <option value="" disabled>{"S\u00e9lectionnez un type de projet"}</option>
          <option value="residential">{"Architecture r\u00e9sidentielle"}</option>
          <option value="commercial">{"Architecture commerciale"}</option>
          <option value="renovation">{"R\u00e9novation & Restauration"}</option>
          <option value="branding">{"Identit\u00e9 visuelle & Branding"}</option>
          <option value="3d">{"Visualisation 3D"}</option>
          <option value="autre">{"Autre"}</option>
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
          placeholder={"D\u00e9crivez votre projet, le lieu, vos besoins et votre budget approximatif..."}
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
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Envoyer ma demande
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground">
        {"En soumettant ce formulaire, vous acceptez d'\u00eatre recontact\u00e9(e) par Noun Studio. Vos donn\u00e9es sont trait\u00e9es confidentiellement."}
      </p>
    </form>
  )
}
