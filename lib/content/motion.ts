export type MotionPageContent = {
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

export type MotionPageSectionKey = keyof MotionPageContent

export const motionSectionOrder: MotionPageSectionKey[] = [
  "hero",
  "intro",
  "services",
  "cta",
  "crossLinks",
]

export const motionPageDefaults: MotionPageContent = {
  hero: {
    title: "Motion, Animations & Vidéo",
    subtitle:
      "Courtes animations, motion design pour pubs, logos animés et storyboards. Du cartoon qui bouge, pensé pour capter l'attention en moins de 5 secondes.",
    breadcrumbHomeLabel: "Accueil",
    breadcrumbCurrentLabel: "Motion",
    backgroundImage: {
      src: "/images/elagage-hero.jpg",
      alt: "Frames d'une animation cartoon par AddArt",
    },
  },
  intro: {
    title: "Quand l'illustration prend vie",
    body: "Le motion design, c'est l'art de faire respirer un visuel. Chez AddArt, chaque animation est pensée comme une mini-mise en scène : timing, rythme, anticipation et fin percutante. Que ce soit pour une pub 6 secondes, une bannière animée ou une courte scène cartoon, nous livrons des vidéos prêtes à diffuser, sans aller-retour interminable.",
  },
  services: {
    title: "Nos prestations motion",
    subtitle: "De la boucle animée à la courte scène narrative",
    items: [
      {
        title: "Animations courtes",
        description:
          "Scènes cartoon de 5 à 30 secondes : bumpers, intros, skits, gags visuels. Parfait pour réseaux sociaux, contenu éditorial ou teasers de projet.",
        features: [
          "Storyboard & animatique",
          "Animation frame par frame ou rigging 2D",
          "Sound design léger inclus",
          "Livraison MP4 / MOV / GIF",
        ],
        image: {
          src: "/images/gallery-2.jpg",
          alt: "Courte animation cartoon par AddArt",
        },
      },
      {
        title: "Motion design pour pubs",
        description:
          "Publicités animées pour réseaux sociaux, YouTube, display et télévision. Formats courts, message clair, punch visuel — optimisés pour les plateformes ciblées.",
        features: [
          "Formats carré, vertical & horizontal",
          "Adaptations 6s / 15s / 30s",
          "Sous-titres & versions silencieuses",
          "Export optimisé par plateforme",
        ],
        image: {
          src: "/images/elagage-hero.jpg",
          alt: "Publicité animée cartoon par AddArt",
        },
      },
      {
        title: "Logos animés & brand reveal",
        description:
          "Donnez de la vie à votre identité. Animations de logo pour intros vidéo, signatures de fin, splash screens d'app et moments clés de campagne.",
        features: [
          "Animation logo en boucle ou révélation",
          "Versions claire & foncée",
          "Décomposition pour réutilisation",
          "Fichiers After Effects source",
        ],
        image: {
          src: "/images/gallery-6.jpg",
          alt: "Animation de logo et brand reveal par AddArt",
        },
      },
      {
        title: "Storyboards & animatics",
        description:
          "Avant la prod lourde : un storyboard solide économise des semaines. Nous produisons boards détaillés et animatics commentés pour clients, studios ou productions internes.",
        features: [
          "Storyboards détaillés",
          "Animatics commentés",
          "Découpage technique",
          "Références caméra & timing",
        ],
        image: {
          src: "/images/contact-hero.jpg",
          alt: "Storyboard et animatic par AddArt",
        },
      },
    ],
  },
  cta: {
    title: "Une animation à produire ?",
    subtitle:
      "Décrivez-nous votre projet, son objectif et la plateforme de diffusion. Nous vous proposons une approche adaptée à votre budget.",
  },
  crossLinks: {
    title: "Nos autres expertises",
    cards: [
      {
        title: "Illustration & Cartoon Art",
        description:
          "Character design, jaquettes de jeux et graphismes commerciaux.",
      },
      {
        title: "Notre portfolio",
        description: "Parcourez nos illustrations, jaquettes, graphismes et animations.",
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
  fallback: MotionPageContent["services"]["items"],
  value: unknown,
): MotionPageContent["services"]["items"] => {
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
  fallback: MotionPageContent["crossLinks"]["cards"],
  value: unknown,
): MotionPageContent["crossLinks"]["cards"] => {
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

export const mergeMotionContent = (
  entries: SiteContentEntry[] = [],
): MotionPageContent => {
  const contentBySection = new Map(entries.map((entry) => [entry.section, entry.content]))

  const heroOverride = contentBySection.get("hero")
  const introOverride = contentBySection.get("intro")
  const servicesOverride = contentBySection.get("services")
  const ctaOverride = contentBySection.get("cta")
  const crossLinksOverride = contentBySection.get("crossLinks")

  return {
    hero: {
      ...mergeObject(motionPageDefaults.hero, heroOverride),
      backgroundImage: mergeObject(
        motionPageDefaults.hero.backgroundImage,
        isRecord(heroOverride) ? heroOverride.backgroundImage : undefined,
      ),
    },
    intro: mergeObject(motionPageDefaults.intro, introOverride),
    services: {
      ...mergeObject(motionPageDefaults.services, servicesOverride),
      items: mergeServiceList(
        motionPageDefaults.services.items,
        isRecord(servicesOverride) ? servicesOverride.items : undefined,
      ),
    },
    cta: mergeObject(motionPageDefaults.cta, ctaOverride),
    crossLinks: {
      ...mergeObject(motionPageDefaults.crossLinks, crossLinksOverride),
      cards: mergeCardList(
        motionPageDefaults.crossLinks.cards,
        isRecord(crossLinksOverride) ? crossLinksOverride.cards : undefined,
      ),
    },
  }
}
