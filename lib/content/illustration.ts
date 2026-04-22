export type IllustrationPageContent = {
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

export type IllustrationPageSectionKey = keyof IllustrationPageContent

export const illustrationSectionOrder: IllustrationPageSectionKey[] = [
  "hero",
  "intro",
  "services",
  "process",
  "cta",
  "crossLinks",
]

export const illustrationPageDefaults: IllustrationPageContent = {
  hero: {
    title: "Illustration & Cartoon Art",
    subtitle:
      "Character design, key art, jaquettes de jeux et graphismes commerciaux. Un style cartoon expressif pensé pour captiver.",
    breadcrumbHomeLabel: "Accueil",
    breadcrumbCurrentLabel: "Illustration",
    backgroundImage: {
      src: "/images/paysagiste-hero.jpg",
      alt: "Planche d'illustrations cartoon par AddArt",
    },
  },
  intro: {
    title: "L'illustration comme langage visuel",
    body: "Chez AddArt, l'illustration n'est pas un ornement : c'est un langage. Chaque trait, chaque couleur et chaque pose servent une histoire, une marque ou un univers de jeu. Nous travaillons autant pour le divertissement que pour la communication, avec une même exigence sur la lisibilité, la personnalité et l'impact.",
  },
  services: {
    title: "Nos services d'illustration",
    subtitle: "Du character design à la jaquette de jeu, en passant par les graphismes pubs",
    items: [
      {
        title: "Character Design & Cartoons",
        description:
          "Création de personnages pour jeux, animations, marques et campagnes. Silhouettes reconnaissables, palettes colorées et variations d'expressions prêtes à l'emploi.",
        features: [
          "Concepts initiaux & itérations",
          "Turnaround (face, profil, dos)",
          "Feuille d'expressions & poses",
          "Versions vectorielles & rasterisées",
        ],
        image: {
          src: "/images/gallery-1.jpg",
          alt: "Character design cartoon par AddArt",
        },
      },
      {
        title: "Key Art & Jaquettes de jeux",
        description:
          "Illustrations promotionnelles pour jeux vidéo, mobile, indie et éditeurs. Des visuels qui vendent l'émotion, l'univers et le gameplay d'un seul coup d'œil.",
        features: [
          "Composition cinématique",
          "Variations pour stores & boutiques",
          "Déclinaisons bannières & réseaux",
          "Livrables haute résolution (print/digital)",
        ],
        image: {
          src: "/images/gallery-3.jpg",
          alt: "Key art et jaquette de jeu par AddArt",
        },
      },
      {
        title: "Graphismes commerciaux",
        description:
          "Visuels pour publicités, campagnes, réseaux sociaux et supports marketing. Des illustrations pensées pour convertir, tout en restant fidèles à votre identité de marque.",
        features: [
          "Visuels pubs print & digital",
          "Kits réseaux sociaux illustrés",
          "Affiches & displays événementiels",
          "Mascottes & ambassadeurs de marque",
        ],
        image: {
          src: "/images/gallery-4.jpg",
          alt: "Affiche publicitaire illustrée par AddArt",
        },
      },
      {
        title: "Illustrations éditoriales",
        description:
          "Illustrations pour articles, magazines, livres et récits visuels. Un ton narratif au service du message, avec une direction artistique cohérente d'un projet à l'autre.",
        features: [
          "Illustrations narratives",
          "Couvertures & spots éditoriaux",
          "Livres illustrés & jeunesse",
          "Storyboards courts",
        ],
        image: {
          src: "/images/gallery-5.jpg",
          alt: "Illustration éditoriale narrative par AddArt",
        },
      },
    ],
  },
  process: {
    title: "Notre processus",
    subtitle: "De la première idée à la livraison finale, un accompagnement en 4 étapes.",
    steps: [
      {
        step: "01",
        title: "Brief",
        description:
          "Premier échange sur l'univers, le ton, les références et les contraintes. Nous clarifions le besoin et définissons les livrables.",
      },
      {
        step: "02",
        title: "Concept",
        description:
          "Esquisses, recherches de silhouettes et propositions de direction. Vous choisissez la piste que nous allons développer.",
      },
      {
        step: "03",
        title: "Révisions",
        description:
          "Itérations sur la piste retenue : poses, couleurs, détails et ajustements. Objectif : un visuel que vous validez sans réserve.",
      },
      {
        step: "04",
        title: "Livraison",
        description:
          "Fichiers finaux dans tous les formats utiles (PNG, PSD, vector, haute résolution). Accompagnement sur les déclinaisons éventuelles.",
      },
    ],
  },
  cta: {
    title: "Un personnage, un visuel, une jaquette à créer ?",
    subtitle: "Parlez-nous de votre projet — devis gratuit et sans engagement.",
  },
  crossLinks: {
    title: "Nos autres expertises",
    cards: [
      {
        title: "Motion & Animations",
        description: "Courtes animations, motion design pour pubs et logos animés.",
      },
      {
        title: "Notre portfolio",
        description: "Parcourez nos illustrations, jaquettes, graphismes et frames animées.",
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
  fallback: IllustrationPageContent["services"]["items"],
  value: unknown,
): IllustrationPageContent["services"]["items"] => {
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
  fallback: IllustrationPageContent["process"]["steps"],
  value: unknown,
): IllustrationPageContent["process"]["steps"] => {
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
  fallback: IllustrationPageContent["crossLinks"]["cards"],
  value: unknown,
): IllustrationPageContent["crossLinks"]["cards"] => {
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

export const mergeIllustrationContent = (
  entries: SiteContentEntry[] = [],
): IllustrationPageContent => {
  const contentBySection = new Map(entries.map((entry) => [entry.section, entry.content]))

  const heroOverride = contentBySection.get("hero")
  const introOverride = contentBySection.get("intro")
  const servicesOverride = contentBySection.get("services")
  const processOverride = contentBySection.get("process")
  const ctaOverride = contentBySection.get("cta")
  const crossLinksOverride = contentBySection.get("crossLinks")

  return {
    hero: {
      ...mergeObject(illustrationPageDefaults.hero, heroOverride),
      backgroundImage: mergeObject(
        illustrationPageDefaults.hero.backgroundImage,
        isRecord(heroOverride) ? heroOverride.backgroundImage : undefined,
      ),
    },
    intro: mergeObject(illustrationPageDefaults.intro, introOverride),
    services: {
      ...mergeObject(illustrationPageDefaults.services, servicesOverride),
      items: mergeServiceList(
        illustrationPageDefaults.services.items,
        isRecord(servicesOverride) ? servicesOverride.items : undefined,
      ),
    },
    process: {
      ...mergeObject(illustrationPageDefaults.process, processOverride),
      steps: mergeStepList(
        illustrationPageDefaults.process.steps,
        isRecord(processOverride) ? processOverride.steps : undefined,
      ),
    },
    cta: mergeObject(illustrationPageDefaults.cta, ctaOverride),
    crossLinks: {
      ...mergeObject(illustrationPageDefaults.crossLinks, crossLinksOverride),
      cards: mergeCardList(
        illustrationPageDefaults.crossLinks.cards,
        isRecord(crossLinksOverride) ? crossLinksOverride.cards : undefined,
      ),
    },
  }
}
