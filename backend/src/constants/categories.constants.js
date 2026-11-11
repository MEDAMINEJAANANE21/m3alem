export const CATEGORIES = Object.freeze([
  {
    slug: 'plombier',
    label: 'Plombier',
    note: 'Intervention sous 24h pour les urgences. Tarif déplacement : 30 € (remboursé si intervention).',
  },
  { slug: 'electricien', label: 'Électricien' },
  { slug: 'climatisation', label: 'Climatisation' },
  { slug: 'menage', label: 'Ménage' },
  { slug: 'lavage-auto', label: 'Lavage de voiture' },
  { slug: 'jardinage', label: 'Jardinier' },
  {
    slug: 'serrurier',
    label: 'Serrurier',
    note: 'Intervention 24h/24 pour les urgences (majoration nocturne).',
  },
  { slug: 'menuisier', label: 'Menuisier' },
  { slug: 'mecanicien', label: 'Mécanicien à domicile' },
]);

export const CATEGORY_SLUGS = CATEGORIES.map((category) => category.slug);
