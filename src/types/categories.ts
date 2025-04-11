
import { 
  MAIN_CATEGORIES,
  FOOD_CATEGORIES,
  SHOPPING_CATEGORIES,
  SERVICES_CATEGORIES,
  HEALTH_CATEGORIES,
  ENTERTAINMENT_CATEGORIES,
  ACCOMMODATION_CATEGORIES 
} from './categories/mainCategories';

export type { 
  Category, 
  SubCategory, 
  DistanceUnit, 
  TransportMode, 
  CategoryFilter, 
  SearchFilters, 
  Address,
  TransportModeWithColor
} from './categoryTypes';

export const CATEGORIES = [
  ...MAIN_CATEGORIES,
  ...FOOD_CATEGORIES,
  ...SHOPPING_CATEGORIES,
  ...SERVICES_CATEGORIES,
  ...HEALTH_CATEGORIES,
  ...ENTERTAINMENT_CATEGORIES,
  ...ACCOMMODATION_CATEGORIES,
];
