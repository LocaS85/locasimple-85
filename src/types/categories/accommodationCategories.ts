
import { Category } from '../categoryTypes';

export const ACCOMMODATION_CATEGORIES: Category[] = [
  {
    id: 'hebergement',
    name: 'Hébergement',
    icon: '🏨',
    subCategories: [
      { id: 'hotels', name: 'Hôtels', parentId: 'hebergement' },
      { id: 'auberges', name: 'Auberges', parentId: 'hebergement' },
      { id: 'chambres-hotes', name: 'Chambres d\'hôtes', parentId: 'hebergement' },
      { id: 'camping', name: 'Camping', parentId: 'hebergement' },
      { id: 'locations-vacances', name: 'Locations de vacances', parentId: 'hebergement' },
    ]
  },
  {
    id: 'divers',
    name: 'Divers',
    icon: '🔍',
  }
];
