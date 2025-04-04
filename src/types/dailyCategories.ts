export interface DailyContactInfo {
  id: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  address: string;
  latitude: number;
  longitude: number;
  relationType?: string; // Changed from RelationType to string for free-form input
  relationLabel?: string; 
  category: DailyCategoryType;
  isFavorite?: boolean;
}

export type RelationType = 
  | 'pere' 
  | 'mere' 
  | 'frere' 
  | 'soeur' 
  | 'cousin' 
  | 'ami' 
  | 'collegue' 
  | 'autre';

export type DailyCategoryType = 
  | 'adresse-principale'
  | 'famille'
  | 'amis'
  | 'travail'
  | 'ecole'
  | 'activites';

export interface DailyCategory {
  id: DailyCategoryType;
  name: string;
  icon: string;
  color: string;
}

export interface RelationTypeInfo {
  id: RelationType;
  name: string;
  customLabel?: string;
}

export const DAILY_CATEGORIES: DailyCategory[] = [
  { id: 'adresse-principale', name: 'Adresse principale', icon: '🏠', color: '#8B5CF6' },
  { id: 'famille', name: 'Famille', icon: '👨‍👩‍👧‍👦', color: '#D946EF' },
  { id: 'amis', name: 'Amis', icon: '👫', color: '#3B82F6' },
  { id: 'travail', name: 'Travail', icon: '🏢', color: '#F97316' },
  { id: 'ecole', name: 'École', icon: '🏫', color: '#0EA5E9' },
  { id: 'activites', name: 'Activités', icon: '🎭', color: '#10B981' }
];

export const RELATION_TYPES: RelationTypeInfo[] = [
  { id: 'pere', name: 'Père' },
  { id: 'mere', name: 'Mère' },
  { id: 'frere', name: 'Frère' },
  { id: 'soeur', name: 'Sœur' },
  { id: 'cousin', name: 'Cousin' },
  { id: 'ami', name: 'Ami' },
  { id: 'collegue', name: 'Collègue' },
  { id: 'autre', name: 'Autre' }
];

export const getRelationTypeLabel = (
  relationType: string | undefined, 
  customLabel?: string
): string => {
  if (!relationType) return '';
  
  if (customLabel) return customLabel;
  
  const type = RELATION_TYPES.find(type => type.id === relationType);
  return type ? type.name : relationType;
};
