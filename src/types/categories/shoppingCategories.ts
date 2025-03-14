
import { Category } from '../categoryTypes';

export const SHOPPING_CATEGORIES: Category[] = [
  {
    id: 'achats',
    name: 'Achats',
    icon: '🛍️',
    subCategories: [
      {
        id: 'vetements',
        name: 'Magasins de vêtements',
        parentId: 'achats',
        children: [
          { id: 'pret-a-porter', name: 'Prêt-à-porter', parentId: 'vetements' },
          { id: 'boutiques-de-luxe', name: 'Boutiques de luxe', parentId: 'vetements' },
          { id: 'chaussures', name: 'Magasins de chaussures', parentId: 'vetements' },
          { id: 'accessoires', name: 'Accessoires', parentId: 'vetements' },
        ],
      },
      {
        id: 'electronique',
        name: 'Magasins d\'électronique',
        parentId: 'achats',
        children: [
          { id: 'telephonie', name: 'Téléphonie', parentId: 'electronique' },
          { id: 'informatique', name: 'Informatique', parentId: 'electronique' },
          { id: 'electromenager', name: 'Électroménager', parentId: 'electronique' },
        ],
      },
      {
        id: 'bibliotheques',
        name: 'Bibliothèques',
        parentId: 'achats',
        children: [
          { id: 'generalistes', name: 'Généralistes', parentId: 'bibliotheques' },
          { id: 'specialisees', name: 'Spécialisées', parentId: 'bibliotheques' },
          { id: 'occasion', name: 'D\'occasion', parentId: 'bibliotheques' },
        ],
      },
      { id: 'jouets', name: 'Magasins de jouets', parentId: 'achats' },
      { id: 'pharmacies', name: 'Pharmacies', parentId: 'achats' },
      { id: 'parfumeries', name: 'Parfumeries', parentId: 'achats' },
      { id: 'bijouteries', name: 'Bijouteries', parentId: 'achats' },
      { id: 'opticiens', name: 'Opticiens', parentId: 'achats' },
      { id: 'sport', name: 'Magasins de sport', parentId: 'achats' },
      { id: 'fleuristes', name: 'Fleuristes', parentId: 'achats' },
    ],
  }
];
