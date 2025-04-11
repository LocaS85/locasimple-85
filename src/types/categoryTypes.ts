
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
