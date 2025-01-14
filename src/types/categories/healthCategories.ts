import { Category } from '../categoryTypes';

export const HEALTH_CATEGORIES: Category[] = [
  {
    id: 'sante',
    name: 'Santé et Bien-être',
    icon: '💊',
    subCategories: [
      { id: 'hopitaux', name: 'Hôpitaux', parentId: 'sante' },
      { id: 'cliniques', name: 'Cliniques', parentId: 'sante' },
      { id: 'dentistes', name: 'Dentistes', parentId: 'sante' },
      { id: 'medecins-generalistes', name: 'Médecins généralistes', parentId: 'sante' },
      { id: 'pharmacies', name: 'Pharmacies', parentId: 'sante' },
      { id: 'laboratoires', name: 'Laboratoires d\'analyses médicales', parentId: 'sante' },
      { id: 'opticiens', name: 'Opticiens', parentId: 'sante' },
      { id: 'centres-de-radiologie', name: 'Centres de radiologie', parentId: 'sante' },
      { id: 'psychologues', name: 'Psychologues', parentId: 'sante' },
      { id: 'veterinaires', name: 'Vétérinaires', parentId: 'sante' },
    ],
  }
];