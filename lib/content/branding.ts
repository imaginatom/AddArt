export type BrandingPageContent = {
  hero: {
    title: string
    subtitle: string
    breadcrumbHomeLabel: string
    breadcrumbCurrentLabel: string
    backgroundImage: {
      src: string
      alt: string
      path?: string | null
    }
  }
  intro: {
    title: string
    body: string
  }
  services: {
    title: string
    subtitle: string
    items: Array<{
      title: string
      description: string
      features: string[]
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
  }
  crossLinks: {
    title: string
    cards: Array<{
      title: string
      description: string
    }>
  }
}

export type BrandingPageSectionKey = keyof BrandingPageContent

export const brandingSectionOrder: BrandingPageSectionKey[] = [
  "hero",
  "intro",
  "services",
  "cta",
  "crossLinks",
]

export const brandingPageDefaults: BrandingPageContent = {
  hero: {
    title: "Identité Visuelle & Branding",
    subtitle:
      "Plus de 70 identités visuelles créées pour des entreprises et startups en Algérie et en France.",
    breadcrumbHomeLabel: "Accueil",
    breadcrumbCurrentLabel: "Branding",
    backgroundImage: {
      src: "/images/elagage-hero.jpg",
      alt: "Design d'identité visuelle par Noun Studio",
    },
  },
  intro: {
    title: "Votre marque mérite une identité à la hauteur de votre ambition",
    body: "Le branding n'est pas qu'un logo. C'est l'ensemble des signaux visuels qui communiquent qui vous êtes, ce que vous faites et pourquoi vous comptez. Chez Noun Studio, nous abordons chaque projet d'identité visuelle avec la même rigueur et la même sensibilité que nos projets d'architecture : analyse, conception, itération et livraison impeccable.",
  },
  services: {
    title: "Nos prestations de branding",
    subtitle: "De la conception du logo à la déclinaison sur tous vos supports",
    items: [
      {
        title: "Conception de logo",
        description:
          "Votre logo est la première impression que vous laissez. Nous concevons des logos distinctifs, mémorables et adaptés à tous les supports, du digital à l'enseigne physique.",
        features: [
          "Recherche et brainstorming créatif",
          "Propositions multiples et itérations",
          "Déclinaisons couleur, noir et blanc",
          "Fichiers vectoriels tous formats",
        ],
        image: {
          src: "/images/gallery-2.jpg",
          alt: "Conception de logo et identité visuelle par Noun Studio",
        },
      },
      {
        title: "Système d'identité",
        description:
          "Au-delà du logo, nous créons un système visuel complet et cohérent : typographie, palette de couleurs, iconographie, grilles de mise en page et règles d'utilisation.",
        features: [
          "Palette typographique complète",
          "Système de couleurs et motifs",
          "Iconographie et éléments graphiques",
          "Grilles de mise en page",
        ],
        image: {
          src: "/images/elagage-hero.jpg",
          alt: "Système d'identité visuelle complet par Noun Studio",
        },
      },
      {
        title: "Charte graphique",
        description:
          "La charte graphique est le guide de référence de votre marque. Nous produisons un document complet qui garantit la cohérence de votre communication sur tous les supports et à long terme.",
        features: [
          "Document de référence illustré",
          "Règles d'utilisation détaillées",
          "Exemples d'applications concrètes",
          "Versions print et digitale",
        ],
        image: {
          src: "/images/gallery-6.jpg",
          alt: "Charte graphique professionnelle par Noun Studio",
        },
      },
      {
        title: "Supports de communication",
        description:
          "Cartes de visite, kits réseaux sociaux, supports marketing et signalétique. Nous déclinons votre identité sur tous les points de contact avec vos clients.",
        features: [
          "Cartes de visite et papeterie",
          "Templates réseaux sociaux",
          "Supports marketing print et digital",
          "Signalétique et enseigne",
        ],
        image: {
          src: "/images/contact-hero.jpg",
          alt: "Supports de communication et marketing par Noun Studio",
        },
      },
    ],
  },
  cta: {
    title: "Besoin d'une identité visuelle ?",
    subtitle:
      "Décrivez-nous votre activité et vos objectifs. Nous vous proposerons une approche sur mesure.",
  },
  crossLinks: {
    title: "Nos autres expertises",
    cards: [
      {
        title: "Architecture & Gestion de Projet",
        description:
          "Conception résidentielle et commerciale, rénovation et suivi de chantier.",
      },
      {
        title: "Notre portfolio",
        description: "Parcourez nos projets d'architecture, de branding et de design.",
      },
    ],
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

const mergeServiceList = (
  fallback: BrandingPageContent["services"]["items"],
  value: unknown,
): BrandingPageContent["services"]["items"] => {
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
      features: mergeStringArray(item.features, entry.features),
      image: mergeObject(item.image, entry.image),
    }
  })
}

const mergeCardList = (
  fallback: BrandingPageContent["crossLinks"]["cards"],
  value: unknown,
): BrandingPageContent["crossLinks"]["cards"] => {
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
    }
  })
}

export const mergeBrandingContent = (
  entries: SiteContentEntry[] = [],
): BrandingPageContent => {
  const contentBySection = new Map(entries.map((entry) => [entry.section, entry.content]))

  const heroOverride = contentBySection.get("hero")
  const introOverride = contentBySection.get("intro")
  const servicesOverride = contentBySection.get("services")
  const ctaOverride = contentBySection.get("cta")
  const crossLinksOverride = contentBySection.get("crossLinks")

  return {
    hero: {
      ...mergeObject(brandingPageDefaults.hero, heroOverride),
      backgroundImage: mergeObject(
        brandingPageDefaults.hero.backgroundImage,
        isRecord(heroOverride) ? heroOverride.backgroundImage : undefined,
      ),
    },
    intro: mergeObject(brandingPageDefaults.intro, introOverride),
    services: {
      ...mergeObject(brandingPageDefaults.services, servicesOverride),
      items: mergeServiceList(
        brandingPageDefaults.services.items,
        isRecord(servicesOverride) ? servicesOverride.items : undefined,
      ),
    },
    cta: mergeObject(brandingPageDefaults.cta, ctaOverride),
    crossLinks: {
      ...mergeObject(brandingPageDefaults.crossLinks, crossLinksOverride),
      cards: mergeCardList(
        brandingPageDefaults.crossLinks.cards,
        isRecord(crossLinksOverride) ? crossLinksOverride.cards : undefined,
      ),
    },
  }
}
