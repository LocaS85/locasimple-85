
import { MAPBOX_TOKEN } from '@/config/environment';

export interface SearchResult {
  id: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
  properties?: {
    category?: string;
    description?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface SearchOptions {
  query: string;
  limit?: number;
  language?: string;
  types?: string[];
  proximity?: [number, number]; // [longitude, latitude]
  bbox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  country?: string[];
  autocomplete?: boolean;
}

class MapboxService {
  private baseUrl = 'https://api.mapbox.com';
  
  constructor(private apiKey: string = MAPBOX_TOKEN || '') {}
  
  /**
   * Search for places using Mapbox Geocoding API
   */
  async searchPlaces(options: SearchOptions): Promise<SearchResult[]> {
    try {
      if (!this.apiKey) {
        console.error('Mapbox API key is missing');
        return [];
      }
      
      const {
        query,
        limit = 5,
        language = 'en',
        types = ['poi', 'address', 'place'],
        proximity,
        bbox,
        country,
        autocomplete = true
      } = options;
      
      // Build query parameters
      const params = new URLSearchParams({
        access_token: this.apiKey,
        limit: limit.toString(),
        language,
        types: types.join(','),
        autocomplete: autocomplete.toString()
      });
      
      if (proximity) {
        params.append('proximity', proximity.join(','));
      }
      
      if (bbox) {
        params.append('bbox', bbox.join(','));
      }
      
      if (country) {
        params.append('country', country.join(','));
      }
      
      // Build the URL
      const encodedQuery = encodeURIComponent(query);
      const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodedQuery}.json?${params.toString()}`;
      
      // Make the request
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.features || [];
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }
  
  /**
   * Get directions between two points
   */
  async getDirections(
    start: [number, number], // [longitude, latitude]
    end: [number, number], // [longitude, latitude]
    profile: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<any> {
    try {
      if (!this.apiKey) {
        console.error('Mapbox API key is missing');
        return null;
      }
      
      const url = `${this.baseUrl}/directions/v5/mapbox/${profile}/${start.join(',')};${end.join(',')}?access_token=${this.apiKey}&geometries=geojson&overview=full&steps=true`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.routes?.[0] || null;
    } catch (error) {
      console.error('Error getting directions:', error);
      return null;
    }
  }
  
  /**
   * Get the distance and duration between two points
   */
  async getDistanceMatrix(
    origins: [number, number][], // [[longitude, latitude], ...]
    destinations: [number, number][], // [[longitude, latitude], ...]
    profile: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<any> {
    try {
      if (!this.apiKey) {
        console.error('Mapbox API key is missing');
        return null;
      }
      
      // Convert coordinates to strings
      const coords = [...origins, ...destinations].map(coord => coord.join(',')).join(';');
      
      // Build the sources and destinations arrays
      const sources = origins.map((_, i) => i.toString());
      const dests = destinations.map((_, i) => (i + origins.length).toString());
      
      const url = `${this.baseUrl}/directions-matrix/v1/mapbox/${profile}/${coords}?access_token=${this.apiKey}&sources=${sources.join(';')}&destinations=${dests.join(';')}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting distance matrix:', error);
      return null;
    }
  }
}

// Create a singleton instance
export const mapboxService = new MapboxService();

export default mapboxService;
