
export type DailyCategoryType = string;

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
  isCustom?: boolean;
  subcategories?: DailySubcategory[];
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

export function getRelationTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'family': 'Famille',
    'friend': 'Ami(e)',
    'colleague': 'Collègue',
    'business': 'Professionnel',
    'other': 'Autre'
  };
  return labels[type] || type;
}

// Example categories with subcategories
export const DAILY_CATEGORIES: DailyCategory[] = [
  {
    id: 'famille',
    name: 'Famille',
    color: '#F59E0B',
    icon: '👨‍👩‍👧‍👦',
    subcategories: [
      { id: 'parents', name: 'Parents', apiKey: 'parents' },
      { id: 'enfants', name: 'Enfants', apiKey: 'enfants' },
      { id: 'fratrie', name: 'Fratrie', apiKey: 'fratrie' }
    ]
  },
  {
    id: 'ami',
    name: 'Amis',
    color: '#3B82F6',
    icon: '🫂',
    subcategories: [
      { id: 'proches', name: 'Proches', apiKey: 'proches' },
      { id: 'ecole', name: 'École', apiKey: 'ecole' },
      { id: 'travail', name: 'Travail', apiKey: 'travail_amis' }
    ]
  },
  {
    id: 'travail',
    name: 'Travail',
    color: '#10B981',
    icon: '💼',
    subcategories: [
      { id: 'bureau', name: 'Bureau', apiKey: 'bureau' },
      { id: 'collegues', name: 'Collègues', apiKey: 'collegues' },
      { id: 'clients', name: 'Clients', apiKey: 'clients' }
    ]
  },
  {
    id: 'sport',
    name: 'Sport',
    color: '#EC4899',
    icon: '🏋️‍♂️',
    subcategories: [
      { id: 'equipe', name: 'Équipe', apiKey: 'equipe' },
      { id: 'salles', name: 'Salles', apiKey: 'salles' },
      { id: 'entraineurs', name: 'Entraîneurs', apiKey: 'entraineurs' }
    ]
  }
];
