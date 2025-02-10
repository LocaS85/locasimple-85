
import { Category } from '../categoryTypes';

export const SHOPPING_CATEGORIES: Category[] = [
  {
    id: 'achats',
    name: 'Achats',
    icon: '🛍️',
    subCategories: [
      {
        id: 'magasins-de-vetements',
        name: 'Magasins de vêtements',
        parentId: 'achats',
        children: [
          { id: 'pret-a-porter', name: 'Prêt-à-porter', parentId: 'magasins-de-vetements' },
          { id: 'boutiques-de-luxe', name: 'Boutiques de luxe', parentId: 'magasins-de-vetements' },
          { id: 'magasins-de-chaussures', name: 'Magasins de chaussures', parentId: 'magasins-de-vetements' },
          { id: 'accessoires', name: 'Accessoires', parentId: 'magasins-de-vetements' },
        ],
      },
      {
        id: 'magasins-electronique',
        name: 'Magasins d\'électronique',
        parentId: 'achats',
        children: [
          { id: 'telephonie', name: 'Téléphonie', parentId: 'magasins-electronique' },
          { id: 'informatique', name: 'Informatique', parentId: 'magasins-electronique' },
          { id: 'electromenager', name: 'Électroménager', parentId: 'magasins-electronique' },
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
      { id: 'magasins-de-jouets', name: 'Magasins de jouets', parentId: 'achats' },
      { id: 'pharmacies', name: 'Pharmacies', parentId: 'achats' },
      { id: 'parfumeries', name: 'Parfumeries', parentId: 'achats' },
      { id: 'bijouteries', name: 'Bijouteries', parentId: 'achats' },
      { id: 'opticiens', name: 'Opticiens', parentId: 'achats' },
      { id: 'magasins-de-sport', name: 'Magasins de sport', parentId: 'achats' },
      { id: 'fleuristes', name: 'Fleuristes', parentId: 'achats' },
    ],
  }
];
