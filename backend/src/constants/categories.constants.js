export const CATEGORIES = Object.freeze([
  {
    slug: 'plombier',
    label: 'Plombier',
    note: 'Urgence : précisez-le dans votre demande. Tarif déplacement : 30 € (remboursé si intervention).',
  },
  { slug: 'electricien', label: 'Électricien' },
  { slug: 'climatisation', label: 'Climatisation' },
  { slug: 'menage', label: 'Ménage' },
  { slug: 'lavage-auto', label: 'Lavage de voiture' },
  { slug: 'jardinage', label: 'Jardinier' },
  {
    slug: 'serrurier',
    label: 'Serrurier',
    note: 'Intervention de nuit possible selon le prestataire, avec majoration.',
  },
  { slug: 'menuisier', label: 'Menuisier' },
  { slug: 'mecanicien', label: 'Mécanicien à domicile' },
]);

export const CATEGORY_SLUGS = CATEGORIES.map((category) => category.slug);
