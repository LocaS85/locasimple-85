
import { toast } from 'sonner';
import { MAPBOX_TOKEN } from '@/config/environment';
import { SearchOptions, SearchResult } from './types';

class MapboxSearchService {
  private token: string;
  private baseUrl: string = 'https://api.mapbox.com';

  constructor() {
    this.token = MAPBOX_TOKEN;
    if (!this.token) {
      console.error('Mapbox token missing. Search functionality will be limited.');
      toast.error('Clé API Mapbox manquante. La recherche sera limitée.');
    }
  }

  /**
   * Checks if the token is defined
   */
  private checkToken(): boolean {
    if (!this.token) {
      toast.error('Clé API Mapbox manquante');
      return false;
    }
    return true;
  }

  /**
   * Search for places with autocomplete and proximity
   */
  async searchPlaces(options: SearchOptions): Promise<SearchResult[]> {
    if (!this.checkToken()) return [];

    try {
      const endpoint = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(options.query)}.json`;
      
      // Build query parameters
      const params = new URLSearchParams({
        access_token: this.token,
        limit: String(options.limit || 5),
      });

      if (options.proximity) {
        params.append('proximity', `${options.proximity[0]},${options.proximity[1]}`);
      }

      if (options.autocomplete !== undefined) {
        params.append('autocomplete', String(options.autocomplete));
      }

      if (options.types && options.types.length > 0) {
        params.append('types', options.types.join(','));
      }

      if (options.language) {
        params.append('language', options.language);
      }

      if (options.bbox) {
        params.append('bbox', options.bbox.join(','));
      }

      const response = await fetch(`${endpoint}?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.features || [];
    } catch (error) {
      console.error('Error searching for places:', error);
      toast.error('Erreur lors de la recherche de lieux');
      return [];
    }
  }
}

export const mapboxSearchService = new MapboxSearchService();
