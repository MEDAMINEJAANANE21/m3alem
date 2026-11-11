// Demo catalog, taken from the original static "commander" page.
export const CATALOG = [
  { category: 'plombier', title: 'Dépannage urgence fuite', description: "Intervention rapide pour fuite d'eau", price: 85 },
  { category: 'plombier', title: 'Remplacement robinetterie', description: 'Robinet, mitigeur ou mélangeur', price: 90, priceLabel: '70-120 €' },
  { category: 'plombier', title: 'Installation WC', description: 'Pose complète avec raccordements', price: 150 },

  { category: 'electricien', title: 'Dépannage électrique', description: 'Remise en service tableau électrique', price: 90 },
  { category: 'electricien', title: 'Installation prise/interrupteur', description: 'Pose ou remplacement', price: 45, pricingUnit: 'unit' },
  { category: 'electricien', title: 'Mise aux normes', description: 'Diagnostic complet installation', price: 200 },

  { category: 'climatisation', title: 'Nettoyage climatisation', description: 'Démontage et nettoyage complet', price: 80 },
  { category: 'climatisation', title: 'Recharge gaz', description: 'Pour climatiseur split', price: 120 },
  { category: 'climatisation', title: 'Installation climatiseur', description: 'Pose complète avec perçage', price: 250 },

  { category: 'menage', title: 'Ménage régulier', description: 'Entretien hebdomadaire ou mensuel', price: 20, pricingUnit: 'hour', minQuantity: 2 },
  { category: 'menage', title: 'Grand nettoyage', description: 'Nettoyage complet (cuisine, salle de bain…)', price: 25, pricingUnit: 'hour', minQuantity: 3 },
  { category: 'menage', title: 'Nettoyage après déménagement', description: 'Forfait complet', price: 150 },

  { category: 'lavage-auto', title: 'Lavage extérieur', description: 'Nettoyage carrosserie et jantes', price: 25 },
  { category: 'lavage-auto', title: 'Lavage intérieur/extérieur', description: 'Complet avec aspirateur et produits', price: 45 },
  { category: 'lavage-auto', title: 'Forfait mensuel', description: '4 lavages extérieurs/mois', price: 80 },

  { category: 'jardinage', title: 'Tonte de pelouse', description: "Jusqu'à 500 m²", price: 40 },
  { category: 'jardinage', title: 'Taille de haie', description: "Jusqu'à 10 m linéaires", price: 50 },
  { category: 'jardinage', title: 'Entretien mensuel', description: 'Forfait 4h/mois', price: 120 },

  { category: 'serrurier', title: 'Dépannage serrurerie', description: 'Ouverture de porte claquée', price: 70 },
  { category: 'serrurier', title: 'Changement de serrure', description: 'Pose avec 3 clés', price: 90 },
  { category: 'serrurier', title: 'Installation blindage', description: "Porte d'entrée sécurisée", price: 250 },

  { category: 'menuisier', title: 'Pose de placard', description: 'Sur mesure ou prêt-à-poser', price: 150 },
  { category: 'menuisier', title: 'Fabrication étagère', description: 'Sur mesure (bois massif)', price: 200 },
  { category: 'menuisier', title: 'Réparation meuble', description: 'Colle, serrure, charnière', price: 60 },

  { category: 'mecanicien', title: 'Vidange complète', description: 'Huile + filtre à huile', price: 70 },
  { category: 'mecanicien', title: 'Changement plaquettes frein', description: 'Avant ou arrière', price: 90 },
  { category: 'mecanicien', title: 'Diagnostic électronique', description: 'Lecture des défauts moteur', price: 50 },
];
