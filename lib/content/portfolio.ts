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
    title: "Nos créations",
    subtitle:
      "Personnages, jaquettes de jeux, illustrations commerciales et frames animées. Une sélection de projets réalisés pour des studios, marques et éditeurs.",
    breadcrumbHomeLabel: "Accueil",
    breadcrumbCurrentLabel: "Portfolio",
  },
  gallery: {
    categories: ["Tous", "Cartoons", "Game Covers", "Commercial", "Motion", "Editorial"],
    projects: [
      {
        title: "Mascotte Cartoon",
        description:
          "Création d'une mascotte pour une marque lifestyle : silhouette, expressions et déclinaisons pour réseaux sociaux.",
        location: "Oran",
        category: "Cartoons",
        image: {
          src: "/images/gallery-1.jpg",
          alt: "Mascotte cartoon colorée par AddArt",
        },
      },
      {
        title: "Jaquette Indie Game",
        description:
          "Key art et jaquette pour un jeu indépendant : composition cinématique et déclinaisons store.",
        location: "Alger",
        category: "Game Covers",
        image: {
          src: "/images/gallery-2.jpg",
          alt: "Jaquette de jeu indie par AddArt",
        },
      },
      {
        title: "Campagne Pub Restaurant",
        description:
          "Série d'illustrations pour une campagne publicitaire : affiches, displays et posts animés.",
        location: "Oran",
        category: "Commercial",
        image: {
          src: "/images/gallery-3.jpg",
          alt: "Illustration publicitaire pour restaurant par AddArt",
        },
      },
      {
        title: "Character Design Série",
        description:
          "Conception de la distribution pour une série courte d'animations : 6 personnages principaux.",
        location: "Oran",
        category: "Cartoons",
        image: {
          src: "/images/gallery-4.jpg",
          alt: "Character design série animée par AddArt",
        },
      },
      {
        title: "Intro Animée YouTube",
        description:
          "Intro animée 5s pour chaîne YouTube : logo reveal, effet cartoon et jingle sonore.",
        location: "Alger",
        category: "Motion",
        image: {
          src: "/images/hero-bg.jpg",
          alt: "Intro animée cartoon par AddArt",
        },
      },
      {
        title: "Jaquette Jeu Mobile",
        description:
          "Key art et déclinaisons store (App Store, Google Play) pour un jeu mobile cartoon.",
        location: "Oran",
        category: "Game Covers",
        image: {
          src: "/images/gallery-6.jpg",
          alt: "Jaquette jeu mobile par AddArt",
        },
      },
      {
        title: "Série Illustrations Sociales",
        description:
          "Illustrations hebdomadaires pour le feed d'une marque : thème récurrent et ton humoristique.",
        location: "Oran",
        category: "Commercial",
        image: {
          src: "/images/elagage-hero.jpg",
          alt: "Illustrations réseaux sociaux par AddArt",
        },
      },
      {
        title: "Motion Ad 15s",
        description:
          "Publicité animée 15 secondes pour Instagram Reels et TikTok, adaptée en formats carré et vertical.",
        location: "Constantine",
        category: "Motion",
        image: {
          src: "/images/gallery-5.jpg",
          alt: "Publicité animée courte par AddArt",
        },
      },
      {
        title: "Couverture Livre Illustré",
        description:
          "Couverture et illustrations intérieures pour un livre jeunesse : direction artistique complète.",
        location: "Alger",
        category: "Editorial",
        image: {
          src: "/images/why-us.jpg",
          alt: "Couverture livre illustré par AddArt",
        },
      },
      {
        title: "Poster Cartoon Événement",
        description:
          "Affiche illustrée pour un événement culturel : 3 déclinaisons et supports print.",
        location: "Oran",
        category: "Commercial",
        image: {
          src: "/images/paysagiste-hero.jpg",
          alt: "Poster cartoon événement par AddArt",
        },
      },
      {
        title: "Logo Animé Startup",
        description:
          "Animation 3 secondes du logo pour intros vidéo, splash screens et signatures d'email.",
        location: "Alger",
        category: "Motion",
        image: {
          src: "/images/contact-hero.jpg",
          alt: "Animation logo startup par AddArt",
        },
      },
    ],
  },
  cta: {
    title: "Votre projet est le prochain ?",
    subtitle: "Contactez-nous pour parler de votre idée — devis gratuit et sans engagement.",
    primaryCtaLabel: "Discutons ensemble",
    primaryCtaHref: "/contact",
    emailLabel: "addart69@gmail.com",
    emailAddress: "addart69@gmail.com",
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
