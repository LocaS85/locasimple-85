
export interface SearchIntent {
  type: 'LOCATION' | 'SERVICE' | 'CATEGORY' | 'GENERAL';
  confidence: number;
  extracted?: {
    location?: string;
    service?: string;
    category?: string;
  };
}

export interface LocationSuggestion {
  id: string;
  name: string;
  address?: string;
  coordinates: [number, number]; // [longitude, latitude]
  type: 'address' | 'poi' | 'city' | 'region';
  relevance: number;
}

export interface SearchContext {
  suggestions?: LocationSuggestion[];
  recentSearches?: string[];
  popularNearby?: LocationSuggestion[];
  userIntent?: SearchIntent;
}

export interface MapFeature {
  id: string;
  geometry: {
    type: 'Point' | 'LineString' | 'Polygon';
    coordinates: number[] | number[][] | number[][][];
  };
  properties: FeatureProperties;
  bbox?: [number, number, number, number]; // minX, minY, maxX, maxY
}

export interface FeatureProperties {
  name: string;
  category?: string;
  description?: string;
  address?: string;
  distance?: number;
  duration?: number;
  rating?: number;
  [key: string]: any; // For additional dynamic properties
}

export interface LayerSource {
  url?: string;
  data?: GeoJSON.FeatureCollection;
  cluster?: boolean;
  clusterRadius?: number;
  [key: string]: any; // For additional provider-specific options
}

export interface LayerStyle {
  circles?: any;
  lines?: any;
  fills?: any;
  symbols?: any;
  [key: string]: any; // For additional styling options
}
