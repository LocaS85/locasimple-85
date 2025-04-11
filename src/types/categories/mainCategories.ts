
import { Category } from '../categoryTypes';
import { FOOD_CATEGORIES } from './foodCategories';
import { SHOPPING_CATEGORIES } from './shoppingCategories';
import { SERVICES_CATEGORIES } from './servicesCategories';
import { HEALTH_CATEGORIES } from './healthCategories';
import { ENTERTAINMENT_CATEGORIES } from './entertainmentCategories';
import { ACCOMMODATION_CATEGORIES } from './accommodationCategories';

export const MAIN_CATEGORIES: Category[] = [
  {
    id: 'quotidien',
    name: 'Quotidien',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'adresse-principale',
    name: 'Adresse principale',
    icon: '🏠',
  },
  {
    id: 'famille',
    name: 'Famille',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'amis',
    name: 'Amis',
    icon: '🫂',
  },
  {
    id: 'travail',
    name: 'Travail',
    icon: '💼',
  },
  {
    id: 'ecole',
    name: 'École',
    icon: '🏫',
  }
];

// Export all category types
export {
  FOOD_CATEGORIES,
  SHOPPING_CATEGORIES,
  SERVICES_CATEGORIES,
  HEALTH_CATEGORIES,
  ENTERTAINMENT_CATEGORIES,
  ACCOMMODATION_CATEGORIES
};
