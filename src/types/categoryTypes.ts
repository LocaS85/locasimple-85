
export type DistanceUnit = 'km' | 'mi';
export type TransportMode = 'driving' | 'walking' | 'cycling' | 'transit' | 'train' | 'boat';

export interface CategoryFilter {
  categoryId: string;
  subcategoryId?: string;
}

export interface SearchFilters {
  radius: number;
  distanceUnit: DistanceUnit;
  duration?: number | null;
  timeUnit?: 'minutes' | 'hours';
  transportMode: TransportMode;
  categories?: CategoryFilter[];
  timeRange?: {
    start: string;
    end: string;
  };
  openNow?: boolean;
  sort?: 'distance' | 'rating' | 'relevance';
}

export interface Category {
  id: string;
  name: string;
  icon?: string | React.ReactNode;
  color?: string;
  subCategories?: SubCategory[];
  children?: any[];
}

export interface SubCategory {
  id: string;
  name: string;
  parentId: string;
  icon?: string | React.ReactNode;
  children?: SubCategory[];
}

export interface Address {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category?: string;
  isFavorite?: boolean;
  notes?: string;
  lastVisited?: string;
}

export interface TransportModeWithColor {
  id: TransportMode;
  name: string;
  icon: React.ReactNode;
  color: string;
  disabled?: boolean;
}
