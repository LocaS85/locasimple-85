
import { Category, SubCategory } from '../categoryTypes';

const restaurantSubCategories: SubCategory[] = [
  { id: 'gastronomie', name: 'Gastronomie', parentId: 'restaurants' },
  { id: 'rapide', name: 'Rapide', parentId: 'restaurants' },
  { id: 'vegetariens', name: 'Végétariens/Végans', parentId: 'restaurants' },
  { id: 'pizza', name: 'Pizza', parentId: 'restaurants' },
  { id: 'sushi', name: 'Sushi', parentId: 'restaurants' },
  { id: 'cuisine-monde', name: 'Cuisine du monde', parentId: 'restaurants' },
];

const barSubCategories: SubCategory[] = [
  { id: 'bars-vin', name: 'Bars à vin', parentId: 'bars' },
  { id: 'pubs', name: 'Pubs', parentId: 'bars' },
  { id: 'bars-cocktails', name: 'Bars à cocktails', parentId: 'bars' },
];

const cafeSubCategories: SubCategory[] = [
  { id: 'cafes', name: 'Cafés', parentId: 'cafes-salons' },
  { id: 'salons-the', name: 'Salons de thé', parentId: 'cafes-salons' },
];

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
        children: restaurantSubCategories
      },
      {
        id: 'bars',
        name: 'Bars',
        parentId: 'alimentation',
        children: barSubCategories
      },
      {
        id: 'cafes-salons',
        name: 'Cafés et Salons de thé',
        parentId: 'alimentation',
        children: cafeSubCategories
      },
      { id: 'boulangeries', name: 'Boulangeries', parentId: 'alimentation' },
      { id: 'supermarches', name: 'Supermarchés', parentId: 'alimentation' },
      { id: 'vente-emporter', name: 'Vente à emporter', parentId: 'alimentation' },
      { id: 'livraison', name: 'Livraison', parentId: 'alimentation' },
    ]
  }
];
