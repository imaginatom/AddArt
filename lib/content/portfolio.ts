export type PortfolioPageContent = {
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    breadcrumbHomeLabel: string
    breadcrumbCurrentLabel: string
  }
  gallery: {
    categories: string[]
    projects: Array<{
      title: string
      description: string
      location: string
      category: string
      image: {
        src: string
        alt: string
        path?: string | null
      }
    }>
  }
  cta: {
    title: string
    subtitle: string
    primaryCtaLabel: string
    primaryCtaHref: string
    emailLabel: string
    emailAddress: string
  }
}

export type PortfolioPageSectionKey = keyof PortfolioPageContent

export const portfolioSectionOrder: PortfolioPageSectionKey[] = ["hero", "gallery", "cta"]

export const portfolioPageDefaults: PortfolioPageContent = {
  hero: {
    eyebrow: "Portfolio",
    title: "Nos Réalisations",
    subtitle:
      "Projets d'architecture, d'identité visuelle et de design réalisés en Algérie et en France.",
    breadcrumbHomeLabel: "Accueil",
    breadcrumbCurrentLabel: "Portfolio",
  },
  gallery: {
    categories: ["Tous", "Architecture", "Branding", "Intérieur", "Rénovation"],
    projects: [
      {
        title: "Villa Contemporaine",
        description:
          "Conception complète d'une villa résidentielle avec terrasse panoramique et jardin méditerranéen.",
        location: "Alger",
        category: "Architecture",
        image: {
          src: "/images/gallery-1.jpg",
          alt: "Villa résidentielle contemporaine en Algérie par Noun Studio",
        },
      },
      {
        title: "Branding Startup Tech",
        description: "Logo, charte graphique et supports de communication pour une startup technologique.",
        location: "Oran",
        category: "Branding",
        image: {
          src: "/images/gallery-2.jpg",
          alt: "Identité visuelle pour startup par Noun Studio",
        },
      },
      {
        title: "Espace Commercial",
        description: "Aménagement intérieur d'un espace de coworking avec identité architecturale forte.",
        location: "Alger",
        category: "Intérieur",
        image: {
          src: "/images/gallery-3.jpg",
          alt: "Aménagement intérieur espace commercial par Noun Studio",
        },
      },
      {
        title: "Restauration Patrimoniale",
        description: "Rénovation d'un bâtiment historique avec intégration d'éléments contemporains.",
        location: "Constantine",
        category: "Rénovation",
        image: {
          src: "/images/gallery-4.jpg",
          alt: "Rénovation patrimoine architectural algérien par Noun Studio",
        },
      },
      {
        title: "Résidence Moderne",
        description:
          "Conception d'une résidence familiale aux lignes épurées avec optimisation de la lumière naturelle.",
        location: "Blida",
        category: "Architecture",
        image: {
          src: "/images/hero-bg.jpg",
          alt: "Architecture contemporaine par Noun Studio",
        },
      },
      {
        title: "Boutique Retail",
        description: "Design intérieur d'une boutique haut de gamme avec mise en scène des produits.",
        location: "Alger",
        category: "Intérieur",
        image: {
          src: "/images/gallery-6.jpg",
          alt: "Design intérieur boutique par Noun Studio",
        },
      },
      {
        title: "Branding Restaurant",
        description: "Création d'identité complète pour un restaurant : du nom à la décoration intérieure.",
        location: "Oran",
        category: "Branding",
        image: {
          src: "/images/elagage-hero.jpg",
          alt: "Identité visuelle restaurant par Noun Studio",
        },
      },
      {
        title: "Visualisation 3D",
        description: "Rendu 3D photoréaliste d'un projet de villa avec piscine avant construction.",
        location: "Alger",
        category: "Architecture",
        image: {
          src: "/images/gallery-5.jpg",
          alt: "Visualisation 3D villa par Noun Studio",
        },
      },
      {
        title: "Identité Cabinet Médical",
        description: "Branding complet pour un cabinet médical : logo, signalétique et décoration intérieure.",
        location: "Constantine",
        category: "Branding",
        image: {
          src: "/images/why-us.jpg",
          alt: "Studio d'architecture Noun Studio",
        },
      },
      {
        title: "Complexe Résidentiel",
        description: "Conception architecturale d'un ensemble résidentiel de 12 logements.",
        location: "Blida",
        category: "Architecture",
        image: {
          src: "/images/paysagiste-hero.jpg",
          alt: "Plans architecturaux par Noun Studio",
        },
      },
      {
        title: "Siège Social",
        description: "Rénovation et aménagement du siège social d'une entreprise de services.",
        location: "Alger",
        category: "Rénovation",
        image: {
          src: "/images/contact-hero.jpg",
          alt: "Aménagement bureaux par Noun Studio",
        },
      },
    ],
  },
  cta: {
    title: "Votre projet est le prochain ?",
    subtitle: "Contactez-nous pour discuter de votre projet et obtenir une consultation gratuite.",
    primaryCtaLabel: "Discutons ensemble",
    primaryCtaHref: "/contact",
    emailLabel: "contact@nounstudio.dz",
    emailAddress: "contact@nounstudio.dz",
  },
}

type SiteContentEntry = {
  section: string
  content: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const mergeObject = <T extends Record<string, unknown>>(fallback: T, value: unknown): T => {
  if (!isRecord(value)) {
    return fallback
  }
  return {
    ...fallback,
    ...(value as Partial<T>),
  }
}

const mergeStringArray = (fallback: string[], value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return fallback
  }
  const allStrings = value.every((entry) => typeof entry === "string")
  return allStrings ? (value as string[]) : fallback
}

const mergeProjectList = (
  fallback: PortfolioPageContent["gallery"]["projects"],
  value: unknown,
): PortfolioPageContent["gallery"]["projects"] => {
  if (!Array.isArray(value)) {
    return fallback
  }
  return fallback.map((item, index) => {
    const entry = value[index]
    if (!isRecord(entry)) {
      return item
    }
    return {
      ...item,
      ...(entry as Partial<typeof item>),
      image: mergeObject(item.image, entry.image),
    }
  })
}

export const mergePortfolioContent = (
  entries: SiteContentEntry[] = [],
): PortfolioPageContent => {
  const contentBySection = new Map(entries.map((entry) => [entry.section, entry.content]))

  const heroOverride = contentBySection.get("hero")
  const galleryOverride = contentBySection.get("gallery")
  const ctaOverride = contentBySection.get("cta")

  return {
    hero: mergeObject(portfolioPageDefaults.hero, heroOverride),
    gallery: {
      ...mergeObject(portfolioPageDefaults.gallery, galleryOverride),
      categories: mergeStringArray(
        portfolioPageDefaults.gallery.categories,
        isRecord(galleryOverride) ? galleryOverride.categories : undefined,
      ),
      projects: mergeProjectList(
        portfolioPageDefaults.gallery.projects,
        isRecord(galleryOverride) ? galleryOverride.projects : undefined,
      ),
    },
    cta: mergeObject(portfolioPageDefaults.cta, ctaOverride),
  }
}
