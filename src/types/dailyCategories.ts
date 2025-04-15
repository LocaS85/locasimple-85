
import { Icon } from 'lucide-react';

export type DailyCategoryType = string;

export interface DailyCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  isCustom?: boolean;
  subCategories?: {
    id: string;
    name: string;
  }[];
}

export interface DailyContactInfo {
  id: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  address: string;
  latitude: number;
  longitude: number;
  relationType?: string;
  category: DailyCategoryType;
  isFavorite: boolean;
}

export const getRelationTypeLabel = (relationType: string): string => {
  const relationTypes: Record<string, string> = {
    'ami': 'Ami(e)',
    'famille': 'Famille',
    'collegue': 'Collègue',
    'voisin': 'Voisin(e)',
    'connaissance': 'Connaissance',
    'partenaire': 'Partenaire',
    'client': 'Client',
    'fournisseur': 'Fournisseur',
    'medecin': 'Médecin',
    'ecole': 'École',
    'mere': 'Mère',
    'pere': 'Père',
    'frere': 'Frère',
    'soeur': 'Sœur',
    'enfant': 'Enfant',
  };
  
  return relationTypes[relationType] || relationType;
};

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
    id: 'amis',
    name: 'Amis',
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
