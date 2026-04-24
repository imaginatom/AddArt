-- Optional seed content for AddArt.
-- Run this in Supabase SQL Editor AFTER the migrations if you want starter copy.
-- All inserts are idempotent: they won't duplicate rows if run twice.

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'hero',
  'text',
  '{
    "badgeText": "Illustration · Motion · Graphismes Commerciaux",
    "title": "Illustration, Motion & Direction Artistique",
    "subtitle": "AddArt est un studio d''illustration et de motion design fondé par {{ARTIST_NAME}}. Nous créons des personnages, des jaquettes de jeux, des visuels publicitaires et de courtes animations.",
    "trustBullets": [
      "Illustrations cartoon & character design",
      "Jaquettes de jeux & key art",
      "Motion design & animations courtes",
      "Graphismes pour pubs et campagnes"
    ],
    "primaryCtaLabel": "Découvrir nos services",
    "secondaryCtaLabel": "Voir le portfolio"
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
      { "value": "100+", "label": "illustrations livrées" },
      { "value": "30+", "label": "jaquettes & key art" },
      { "value": "50+", "label": "animations courtes" },
      { "value": "7", "label": "ans d''expérience" }
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
    "title": "Un studio visuel au service de vos projets",
    "items": [
      {
        "title": "Illustration & Cartoon Art",
        "description": "Character design, illustrations cartoon, key art et graphismes commerciaux. Un style expressif, coloré et taillé pour capter l''attention."
      },
      {
        "title": "Motion & Animations",
        "description": "Courtes animations, motion design pour pubs, logos animés et storyboards. De l''idée à la vidéo finale prête à diffuser."
      },
      {
        "title": "Commandes sur-mesure",
        "description": "Briefs créatifs, collaborations studio et projets hybrides. Parlons ensemble de votre univers et de l''effet recherché."
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
    "title": "Pourquoi travailler avec AddArt ?",
    "floatingBadge": { "value": "180+", "label": "projets livrés" },
    "benefits": [
      {
        "title": "Style distinct",
        "description": "Un univers cartoon reconnaissable, taillé pour le divertissement, le jeu vidéo et les marques audacieuses."
      },
      {
        "title": "Polyvalence",
        "description": "De l''illustration statique à la courte animation, une seule équipe pour un résultat cohérent."
      },
      {
        "title": "Direction artistique",
        "description": "Chaque projet est piloté comme une mini-direction artistique : cohérence, lisibilité, impact."
      },
      {
        "title": "Collaboration fluide",
        "description": "Itérations rapides, briefs clairs, fichiers livrés dans tous les formats dont vous avez besoin."
      },
      {
        "title": "Respect des délais",
        "description": "Planning par jalons et communication constante — pas de mauvaises surprises en fin de projet."
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
    "title": "Ce que disent les clients",
    "items": [
      {
        "stars": 5,
        "text": "AddArt a créé les personnages et la jaquette de notre jeu mobile. Le style cartoon est exactement ce qu''on voulait — expressif, coloré, et reconnaissable en un coup d''œil.",
        "name": "Karim B.",
        "city": "Oran"
      },
      {
        "stars": 5,
        "text": "On a collaboré sur une courte animation pour une campagne publicitaire. Motion design impeccable, timing parfait, et une vraie patte visuelle.",
        "name": "Amina H.",
        "city": "Alger"
      },
      {
        "stars": 5,
        "text": "Brief flou au départ, résultat clair à l''arrivée. Les illustrations commerciales livrées pour notre marque ont directement boosté nos performances sur les réseaux sociaux.",
        "name": "Yacine M.",
        "city": "Constantine"
      },
      {
        "stars": 5,
        "text": "Character design fantastique pour notre série d''animations courtes. Les personnages ont une vraie personnalité et se déclinent parfaitement sur tous les supports.",
        "name": "Sara T.",
        "city": "Oran"
      },
      {
        "stars": 5,
        "text": "Livraison rapide, révisions prises en compte sans broncher, fichiers impeccables. Le mix illustration + motion sous un même toit simplifie vraiment la vie.",
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
  'galleryPreview',
  'text',
  '{
    "eyebrow": "Portfolio",
    "title": "Quelques créations récentes",
    "subtitle": "Personnages, jaquettes de jeux, illustrations et frames animées",
    "ctaLabel": "Voir tout le portfolio"
  }'::jsonb,
  5
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'galleryPreview'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'home',
  'localSeo',
  'text',
  '{
    "eyebrow": "Présence locale",
    "title": "Basé à Oran, Algérie",
    "body": "AddArt est installé à Oran et collabore avec des studios, éditeurs de jeux, agences et marques partout en Algérie et à l''international. Nos créations — illustration, motion, direction artistique — sont pensées pour voyager aussi bien sur mobile que sur grand écran.",
    "highlights": [
      {
        "title": "Illustration à Oran",
        "description": "Character design, cartoons et key art livrés pour des clients locaux, nationaux et internationaux depuis Oran."
      },
      {
        "title": "Motion design",
        "description": "Courtes animations, motion pour pubs et réseaux sociaux. Des livrables prêts à diffuser en 1080p ou 4K."
      },
      {
        "title": "Graphismes & Game Covers",
        "description": "Jaquettes de jeux, affiches, bannières et campagnes. Un univers cartoon qui fonctionne aussi sur étagère qu''en feed."
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
    "subtitle": "Devis gratuit — réponse sous 48 h"
  }'::jsonb,
  7
where not exists (
  select 1 from public.site_content where page = 'home' and section = 'contactCta'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'contact',
  'hero',
  'text',
  '{
    "eyebrow": "Contact",
    "title": "Parlons de votre projet",
    "subtitle": "Devis gratuit. On étudie chaque demande avec attention pour vous proposer la meilleure approche."
  }'::jsonb,
  0
where not exists (
  select 1 from public.site_content where page = 'contact' and section = 'hero'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'contact',
  'form',
  'text',
  '{
    "title": "Demande de devis",
    "subtitle": "Remplissez le formulaire ci-dessous et on vous recontacte sous 48 h."
  }'::jsonb,
  1
where not exists (
  select 1 from public.site_content where page = 'contact' and section = 'form'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'contact',
  'artist',
  'text',
  '{
    "title": "Derrière AddArt",
    "name": "{{ARTIST_NAME}}",
    "role": "Illustrateur & Motion Designer",
    "bio": "Studio indépendant basé à Oran, spécialisé en illustration cartoon, key art, graphismes commerciaux et courtes animations."
  }'::jsonb,
  2
where not exists (
  select 1 from public.site_content where page = 'contact' and section = 'artist'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'contact',
  'faq',
  'text',
  '{
    "eyebrow": "FAQ",
    "title": "Questions fréquentes",
    "items": [
      {
        "question": "Quels types de projets réalisez-vous ?",
        "answer": "Illustrations cartoon et character design, jaquettes de jeux vidéo et key art, graphismes pour campagnes publicitaires et réseaux sociaux, courtes animations et motion design. Chaque projet est traité sur mesure, du brief à la livraison."
      },
      {
        "question": "Comment démarre un projet ?",
        "answer": "Tout commence par un échange par email ou via le formulaire. On clarifie ensemble vos références, le ton recherché et la plateforme de diffusion, puis on vous envoie un devis détaillé avec planning et jalons."
      },
      {
        "question": "Travaillez-vous à l''international ?",
        "answer": "Oui. Le studio est basé à Oran mais nous collaborons avec des clients en Algérie, en France, en Europe et en Amérique du Nord. Le travail à distance est fluide et rodé."
      },
      {
        "question": "Quels sont vos tarifs ?",
        "answer": "Les tarifs dépendent du type de livrable (illustration unique, série, jaquette, animation), de sa complexité et des droits d''usage. Nous proposons systématiquement un devis clair et sans engagement."
      },
      {
        "question": "Combien de temps dure un projet ?",
        "answer": "Une illustration standalone prend en général 5 à 10 jours. Une jaquette ou une key art complète 2 à 4 semaines. Une courte animation 2 à 6 semaines selon la durée et la complexité du style."
      },
      {
        "question": "Les fichiers sources sont-ils fournis ?",
        "answer": "Oui : PSD/PNG/SVG pour les illustrations, After Effects pour les motions si besoin, et tous les exports adaptés aux plateformes de diffusion (stores, réseaux sociaux, print)."
      }
    ]
  }'::jsonb,
  3
where not exists (
  select 1 from public.site_content where page = 'contact' and section = 'faq'
);

insert into public.site_content (page, section, content_type, content, sort_order)
select
  'settings',
  'global',
  'text',
  '{
    "brand": {
      "studioName": "AddArt",
      "studioLabel": "Studio",
      "artistName": "{{ARTIST_NAME}}",
      "artistRole": "Illustrateur & Motion Designer",
      "artistBio": "Studio indépendant basé à Oran. Disponible pour des collaborations en Algérie et à l''international.",
      "footerDescription": "Studio d''illustration, de cartoon art et de motion design basé à Oran. Character design, jaquettes de jeux, graphismes commerciaux et courtes animations."
    },
    "contact": {
      "email": "addart69@gmail.com",
      "phone": "+213 00 00 00 00",
      "location": "Oran, Algérie",
      "emailLabel": "Email",
      "phoneLabel": "Téléphone",
      "locationLabel": "Localisation"
    },
    "social": {
      "instagramUrl": "https://instagram.com",
      "facebookUrl": "https://facebook.com"
    },
    "legal": {
      "copyrightLine": "© 2026 AddArt — Tous droits réservés",
      "legalLabel": "Mentions légales",
      "legalHref": "#",
      "privacyLabel": "Politique de confidentialité",
      "privacyHref": "#"
    },
    "cta": {
      "contactButtonLabel": "Contact",
      "quoteButtonLabel": "Demander un devis",
      "floatingCtaLabel": "Contacter AddArt"
    },
    "contactForm": {
      "projectTypeLabel": "Type de projet",
      "projectTypePlaceholder": "Sélectionnez un type de projet",
      "projectTypes": [
        { "value": "character", "label": "Character design / Cartoon" },
        { "value": "key-art", "label": "Jaquette de jeu / Key art" },
        { "value": "commercial", "label": "Graphisme commercial / Pub" },
        { "value": "editorial", "label": "Illustration éditoriale" },
        { "value": "motion", "label": "Courte animation / Motion design" },
        { "value": "logo-anim", "label": "Logo animé" },
        { "value": "autre", "label": "Autre" }
      ],
      "submitLabel": "Envoyer ma demande",
      "submittingLabel": "Envoi en cours...",
      "successTitle": "Demande envoyée !",
      "successMessage": "Merci pour votre message. Nous vous recontactons sous 48 h.",
      "disclaimer": "En soumettant ce formulaire, vous acceptez d''être recontacté(e) par AddArt. Vos données sont traitées confidentiellement."
    }
  }'::jsonb,
  0
where not exists (
  select 1 from public.site_content where page = 'settings' and section = 'global'
);
