export type HomePageContent = {
  hero: {
    badgeText: string
    title: string
    subtitle: string
    trustBullets: string[]
    primaryCtaLabel: string
    secondaryCtaLabel: string
    backgroundImage: {
      src: string
      alt: string
      path?: string | null
    }
  }
  socialProof: {
    stats: Array<{
      value: string
      label: string
    }>
  }
  services: {
    eyebrow: string
    title: string
    items: Array<{
      title: string
      description: string
    }>
  }
  whyUs: {
    eyebrow: string
    title: string
    image: {
      src: string
      alt: string
      path?: string | null
    }
    floatingBadge: {
      value: string
      label: string
    }
    benefits: Array<{
      title: string
      description: string
    }>
    ctaLabel: string
  }
  testimonials: {
    eyebrow: string
    title: string
    items: Array<{
      stars: number
      text: string
      name: string
      city: string
    }>
  }
  galleryPreview: {
    eyebrow: string
    title: string
    subtitle: string
    ctaLabel: string
  }
  localSeo: {
    eyebrow: string
    title: string
    body: string
    highlights: Array<{
      title: string
      description: string
    }>
  }
  contactCta: {
    title: string
    subtitle: string
    emailLabel: string
    emailAddress: string
  }
}

export type HomePageSectionKey = keyof HomePageContent

export const homePageSectionOrder: HomePageSectionKey[] = [
  'hero',
  'socialProof',
  'services',
  'whyUs',
  'testimonials',
  'galleryPreview',
  'localSeo',
  'contactCta',
]

export const homePageDefaults: HomePageContent = {
  hero: {
    badgeText: '01 · Studio AddArt',
    title: 'Illustration, Motion & Direction Artistique.',
    subtitle:
      "Studio indépendant d'illustration cartoon et de motion design. Basé à Oran, au service de marques, studios et éditeurs de jeux — en Algérie comme à l'international.",
    trustBullets: [
      'Illustrations cartoon & character design',
      'Jaquettes de jeux & key art',
      'Motion design & animations courtes',
      'Graphismes pour pubs et campagnes',
    ],
    primaryCtaLabel: 'Démarrer un projet',
    secondaryCtaLabel: 'Voir le portfolio',
    backgroundImage: {
      src: '/images/hero-bg.jpg',
      alt: 'Illustrations colorées et scènes cartoon par AddArt',
    },
  },
  socialProof: {
    stats: [
      { value: '100+', label: 'illustrations livrées' },
      { value: '30+', label: 'jaquettes & key art' },
      { value: '50+', label: 'animations courtes' },
      { value: '7', label: "ans d'expérience" },
    ],
  },
  services: {
    eyebrow: 'Nos expertises',
    title: 'Un studio visuel au service de vos projets',
    items: [
      {
        title: 'Illustration & Cartoon Art',
        description:
          "Character design, illustrations cartoon, key art et graphismes commerciaux. Un style expressif, coloré et taillé pour capter l'attention.",
      },
      {
        title: 'Motion & Animations',
        description:
          "Courtes animations, motion design pour pubs, logos animés et storyboards. De l'idée à la vidéo finale prête à diffuser.",
      },
      {
        title: 'Commandes sur-mesure',
        description:
          "Briefs créatifs, collaborations studio et projets hybrides. Parlons ensemble de votre univers et de l'effet recherché.",
      },
    ],
  },
  whyUs: {
    eyebrow: 'Notre approche',
    title: 'Pourquoi travailler avec AddArt ?',
    image: {
      src: '/images/why-us.jpg',
      alt: "L'artiste AddArt au travail sur une illustration cartoon",
    },
    floatingBadge: {
      value: '180+',
      label: 'projets livrés',
    },
    benefits: [
      {
        title: 'Style distinct',
        description:
          "Un univers cartoon reconnaissable, taillé pour le divertissement, le jeu vidéo et les marques audacieuses.",
      },
      {
        title: 'Polyvalence',
        description:
          "De l'illustration statique à la courte animation, une seule équipe pour un résultat cohérent.",
      },
      {
        title: 'Direction artistique',
        description:
          "Chaque projet est piloté comme une mini-direction artistique : cohérence, lisibilité, impact.",
      },
      {
        title: 'Collaboration fluide',
        description:
          "Itérations rapides, briefs clairs, fichiers livrés dans tous les formats dont vous avez besoin.",
      },
      {
        title: 'Respect des délais',
        description:
          "Planning par jalons et communication constante — pas de mauvaises surprises en fin de projet.",
      },
    ],
    ctaLabel: 'Discutons de votre projet',
  },
  testimonials: {
    eyebrow: 'Témoignages',
    title: 'Ce que disent les clients',
    items: [
      {
        stars: 5,
        text: "AddArt a créé les personnages et la jaquette de notre jeu mobile. Le style cartoon est exactement ce qu'on voulait — expressif, coloré, et reconnaissable en un coup d'œil.",
        name: 'Karim B.',
        city: 'Oran',
      },
      {
        stars: 5,
        text: "On a collaboré sur une courte animation pour une campagne publicitaire. Motion design impeccable, timing parfait, et une vraie patte visuelle. On revient sur tous nos projets.",
        name: 'Amina H.',
        city: 'Alger',
      },
      {
        stars: 5,
        text: "Brief flou au départ, résultat clair à l'arrivée. Les illustrations commerciales livrées pour notre marque ont directement boosté nos performances sur les réseaux sociaux.",
        name: 'Yacine M.',
        city: 'Constantine',
      },
      {
        stars: 5,
        text: "Character design fantastique pour notre série d'animations courtes. Les personnages ont une vraie personnalité et se déclinent parfaitement sur tous les supports.",
        name: 'Sara T.',
        city: 'Oran',
      },
      {
        stars: 5,
        text: "Livraison rapide, révisions prises en compte sans broncher, fichiers impeccables. Le mix illustration + motion sous un même toit simplifie vraiment la vie.",
        name: 'Djamel F.',
        city: 'Blida',
      },
    ],
  },
  galleryPreview: {
    eyebrow: 'Portfolio',
    title: 'Quelques créations récentes',
    subtitle: 'Personnages, jaquettes de jeux, illustrations et frames animées',
    ctaLabel: 'Voir tout le portfolio',
  },
  localSeo: {
    eyebrow: 'Présence locale',
    title: 'Basé à Oran, Algérie',
    body:
      "AddArt est installé à Oran et collabore avec des studios, éditeurs de jeux, agences et marques partout en Algérie et à l'international. Nos créations — illustration, motion, direction artistique — sont pensées pour voyager aussi bien sur mobile que sur grand écran.",
    highlights: [
      {
        title: 'Illustration à Oran',
        description:
          "Character design, cartoons et key art livrés pour des clients locaux, nationaux et internationaux depuis Oran.",
      },
      {
        title: 'Motion design',
        description:
          "Courtes animations, motion pour pubs et réseaux sociaux. Des livrables prêts à diffuser en 1080p ou 4K.",
      },
      {
        title: 'Graphismes & Game Covers',
        description:
          "Jaquettes de jeux, affiches, bannières et campagnes. Un univers cartoon qui fonctionne aussi sur étagère qu'en feed.",
      },
    ],
  },
  contactCta: {
    title: 'Parlons de votre projet',
    subtitle: 'Devis gratuit — réponse sous 48 h',
    emailLabel: 'Email',
    emailAddress: 'addart69@gmail.com',
  },
}

type SiteContentEntry = {
  section: string
  content: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const mergeObject = <T extends Record<string, unknown>>(
  fallback: T,
  value: unknown,
): T => {
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
  const allStrings = value.every((entry) => typeof entry === 'string')
  return allStrings ? (value as string[]) : fallback
}

const mergeList = <T extends Record<string, unknown>>(
  fallback: T[],
  value: unknown,
): T[] => {
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
      ...(entry as Partial<T>),
    }
  })
}

export const mergeHomePageContent = (
  entries: SiteContentEntry[] = [],
): HomePageContent => {
  const contentBySection = new Map(
    entries.map((entry) => [entry.section, entry.content]),
  )

  const heroOverride = contentBySection.get('hero')
  const heroBase = mergeObject(homePageDefaults.hero, heroOverride)
  const socialProofOverride = contentBySection.get('socialProof')
  const servicesOverride = contentBySection.get('services')
  const whyUsOverride = contentBySection.get('whyUs')
  const testimonialsOverride = contentBySection.get('testimonials')
  const galleryPreviewOverride = contentBySection.get('galleryPreview')
  const localSeoOverride = contentBySection.get('localSeo')
  const contactCtaOverride = contentBySection.get('contactCta')

  return {
    hero: {
      ...heroBase,
      backgroundImage: mergeObject(
        homePageDefaults.hero.backgroundImage,
        isRecord(heroOverride) ? heroOverride.backgroundImage : undefined,
      ),
      trustBullets: mergeStringArray(
        homePageDefaults.hero.trustBullets,
        isRecord(heroOverride) ? heroOverride.trustBullets : undefined,
      ),
    },
    socialProof: {
      stats: mergeList(
        homePageDefaults.socialProof.stats,
        isRecord(socialProofOverride) ? socialProofOverride.stats : undefined,
      ),
    },
    services: {
      ...mergeObject(homePageDefaults.services, servicesOverride),
      items: mergeList(
        homePageDefaults.services.items,
        isRecord(servicesOverride) ? servicesOverride.items : undefined,
      ),
    },
    whyUs: {
      ...mergeObject(homePageDefaults.whyUs, whyUsOverride),
      image: mergeObject(
        homePageDefaults.whyUs.image,
        isRecord(whyUsOverride) ? whyUsOverride.image : undefined,
      ),
      floatingBadge: mergeObject(
        homePageDefaults.whyUs.floatingBadge,
        isRecord(whyUsOverride) ? whyUsOverride.floatingBadge : undefined,
      ),
      benefits: mergeList(
        homePageDefaults.whyUs.benefits,
        isRecord(whyUsOverride) ? whyUsOverride.benefits : undefined,
      ),
    },
    testimonials: {
      ...mergeObject(homePageDefaults.testimonials, testimonialsOverride),
      items: mergeList(
        homePageDefaults.testimonials.items,
        isRecord(testimonialsOverride) ? testimonialsOverride.items : undefined,
      ),
    },
    galleryPreview: mergeObject(homePageDefaults.galleryPreview, galleryPreviewOverride),
    localSeo: {
      ...mergeObject(homePageDefaults.localSeo, localSeoOverride),
      highlights: mergeList(
        homePageDefaults.localSeo.highlights,
        isRecord(localSeoOverride) ? localSeoOverride.highlights : undefined,
      ),
    },
    contactCta: mergeObject(homePageDefaults.contactCta, contactCtaOverride),
  }
}
