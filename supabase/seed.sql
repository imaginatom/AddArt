insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'hero',
  'text',
  '{
    "badgeText": "Architecture · Branding · Contenu culturel",
    "title": "Architecture, Design & Identité Culturelle",
    "subtitle": "Noun Studio est un cabinet d''architecture et studio de design multidisciplinaire fondé par SAHNOUNE Mohammed. Nous concevons des espaces, des marques et des histoires.",
    "trustBullets": [
      "Architecte agréé",
      "Plus de 70 identités visuelles livrées",
      "Projets en Algérie et en France",
      "Accompagnement du diagnostic à la livraison"
    ],
    "primaryCtaLabel": "Découvrir nos services",
    "secondaryCtaLabel": "Portfolio"
  }'::jsonb,
  0
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'hero'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'socialProof',
  'text',
  '{
    "stats": [
      { "value": "Architecte", "label": "agréée" },
      { "value": "70+", "label": "identités visuelles" },
      { "value": "2", "label": "pays d''activité" },
      { "value": "3", "label": "experts en studio" }
    ]
  }'::jsonb,
  1
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'socialProof'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'services',
  'text',
  '{
    "eyebrow": "Nos expertises",
    "title": "Un studio multidisciplinaire au service de vos projets",
    "items": [
      {
        "title": "Architecture",
        "description": "Conception et suivi de projets architecturaux résidentiels, commerciaux et de rénovation. Du diagnostic à la livraison."
      },
      {
        "title": "Identité Visuelle",
        "description": "Création de logos, systèmes d''identité, chartes graphiques et kits de communication pour entreprises et startups."
      },
      {
        "title": "Contenu Culturel",
        "description": "Production de contenu autour de l''architecture, du patrimoine algérien et de la culture du design."
      }
    ]
  }'::jsonb,
  2
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'services'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'whyUs',
  'text',
  '{
    "eyebrow": "Notre approche",
    "title": "Pourquoi choisir Noun Studio ?",
    "floatingBadge": { "value": "70+", "label": "clients satisfaits" },
    "benefits": [
      {
        "title": "Expertise technique",
        "description": "Architecte agréé avec une maîtrise complète du cycle projet."
      },
      {
        "title": "Sensibilité culturelle",
        "description": "Chaque projet intègre une dimension identitaire et patrimoniale."
      },
      {
        "title": "Vision stratégique",
        "description": "L''architecture comme outil de branding et d''expression."
      },
      {
        "title": "Écoute & sur-mesure",
        "description": "Des solutions personnalisées selon vos besoins et votre contexte."
      },
      {
        "title": "Approche intégrée",
        "description": "Architecture, design et contenu dans une seule démarche cohérente."
      }
    ],
    "ctaLabel": "Discutons de votre projet"
  }'::jsonb,
  3
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'whyUs'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'testimonials',
  'text',
  '{
    "eyebrow": "Témoignages",
    "title": "Ce que disent nos clients",
    "items": [
      {
        "stars": 5,
        "text": "Noun Studio a conçu notre villa avec une sensibilité remarquable. Le projet respecte notre identité tout en apportant une modernité élégante. Un travail d''architecte exceptionnel.",
        "name": "Karim B.",
        "city": "Alger"
      },
      {
        "stars": 5,
        "text": "L''identité visuelle créée pour notre startup est parfaite. Le logo, la charte graphique et les supports de communication sont cohérents et professionnels. Un vrai partenaire stratégique.",
        "name": "Amina H.",
        "city": "Oran"
      },
      {
        "stars": 5,
        "text": "La rénovation de notre espace commercial a complètement transformé notre image. Mohammed et son équipe comprennent parfaitement la relation entre architecture et identité de marque.",
        "name": "Yacine M.",
        "city": "Constantine"
      },
      {
        "stars": 5,
        "text": "Nous avons fait appel à Noun Studio pour le branding complet de notre restaurant. Du nom à la décoration intérieure, tout est pensé avec cohérence. Résultat impeccable.",
        "name": "Sara T.",
        "city": "Alger"
      },
      {
        "stars": 5,
        "text": "Le suivi de chantier par Noun Studio est rigoureux et transparent. Chaque étape est documentée, les délais respectés et la qualité irréprochable. Je recommande vivement.",
        "name": "Djamel F.",
        "city": "Blida"
      }
    ]
  }'::jsonb,
  4
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'testimonials'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'gallery',
  'text',
  '{
    "eyebrow": "Portfolio",
    "title": "Nos réalisations",
    "subtitle": "Des projets qui témoignent de notre savoir-faire",
    "ctaLabel": "Voir tout le portfolio"
  }'::jsonb,
  5
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'gallery'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'localSeo',
  'text',
  '{
    "eyebrow": "Présence locale",
    "title": "Basé à Oran, Algérie",
    "body": "Noun Studio est implanté à Oran et intervient à travers l''Algérie. Notre positionnement combine l''expertise technique en architecture avec le développement d''identités visuelles et la création de contenu culturel lié au patrimoine architectural algérien.",
    "highlights": [
      {
        "title": "Architecture à Oran",
        "description": "Résidentiel, commercial et rénovation à Oran. Des projets ancrés dans le patrimoine local avec une vision contemporaine."
      },
      {
        "title": "Branding à Oran",
        "description": "Identités visuelles et direction artistique pour des marques locales et nationales."
      },
      {
        "title": "Contenu culturel",
        "description": "Production de contenu autour de l''architecture algérienne, du patrimoine et de la culture du design."
      }
    ]
  }'::jsonb,
  6
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'localSeo'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'contactCta',
  'text',
  '{
    "title": "Parlons de votre projet",
    "subtitle": "Consultation gratuite — réponse garantie sous 48h",
    "emailLabel": "Email",
    "emailAddress": "contact@nounstudio.dz"
  }'::jsonb,
  7
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'contactCta'
);
