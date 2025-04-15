
import { Icon } from 'lucide-react';

export interface DailyCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  subCategories?: {
    id: string;
    name: string;
  }[];
}

export const DAILY_CATEGORIES: DailyCategory[] = [
  {
    id: 'famille',
    name: 'Famille',
    icon: 'Family',
    color: '#4F46E5',
    subCategories: [
      { id: 'ecole', name: 'École' },
      { id: 'creche', name: 'Crèche' },
      { id: 'parc', name: 'Parc' },
      { id: 'bibliotheque', name: 'Bibliothèque' }
    ]
  },
  {
    id: 'ami',
    name: 'Ami',
    icon: 'Users',
    color: '#10B981',
    subCategories: [
      { id: 'restaurant', name: 'Restaurant' },
      { id: 'bar', name: 'Bar' },
      { id: 'cafe', name: 'Café' },
      { id: 'loisir', name: 'Loisir' }
    ]
  },
  {
    id: 'travail',
    name: 'Travail',
    icon: 'Briefcase',
    color: '#F59E0B',
    subCategories: [
      { id: 'bureau', name: 'Bureau' },
      { id: 'coworking', name: 'Coworking' },
      { id: 'salle_reunion', name: 'Salle de réunion' },
      { id: 'restaurant_affaires', name: 'Restaurant d\'affaires' }
    ]
  },
  {
    id: 'sport',
    name: 'Sport',
    icon: 'Dumbbell',
    color: '#EF4444',
    subCategories: [
      { id: 'salle_sport', name: 'Salle de sport' },
      { id: 'piscine', name: 'Piscine' },
      { id: 'terrain', name: 'Terrain' },
      { id: 'parc_sportif', name: 'Parc sportif' }
    ]
  }
];
