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
    badgeText: 'Architecture · Branding · Contenu culturel',
    title: 'Architecture, Design & Identité Culturelle',
    subtitle:
      "Noun Studio est un cabinet d'architecture et studio de design multidisciplinaire fondé par SAHNOUNE Mohammed. Nous concevons des espaces, des marques et des histoires.",
    trustBullets: [
      'Architecte agréé',
      'Plus de 70 identités visuelles livrées',
      'Projets en Algérie et en France',
      'Accompagnement du diagnostic à la livraison',
    ],
    primaryCtaLabel: 'Découvrir nos services',
    secondaryCtaLabel: 'Portfolio',
    backgroundImage: {
      src: '/images/hero-bg.jpg',
      alt: 'Architecture contemporaine par Noun Studio',
    },
  },
  socialProof: {
    stats: [
      { value: 'Architecte', label: 'agréée' },
      { value: '70+', label: 'identités visuelles' },
      { value: '2', label: "pays d'activité" },
      { value: '3', label: 'experts en studio' },
    ],
  },
  services: {
    eyebrow: 'Nos expertises',
    title: 'Un studio multidisciplinaire au service de vos projets',
    items: [
      {
        title: 'Architecture',
        description:
          'Conception et suivi de projets architecturaux résidentiels, commerciaux et de rénovation. Du diagnostic à la livraison.',
      },
      {
        title: 'Identité Visuelle',
        description:
          "Création de logos, systèmes d'identité, chartes graphiques et kits de communication pour entreprises et startups.",
      },
      {
        title: 'Contenu Culturel',
        description:
          "Production de contenu autour de l'architecture, du patrimoine algérien et de la culture du design.",
      },
    ],
  },
  whyUs: {
    eyebrow: 'Notre approche',
    title: 'Pourquoi choisir Noun Studio ?',
    image: {
      src: '/images/why-us.jpg',
      alt: 'Architecte SAHNOUNE Mohammed au travail chez Noun Studio',
    },
    floatingBadge: {
      value: '70+',
      label: 'clients satisfaits',
    },
    benefits: [
      {
        title: 'Expertise technique',
        description:
          'Architecte agréé avec une maîtrise complète du cycle projet.',
      },
      {
        title: 'Sensibilité culturelle',
        description:
          'Chaque projet intègre une dimension identitaire et patrimoniale.',
      },
      {
        title: 'Vision stratégique',
        description: "L'architecture comme outil de branding et d'expression.",
      },
      {
        title: 'Écoute & sur-mesure',
        description:
          'Des solutions personnalisées selon vos besoins et votre contexte.',
      },
      {
        title: 'Approche intégrée',
        description:
          'Architecture, design et contenu dans une seule démarche cohérente.',
      },
    ],
    ctaLabel: 'Discutons de votre projet',
  },
  testimonials: {
    eyebrow: 'Témoignages',
    title: 'Ce que disent nos clients',
    items: [
      {
        stars: 5,
        text: "Noun Studio a conçu notre villa avec une sensibilité remarquable. Le projet respecte notre identité tout en apportant une modernité élégante. Un travail d'architecte exceptionnel.",
        name: 'Karim B.',
        city: 'Alger',
      },
      {
        stars: 5,
        text: "L'identité visuelle créée pour notre startup est parfaite. Le logo, la charte graphique et les supports de communication sont cohérents et professionnels. Un vrai partenaire stratégique.",
        name: 'Amina H.',
        city: 'Oran',
      },
      {
        stars: 5,
        text: "La rénovation de notre espace commercial a complètement transformé notre image. Mohammed et son équipe comprennent parfaitement la relation entre architecture et identité de marque.",
        name: 'Yacine M.',
        city: 'Constantine',
      },
      {
        stars: 5,
        text: "Nous avons fait appel à Noun Studio pour le branding complet de notre restaurant. Du nom à la décoration intérieure, tout est pensé avec cohérence. Résultat impeccable.",
        name: 'Sara T.',
        city: 'Alger',
      },
      {
        stars: 5,
        text: "Le suivi de chantier par Noun Studio est rigoureux et transparent. Chaque étape est documentée, les délais respectés et la qualité irréprochable. Je recommande vivement.",
        name: 'Djamel F.',
        city: 'Blida',
      },
    ],
  },
  galleryPreview: {
    eyebrow: 'Portfolio',
    title: 'Nos réalisations',
    subtitle: 'Des projets qui témoignent de notre savoir-faire',
    ctaLabel: 'Voir tout le portfolio',
  },
  localSeo: {
    eyebrow: 'Présence locale',
    title: 'Basé à Oran, Algérie',
    body:
      "Noun Studio est implanté à Oran et intervient à travers l'Algérie. Notre positionnement combine l'expertise technique en architecture avec le développement d'identités visuelles et la création de contenu culturel lié au patrimoine architectural algérien.",
    highlights: [
      {
        title: 'Architecture à Oran',
        description:
          'Résidentiel, commercial et rénovation à Oran. Des projets ancrés dans le patrimoine local avec une vision contemporaine.',
      },
      {
        title: 'Branding à Oran',
        description:
          'Identités visuelles et direction artistique pour des marques locales et nationales.',
      },
      {
        title: 'Contenu culturel',
        description:
          "Production de contenu autour de l'architecture algérienne, du patrimoine et de la culture du design.",
      },
    ],
  },
  contactCta: {
    title: 'Parlons de votre projet',
    subtitle: 'Consultation gratuite — réponse garantie sous 48h',
    emailLabel: 'Email',
    emailAddress: 'contact@nounstudio.dz',
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
