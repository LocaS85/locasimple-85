
import { Category } from '../categoryTypes';

export const SERVICES_CATEGORIES: Category[] = [
  {
    id: 'services',
    name: 'Services',
    icon: '🔧',
    subCategories: [
      { id: 'poste', name: 'La Poste', parentId: 'services' },
      { id: 'assurances', name: 'Assurances', parentId: 'services' },
      { id: 'immobilier', name: 'Agences immobilières', parentId: 'services' },
      { id: 'services-publics', name: 'Services publics', parentId: 'services' },
      { id: 'mairie', name: 'Mairie', parentId: 'services' },
      { id: 'police', name: 'Police', parentId: 'services' },
      { id: 'pompiers', name: 'Pompiers', parentId: 'services' },
      { id: 'ambassade', name: 'Ambassade/Consulat', parentId: 'services' },
      { id: 'emploi', name: 'Agences pour l\'emploi', parentId: 'services' },
      { id: 'impots', name: 'Centre des impôts', parentId: 'services' },
    ]
  }
];
