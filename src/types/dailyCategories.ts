
export interface DailySubcategory {
  id: string;
  name: string;
  icon?: string;
  apiKey: string;
}

export interface DailyCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
  subcategories?: DailySubcategory[];
}

// Example categories with subcategories
export const DAILY_CATEGORIES: DailyCategory[] = [
  {
    id: 'food',
    name: 'Restaurants',
    color: '#F59E0B',
    icon: '🍽️',
    subcategories: [
      { id: 'restaurant', name: 'Restaurant', apiKey: 'restaurant' },
      { id: 'fast_food', name: 'Fast Food', apiKey: 'fast_food' },
      { id: 'cafe', name: 'Café', apiKey: 'cafe' }
    ]
  },
  {
    id: 'shopping',
    name: 'Shopping',
    color: '#3B82F6',
    icon: '🛍️',
    subcategories: [
      { id: 'clothing', name: 'Vêtements', apiKey: 'clothing_store' },
      { id: 'supermarket', name: 'Supermarché', apiKey: 'supermarket' },
      { id: 'mall', name: 'Centre Commercial', apiKey: 'shopping_mall' }
    ]
  },
  {
    id: 'entertainment',
    name: 'Loisirs',
    color: '#EC4899',
    icon: '🎭',
    subcategories: [
      { id: 'cinema', name: 'Cinéma', apiKey: 'movie_theater' },
      { id: 'museum', name: 'Musée', apiKey: 'museum' },
      { id: 'park', name: 'Parc', apiKey: 'park' }
    ]
  },
  {
    id: 'services',
    name: 'Services',
    color: '#10B981',
    icon: '🔧',
    subcategories: [
      { id: 'bank', name: 'Banque', apiKey: 'bank' },
      { id: 'hospital', name: 'Hôpital', apiKey: 'hospital' },
      { id: 'pharmacy', name: 'Pharmacie', apiKey: 'pharmacy' }
    ]
  }
];
