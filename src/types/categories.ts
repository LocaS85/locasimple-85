import { Category } from './categoryTypes';
import { MAIN_CATEGORIES } from './categories/mainCategories';
import { FOOD_CATEGORIES } from './categories/foodCategories';
import { SHOPPING_CATEGORIES } from './categories/shoppingCategories';
import { HEALTH_CATEGORIES } from './categories/healthCategories';
import { ENTERTAINMENT_CATEGORIES } from './categories/entertainmentCategories';
import { ACCOMMODATION_CATEGORIES } from './categories/accommodationCategories';

export * from './categoryTypes';

export const CATEGORIES: Category[] = [
  ...MAIN_CATEGORIES,
  ...FOOD_CATEGORIES,
  ...SHOPPING_CATEGORIES,
  ...HEALTH_CATEGORIES,
  ...ENTERTAINMENT_CATEGORIES,
  ...ACCOMMODATION_CATEGORIES,
];