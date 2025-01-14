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
      // ... autres sous-catégories d'achats
    ],
  }
];