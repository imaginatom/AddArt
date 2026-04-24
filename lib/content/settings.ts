export type SiteSettingsContent = {
  brand: {
    studioName: string
    studioLabel: string
    artistName: string
    artistRole: string
    artistBio: string
    footerDescription: string
  }
  contact: {
    email: string
    phone: string
    location: string
    emailLabel: string
    phoneLabel: string
    locationLabel: string
  }
  social: {
    instagramUrl: string
    facebookUrl: string
  }
  legal: {
    copyrightLine: string
    legalLabel: string
    legalHref: string
    privacyLabel: string
    privacyHref: string
  }
  cta: {
    contactButtonLabel: string
    quoteButtonLabel: string
    floatingCtaLabel: string
  }
  contactForm: {
    projectTypeLabel: string
    projectTypePlaceholder: string
    projectTypes: Array<{
      value: string
      label: string
    }>
    submitLabel: string
    submittingLabel: string
    successTitle: string
    successMessage: string
    disclaimer: string
  }
}

export const siteSettingsDefaults: SiteSettingsContent = {
  brand: {
    studioName: "AddArt",
    studioLabel: "Studio",
    artistName: "{{ARTIST_NAME}}",
    artistRole: "Illustrateur & Motion Designer",
    artistBio:
      "Studio independant base a Oran. Disponible pour des collaborations en Algerie et a l'international.",
    footerDescription:
      "Studio d'illustration, de cartoon art et de motion design base a Oran. Character design, jaquettes de jeux, graphismes commerciaux et courtes animations.",
  },
  contact: {
    email: "addart69@gmail.com",
    phone: "+213 00 00 00 00",
    location: "Oran, Algerie",
    emailLabel: "Email",
    phoneLabel: "Telephone",
    locationLabel: "Localisation",
  },
  social: {
    instagramUrl: "https://instagram.com",
    facebookUrl: "https://facebook.com",
  },
  legal: {
    copyrightLine: "© 2026 AddArt — Tous droits reserves",
    legalLabel: "Mentions legales",
    legalHref: "#",
    privacyLabel: "Politique de confidentialite",
    privacyHref: "#",
  },
  cta: {
    contactButtonLabel: "Contact",
    quoteButtonLabel: "Demander un devis",
    floatingCtaLabel: "Contacter AddArt",
  },
  contactForm: {
    projectTypeLabel: "Type de projet",
    projectTypePlaceholder: "Selectionnez un type de projet",
    projectTypes: [
      { value: "character", label: "Character design / Cartoon" },
      { value: "key-art", label: "Jaquette de jeu / Key art" },
      { value: "commercial", label: "Graphisme commercial / Pub" },
      { value: "editorial", label: "Illustration editoriale" },
      { value: "motion", label: "Courte animation / Motion design" },
      { value: "logo-anim", label: "Logo anime" },
      { value: "autre", label: "Autre" },
    ],
    submitLabel: "Envoyer ma demande",
    submittingLabel: "Envoi en cours...",
    successTitle: "Demande envoyee !",
    successMessage: "Merci pour votre message. Nous vous recontactons sous 48 h.",
    disclaimer:
      "En soumettant ce formulaire, vous acceptez d'etre recontacte(e) par AddArt. Vos donnees sont traitees confidentiellement.",
  },
}

export type SiteSettingsSectionKey = "global"
export const siteSettingsSectionOrder: SiteSettingsSectionKey[] = ["global"]

type SiteContentEntry = {
  section: string
  content: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const mergeObject = <T extends Record<string, unknown>>(fallback: T, value: unknown): T => {
  if (!isRecord(value)) return fallback
  return {
    ...fallback,
    ...(value as Partial<T>),
  }
}

const mergeProjectTypes = (
  fallback: SiteSettingsContent["contactForm"]["projectTypes"],
  value: unknown,
): SiteSettingsContent["contactForm"]["projectTypes"] => {
  if (!Array.isArray(value)) return fallback
  const parsed = value
    .filter((entry) => isRecord(entry))
    .map((entry) => ({
      value: typeof entry.value === "string" ? entry.value : "",
      label: typeof entry.label === "string" ? entry.label : "",
    }))
    .filter((entry) => entry.value && entry.label)
  return parsed.length > 0 ? parsed : fallback
}

export const mergeSiteSettingsContent = (
  entries: SiteContentEntry[] = [],
): SiteSettingsContent => {
  const globalOverride = entries.find((entry) => entry.section === "global")?.content
  if (!isRecord(globalOverride)) return siteSettingsDefaults

  return {
    brand: mergeObject(siteSettingsDefaults.brand, globalOverride.brand),
    contact: mergeObject(siteSettingsDefaults.contact, globalOverride.contact),
    social: mergeObject(siteSettingsDefaults.social, globalOverride.social),
    legal: mergeObject(siteSettingsDefaults.legal, globalOverride.legal),
    cta: mergeObject(siteSettingsDefaults.cta, globalOverride.cta),
    contactForm: {
      ...mergeObject(siteSettingsDefaults.contactForm, globalOverride.contactForm),
      projectTypes: mergeProjectTypes(
        siteSettingsDefaults.contactForm.projectTypes,
        isRecord(globalOverride.contactForm) ? globalOverride.contactForm.projectTypes : undefined,
      ),
    },
  }
}
