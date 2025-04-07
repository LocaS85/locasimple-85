
export interface SubCategory {
  id: string;
  name: string;
  parentId: string;
  children?: SubCategory[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subCategories?: SubCategory[];
  color?: string;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  category: string;
  favorite: boolean;
  transportMode?: 'driving' | 'walking' | 'bicycling' | 'transit' | 'car' | 'train' | 'bus' | 'public' | 'bike' | 'walk' | 'plane' | 'metro' | 'tram' | 'coach' | 'airport' | 'airstrip';
  radius?: number;
  duration?: number;
}

export type TransportMode = 'driving' | 'walking' | 'bicycling' | 'transit' | 'car' | 'train' | 'bus' | 'public' | 'bike' | 'walk' | 'plane' | 'metro' | 'tram' | 'coach' | 'airport' | 'airstrip';

export interface TransportModeWithColor {
  id: TransportMode;
  name: string;
  color: string;
  defaultColor: string;
}
