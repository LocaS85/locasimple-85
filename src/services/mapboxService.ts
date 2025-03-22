
import { MAPBOX_TOKEN } from '@/config/environment';

export interface SearchResult {
  id: string;
  place_name: string;
  name?: string;
  center: [number, number];
  text: string;
  place_type: string[];
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: Record<string, any>;
  isFavorite?: boolean;
}

export interface SearchOptions {
  query: string;
  proximity?: [number, number];
  limit?: number;
  autocomplete?: boolean;
  types?: string[];
  language?: string;
}

export interface RouteOptions {
  profile?: 'driving' | 'walking' | 'cycling' | 'driving-traffic';
  alternatives?: boolean;
  steps?: boolean;
  geometries?: 'geojson' | 'polyline';
  overview?: 'full' | 'simplified' | 'false';
  annotations?: string[];
}

export const mapboxService = {
  async searchPlaces(options: SearchOptions): Promise<SearchResult[]> {
    if (!MAPBOX_TOKEN) {
      console.error('Mapbox token is missing');
      return [];
    }

    try {
      console.log(`Searching for "${options.query}" with Mapbox API`);
      
      // Build URL and parameters
      let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(options.query)}.json`;
      
      const params: Record<string, string> = {
        access_token: MAPBOX_TOKEN,
        limit: String(options.limit || 5)
      };
      
      if (options.proximity) {
        params.proximity = `${options.proximity[0]},${options.proximity[1]}`;
      }
      
      if (options.autocomplete !== undefined) {
        params.autocomplete = options.autocomplete ? 'true' : 'false';
      }
      
      if (options.types && options.types.length > 0) {
        params.types = options.types.join(',');
      }
      
      if (options.language) {
        params.language = options.language;
      }
      
      // Append query parameters
      url += '?' + new URLSearchParams(params).toString();
      
      // Execute the search
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Mapbox search failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log(`Found ${data.features?.length || 0} results`);
      
      return data.features || [];
    } catch (error) {
      console.error('Error searching with Mapbox:', error);
      return [];
    }
  },
  
  async getDirections(
    origin: [number, number],
    destination: [number, number],
    options: RouteOptions = {}
  ): Promise<any> {
    if (!MAPBOX_TOKEN) {
      console.error('Mapbox token is missing');
      return null;
    }
    
    try {
      const profile = options.profile || 'driving';
      let url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin[0]},${origin[1]};${destination[0]},${destination[1]}`;
      
      const params: Record<string, string> = {
        access_token: MAPBOX_TOKEN,
        geometries: options.geometries || 'geojson',
        steps: (options.steps !== undefined) ? String(options.steps) : 'true',
        overview: options.overview || 'full'
      };
      
      if (options.alternatives !== undefined) {
        params.alternatives = options.alternatives ? 'true' : 'false';
      }
      
      if (options.annotations && options.annotations.length > 0) {
        params.annotations = options.annotations.join(',');
      }
      
      url += '?' + new URLSearchParams(params).toString();
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Mapbox directions failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching directions from Mapbox:', error);
      return null;
    }
  }
};

export default mapboxService;
