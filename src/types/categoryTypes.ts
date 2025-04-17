
import React from 'react';

export interface Category {
  id: string;
  name: string;
  icon?: React.FC;
  subcategories?: Subcategory[];
  color?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  icon?: React.FC;
  apiKey?: string;
}

export type DistanceUnit = 'km' | 'mi';

export type TransportMode = 
  | 'driving' 
  | 'walking' 
  | 'cycling' 
  | 'transit' 
  | 'train' 
  | 'ship' 
  | 'plane' 
  | 'carpool';

export interface SearchFilters {
  category: string | null;
  subcategory: string | null;
  distance: number;
  distanceUnit: DistanceUnit;
  duration: number | null;
  transportMode: TransportMode;
  resultsCount: number;
  useCurrentLocation: boolean;
}
