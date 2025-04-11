
import { 
  Category, 
  SubCategory, 
  DistanceUnit, 
  TransportMode, 
  CategoryFilter, 
  SearchFilters, 
  Address,
  TransportModeWithColor
} from './categoryTypes';

import { MAIN_CATEGORIES } from './categories/mainCategories';
import { FOOD_CATEGORIES } from './categories/foodCategories';
import { SHOPPING_CATEGORIES } from './categories/shoppingCategories';
import { SERVICES_CATEGORIES } from './categories/servicesCategories';
import { HEALTH_CATEGORIES } from './categories/healthCategories';
import { ENTERTAINMENT_CATEGORIES } from './categories/entertainmentCategories';
import { ACCOMMODATION_CATEGORIES } from './categories/accommodationCategories';

export { 
  Category, 
  SubCategory, 
  DistanceUnit, 
  TransportMode, 
  CategoryFilter, 
  SearchFilters, 
  Address,
  TransportModeWithColor
};

export const CATEGORIES: Category[] = [
  ...MAIN_CATEGORIES,
  ...FOOD_CATEGORIES,
  ...SHOPPING_CATEGORIES,
  ...SERVICES_CATEGORIES,
  ...HEALTH_CATEGORIES,
  ...ENTERTAINMENT_CATEGORIES,
  ...ACCOMMODATION_CATEGORIES,
];
