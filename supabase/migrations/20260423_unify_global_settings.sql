-- Unify shared business/contact settings into one CMS root entry.
-- No new table is introduced: everything lives in public.site_content.

do $$
declare
  existing_settings_id uuid;
  contact_info jsonb;
  home_contact_cta jsonb;
  portfolio_cta jsonb;
  merged_email text;
  merged_email_label text;
begin
  select content
  into contact_info
  from public.site_content
  where page = 'contact' and section = 'info'
  order by updated_at desc
  limit 1;

  select content
  into home_contact_cta
  from public.site_content
  where page = 'home' and section = 'contactCta'
  order by updated_at desc
  limit 1;

  select content
  into portfolio_cta
  from public.site_content
  where page = 'portfolio' and section = 'cta'
  order by updated_at desc
  limit 1;

  merged_email := coalesce(
    contact_info ->> 'emailAddress',
    home_contact_cta ->> 'emailAddress',
    portfolio_cta ->> 'emailAddress',
    'addart69@gmail.com'
  );

  merged_email_label := coalesce(
    contact_info ->> 'emailLabel',
    portfolio_cta ->> 'emailLabel',
    'Email'
  );

  select id
  into existing_settings_id
  from public.site_content
  where page = 'settings' and section = 'global'
  order by updated_at desc
  limit 1;

  if existing_settings_id is null then
    insert into public.site_content (page, section, content_type, content, sort_order)
    values (
      'settings',
      'global',
      'text',
      jsonb_build_object(
        'brand', jsonb_build_object(
          'studioName', 'AddArt',
          'studioLabel', 'Studio',
          'artistName', '{{ARTIST_NAME}}',
          'artistRole', 'Illustrateur & Motion Designer',
          'artistBio', 'Studio indépendant basé à Oran. Disponible pour des collaborations en Algérie et à l''international.',
          'footerDescription', 'Studio d''illustration, de cartoon art et de motion design basé à Oran. Character design, jaquettes de jeux, graphismes commerciaux et courtes animations.'
        ),
        'contact', jsonb_build_object(
          'email', merged_email,
          'phone', '+213 00 00 00 00',
          'location', coalesce(contact_info ->> 'locationValue', 'Oran, Algérie'),
          'emailLabel', merged_email_label,
          'phoneLabel', 'Téléphone',
          'locationLabel', coalesce(contact_info ->> 'locationLabel', 'Localisation')
        ),
        'social', jsonb_build_object(
          'instagramUrl', 'https://instagram.com',
          'facebookUrl', 'https://facebook.com'
        ),
        'legal', jsonb_build_object(
          'copyrightLine', '© 2026 AddArt — Tous droits réservés',
          'legalLabel', 'Mentions légales',
          'legalHref', '#',
          'privacyLabel', 'Politique de confidentialité',
          'privacyHref', '#'
        ),
        'cta', jsonb_build_object(
          'contactButtonLabel', 'Contact',
          'quoteButtonLabel', 'Demander un devis',
          'floatingCtaLabel', 'Contacter AddArt'
        ),
        'contactForm', jsonb_build_object(
          'projectTypeLabel', 'Type de projet',
          'projectTypePlaceholder', 'Sélectionnez un type de projet',
          'projectTypes', jsonb_build_array(
            jsonb_build_object('value', 'character', 'label', 'Character design / Cartoon'),
            jsonb_build_object('value', 'key-art', 'label', 'Jaquette de jeu / Key art'),
            jsonb_build_object('value', 'commercial', 'label', 'Graphisme commercial / Pub'),
            jsonb_build_object('value', 'editorial', 'label', 'Illustration éditoriale'),
            jsonb_build_object('value', 'motion', 'label', 'Courte animation / Motion design'),
            jsonb_build_object('value', 'logo-anim', 'label', 'Logo animé'),
            jsonb_build_object('value', 'autre', 'label', 'Autre')
          ),
          'submitLabel', 'Envoyer ma demande',
          'submittingLabel', 'Envoi en cours...',
          'successTitle', 'Demande envoyée !',
          'successMessage', 'Merci pour votre message. Nous vous recontactons sous 48 h.',
          'disclaimer', 'En soumettant ce formulaire, vous acceptez d''être recontacté(e) par AddArt. Vos données sont traitées confidentiellement.'
        )
      ),
      0
    );
  end if;

  -- Remove duplicated roots now replaced by settings/global.
  delete from public.site_content
  where page = 'contact' and section = 'info';

  -- Strip duplicated email fields from page-specific CTA blobs.
  update public.site_content
  set content = content - 'emailLabel' - 'emailAddress'
  where page = 'home' and section = 'contactCta' and jsonb_typeof(content) = 'object';

  update public.site_content
  set content = content - 'emailLabel' - 'emailAddress'
  where page = 'portfolio' and section = 'cta' and jsonb_typeof(content) = 'object';
end $$;
