export type ContactPageContent = {
  hero: {
    eyebrow: string
    title: string
    subtitle: string
  }
  form: {
    title: string
    subtitle: string
  }
  artist: {
    title: string
    name: string
    role: string
    bio: string
  }
  faq: {
    eyebrow: string
    title: string
    items: Array<{
      question: string
      answer: string
    }>
  }
}

export type ContactPageSectionKey = keyof ContactPageContent

export const contactSectionOrder: ContactPageSectionKey[] = [
  "hero",
  "form",
  "artist",
  "faq",
]

export const contactPageDefaults: ContactPageContent = {
  hero: {
    eyebrow: "Contact",
    title: "Parlons de votre projet",
    subtitle:
      "Devis gratuit. On etudie chaque demande avec attention pour vous proposer la meilleure approche.",
  },
  form: {
    title: "Demande de devis",
    subtitle: "Remplissez le formulaire ci-dessous et on vous recontacte sous 48 h.",
  },
  artist: {
    title: "Derriere AddArt",
    name: "{{ARTIST_NAME}}",
    role: "Illustrateur & Motion Designer",
    bio: "Studio independant base a Oran, specialise en illustration cartoon, key art, graphismes commerciaux et courtes animations.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions frequentes",
    items: [
      {
        question: "Quels types de projets realisez-vous ?",
        answer:
          "Illustrations cartoon et character design, jaquettes de jeux video et key art, graphismes pour campagnes publicitaires et reseaux sociaux, courtes animations et motion design. Chaque projet est traite sur mesure, du brief a la livraison.",
      },
      {
        question: "Comment demarre un projet ?",
        answer:
          "Tout commence par un echange par email ou via le formulaire. On clarifie ensemble vos references, le ton recherche et la plateforme de diffusion, puis on vous envoie un devis detaille avec planning et jalons.",
      },
      {
        question: "Travaillez-vous a l'international ?",
        answer:
          "Oui. Le studio est base a Oran mais nous collaborons avec des clients en Algerie, en France, en Europe et en Amerique du Nord. Le travail a distance est fluide et rode.",
      },
      {
        question: "Quels sont vos tarifs ?",
        answer:
          "Les tarifs dependent du type de livrable (illustration unique, serie, jaquette, animation), de sa complexite et des droits d'usage. Nous proposons systematiquement un devis clair et sans engagement.",
      },
      {
        question: "Combien de temps dure un projet ?",
        answer:
          "Une illustration standalone prend en general 5 a 10 jours. Une jaquette ou une key art complete 2 a 4 semaines. Une courte animation 2 a 6 semaines selon la duree et la complexite du style.",
      },
      {
        question: "Les fichiers sources sont-ils fournis ?",
        answer:
          "Oui : PSD/PNG/SVG pour les illustrations, After Effects pour les motions si besoin, et tous les exports adaptes aux plateformes de diffusion (stores, reseaux sociaux, print).",
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
  if (!isRecord(value)) return fallback
  return {
    ...fallback,
    ...(value as Partial<T>),
  }
}

const mergeFaqItems = (
  fallback: ContactPageContent["faq"]["items"],
  value: unknown,
): ContactPageContent["faq"]["items"] => {
  if (!Array.isArray(value)) return fallback
  return fallback.map((item, index) => {
    const entry = value[index]
    if (!isRecord(entry)) return item
    return {
      ...item,
      ...(entry as Partial<typeof item>),
    }
  })
}

export const mergeContactContent = (
  entries: SiteContentEntry[] = [],
): ContactPageContent => {
  const contentBySection = new Map(entries.map((entry) => [entry.section, entry.content]))
  const heroOverride = contentBySection.get("hero")
  const formOverride = contentBySection.get("form")
  const artistOverride = contentBySection.get("artist")
  const faqOverride = contentBySection.get("faq")

  return {
    hero: mergeObject(contactPageDefaults.hero, heroOverride),
    form: mergeObject(contactPageDefaults.form, formOverride),
    artist: mergeObject(contactPageDefaults.artist, artistOverride),
    faq: {
      ...mergeObject(contactPageDefaults.faq, faqOverride),
      items: mergeFaqItems(contactPageDefaults.faq.items, isRecord(faqOverride) ? faqOverride.items : undefined),
    },
  }
}
