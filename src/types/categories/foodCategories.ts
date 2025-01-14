import { Category } from '../categoryTypes';

export const FOOD_CATEGORIES: Category[] = [
  {
    id: 'alimentation',
    name: 'Alimentation et Boissons',
    icon: '🍽️',
    subCategories: [
      {
        id: 'restaurants',
        name: 'Restaurants',
        parentId: 'alimentation',
        children: [
          { id: 'gastronomie', name: 'Gastronomie', parentId: 'restaurants' },
          { id: 'rapide', name: 'Rapide', parentId: 'restaurants' },
          { id: 'vegan', name: 'Végétariens/Végans', parentId: 'restaurants' },
          { id: 'pizza', name: 'Pizza', parentId: 'restaurants' },
          { id: 'sushi', name: 'Sushi', parentId: 'restaurants' },
          { id: 'monde', name: 'Cuisine du monde', parentId: 'restaurants' },
        ],
      },
      {
        id: 'bars',
        name: 'Bars',
        parentId: 'alimentation',
        children: [
          { id: 'bars-a-vin', name: 'Bars à vin', parentId: 'bars' },
          { id: 'pubs', name: 'Pubs', parentId: 'bars' },
          { id: 'bars-a-cocktails', name: 'Bars à cocktails', parentId: 'bars' },
        ],
      },
      {
        id: 'cafes',
        name: 'Cafés et Salons de thé',
        parentId: 'alimentation',
        children: [
          { id: 'cafes', name: 'Cafés', parentId: 'cafes' },
          { id: 'salons-de-the', name: 'Salons de thé', parentId: 'cafes' },
        ],
      },
      { id: 'boulangeries', name: 'Boulangeries', parentId: 'alimentation' },
      { id: 'supermarches', name: 'Supermarchés', parentId: 'alimentation' },
      { id: 'vente-a-emporter', name: 'Vente à emporter', parentId: 'alimentation' },
      { id: 'livraison', name: 'Livraison', parentId: 'alimentation' },
    ],
  }
];