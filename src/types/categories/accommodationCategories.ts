import { Category } from '../categoryTypes';

export const ACCOMMODATION_CATEGORIES: Category[] = [
  {
    id: 'hebergement',
    name: 'Hébergement',
    icon: '🏨',
    subCategories: [
      { id: 'hotels', name: 'Hôtels', parentId: 'hebergement' },
      { id: 'auberges', name: 'Auberges', parentId: 'hebergement' },
      { id: 'chambres-d-hotes', name: 'Chambres d\'hôtes', parentId: 'hebergement' },
      { id: 'camping', name: 'Camping', parentId: 'hebergement' },
      { id: 'locations-de-vacances', name: 'Locations de vacances', parentId: 'hebergement' },
    ],
  }
];