
import { Category } from '../categoryTypes';

export const SERVICES_CATEGORIES: Category[] = [
  {
    id: 'services',
    name: 'Services',
    icon: '🛠️',
    subCategories: [
      {
        id: 'coiffeurs',
        name: 'Coiffeurs',
        parentId: 'services',
        children: [
          { id: 'coiffeurs-hommes', name: 'Hommes', parentId: 'coiffeurs' },
          { id: 'coiffeurs-femmes', name: 'Femmes', parentId: 'coiffeurs' },
          { id: 'barbiers', name: 'Barbiers', parentId: 'coiffeurs' },
        ],
      },
      {
        id: 'beaute',
        name: 'Beauté',
        parentId: 'services',
        children: [
          { id: 'salon-de-beaute', name: 'Salon de beauté', parentId: 'beaute' },
          { id: 'esthetique', name: 'Esthétique', parentId: 'beaute' },
          { id: 'ongleries', name: 'Ongleries', parentId: 'beaute' },
          { id: 'spa', name: 'Spa', parentId: 'beaute' },
        ],
      },
      { id: 'pressing', name: 'Pressing', parentId: 'services' },
      {
        id: 'automobile',
        name: 'Automobile',
        parentId: 'services',
        children: [
          { id: 'lavage-auto', name: 'Lavage auto', parentId: 'automobile' },
          { id: 'reparation-auto', name: 'Réparation auto', parentId: 'automobile' },
          { id: 'localisation-automatique', name: 'Localisation automatique', parentId: 'automobile' },
          { id: 'garages-automobiles', name: 'Garages automobiles', parentId: 'automobile' },
          { id: 'parking', name: 'Parking', parentId: 'automobile' },
          { id: 'bornes-de-recharge', name: 'Bornes de recharge', parentId: 'automobile' },
          { id: 'stations-service', name: 'Stations-service', parentId: 'automobile' },
        ],
      },
      { id: 'banques-et-dab', name: 'Banques et DAB', parentId: 'services' },
    ],
  }
];
