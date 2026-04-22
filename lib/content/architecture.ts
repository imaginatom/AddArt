export type ArchitecturePageContent = {
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
  process: {
    title: string
    subtitle: string
    steps: Array<{
      step: string
      title: string
      description: string
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

export type ArchitecturePageSectionKey = keyof ArchitecturePageContent

export const architectureSectionOrder: ArchitecturePageSectionKey[] = [
  "hero",
  "intro",
  "services",
  "process",
  "cta",
  "crossLinks",
]

export const architecturePageDefaults: ArchitecturePageContent = {
  hero: {
    title: "Architecture & Gestion de Projet",
    subtitle:
      "Du diagnostic à la livraison, un accompagnement complet pour vos projets architecturaux en Algérie et en France.",
    breadcrumbHomeLabel: "Accueil",
    breadcrumbCurrentLabel: "Architecture",
    backgroundImage: {
      src: "/images/paysagiste-hero.jpg",
      alt: "Plans architecturaux et maquettes chez Noun Studio",
    },
  },
  intro: {
    title: "L'architecture au service de l'identité",
    body: "Chez Noun Studio, l'architecture n'est pas seulement une question de construction technique. C'est une expression culturelle, un outil de branding et un médium de sensibilisation sociale. Chaque projet est conçu avec une attention particulière à l'identité du lieu et de ses habitants.",
  },
  services: {
    title: "Nos services d'architecture",
    subtitle: "Un cycle complet de conception et de réalisation architecturale",
    items: [
      {
        title: "Architecture résidentielle",
        description:
          "Conception de maisons individuelles, villas et résidences. Nous créons des espaces de vie qui reflètent votre identité tout en répondant aux exigences techniques et réglementaires locales.",
        features: [
          "Diagnostic et étude de faisabilité",
          "Plans architecturaux complets",
          "Visualisation 3D photoréaliste",
          "Documentation réglementaire et administrative",
        ],
        image: {
          src: "/images/gallery-1.jpg",
          alt: "Villa résidentielle contemporaine conçue par Noun Studio",
        },
      },
      {
        title: "Espaces commerciaux",
        description:
          "Aménagement d'espaces professionnels, boutiques, restaurants et bureaux. Nous concevons des environnements qui renforcent votre image de marque et optimisent l'expérience de vos clients et collaborateurs.",
        features: [
          "Conception d'espaces de vente",
          "Aménagement de bureaux et coworking",
          "Design de restaurants et cafés",
          "Intégration de l'identité de marque",
        ],
        image: {
          src: "/images/gallery-3.jpg",
          alt: "Espace commercial moderne aménagé par Noun Studio",
        },
      },
      {
        title: "Rénovation & Restauration",
        description:
          "Modernisation de bâtiments existants dans le respect du patrimoine. Nous allions techniques contemporaines et sensibilité historique pour redonner vie à des espaces tout en préservant leur caractère.",
        features: [
          "Diagnostic de l'état existant",
          "Respect du patrimoine architectural",
          "Intégration d'éléments contemporains",
          "Réhabilitation et mise aux normes",
        ],
        image: {
          src: "/images/gallery-4.jpg",
          alt: "Rénovation patrimoniale avec éléments contemporains par Noun Studio",
        },
      },
      {
        title: "Suivi de chantier",
        description:
          "Accompagnement rigoureux de la construction, du premier coup de pioche à la réception finale. Nous assurons le respect des plans, des délais et du budget avec une documentation transparente à chaque étape.",
        features: [
          "Supervision de la construction",
          "Contrôle qualité continu",
          "Coordination des corps de métier",
          "Documentation photographique du chantier",
        ],
        image: {
          src: "/images/gallery-5.jpg",
          alt: "Suivi de chantier architectural par Noun Studio",
        },
      },
    ],
  },
  process: {
    title: "Notre processus",
    subtitle: "De la première consultation à la livraison, un accompagnement en 4 étapes.",
    steps: [
      {
        step: "01",
        title: "Consultation",
        description:
          "Prise de contact et échange sur votre projet. Nous analysons vos besoins, votre terrain et votre budget pour définir le cadre du projet.",
      },
      {
        step: "02",
        title: "Conception",
        description:
          "Esquisses, plans détaillés et visualisations 3D. Nous itons ensemble jusqu'à obtenir le design qui vous correspond parfaitement.",
      },
      {
        step: "03",
        title: "Réalisation",
        description:
          "Suivi rigoureux de la construction avec coordination des intervenants, contrôle qualité et respect des délais annoncés.",
      },
      {
        step: "04",
        title: "Livraison",
        description:
          "Réception du projet, vérification finale et remise des documents. Vous profitez de votre nouvel espace en toute sérénité.",
      },
    ],
  },
  cta: {
    title: "Vous avez un projet architectural ?",
    subtitle: "Décrivez-nous votre vision et recevez une consultation gratuite. Sans engagement.",
  },
  crossLinks: {
    title: "Nos autres expertises",
    cards: [
      {
        title: "Identité Visuelle & Branding",
        description: "Logos, chartes graphiques et systèmes d'identité pour entreprises et startups.",
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
  fallback: ArchitecturePageContent["services"]["items"],
  value: unknown,
): ArchitecturePageContent["services"]["items"] => {
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

const mergeStepList = (
  fallback: ArchitecturePageContent["process"]["steps"],
  value: unknown,
): ArchitecturePageContent["process"]["steps"] => {
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

const mergeCardList = (
  fallback: ArchitecturePageContent["crossLinks"]["cards"],
  value: unknown,
): ArchitecturePageContent["crossLinks"]["cards"] => {
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

export const mergeArchitectureContent = (
  entries: SiteContentEntry[] = [],
): ArchitecturePageContent => {
  const contentBySection = new Map(entries.map((entry) => [entry.section, entry.content]))

  const heroOverride = contentBySection.get("hero")
  const introOverride = contentBySection.get("intro")
  const servicesOverride = contentBySection.get("services")
  const processOverride = contentBySection.get("process")
  const ctaOverride = contentBySection.get("cta")
  const crossLinksOverride = contentBySection.get("crossLinks")

  return {
    hero: {
      ...mergeObject(architecturePageDefaults.hero, heroOverride),
      backgroundImage: mergeObject(
        architecturePageDefaults.hero.backgroundImage,
        isRecord(heroOverride) ? heroOverride.backgroundImage : undefined,
      ),
    },
    intro: mergeObject(architecturePageDefaults.intro, introOverride),
    services: {
      ...mergeObject(architecturePageDefaults.services, servicesOverride),
      items: mergeServiceList(
        architecturePageDefaults.services.items,
        isRecord(servicesOverride) ? servicesOverride.items : undefined,
      ),
    },
    process: {
      ...mergeObject(architecturePageDefaults.process, processOverride),
      steps: mergeStepList(
        architecturePageDefaults.process.steps,
        isRecord(processOverride) ? processOverride.steps : undefined,
      ),
    },
    cta: mergeObject(architecturePageDefaults.cta, ctaOverride),
    crossLinks: {
      ...mergeObject(architecturePageDefaults.crossLinks, crossLinksOverride),
      cards: mergeCardList(
        architecturePageDefaults.crossLinks.cards,
        isRecord(crossLinksOverride) ? crossLinksOverride.cards : undefined,
      ),
    },
  }
}
