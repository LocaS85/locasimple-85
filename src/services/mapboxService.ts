
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

// Types pour les modes de transport
export type TransportMode = 'driving' | 'walking' | 'cycling' | 'driving-traffic';

// Types pour les résultats de recherche
export interface SearchResult {
  id: string;
  name: string;
  place_name: string;
  center: [number, number];
  properties: Record<string, any>;
  type: string;
}

// Types pour les routes (itinéraires)
export interface RouteResponse {
  routes: Route[];
  waypoints: Waypoint[];
  code: string;
  uuid: string;
}

export interface Route {
  distance: number;
  duration: number;
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  legs: RouteLeg[];
  weight: number;
  weight_name: string;
}

export interface RouteLeg {
  distance: number;
  duration: number;
  summary: string;
  steps: RouteStep[];
}

export interface RouteStep {
  distance: number;
  duration: number;
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  name: string;
  maneuver: {
    instruction: string;
    bearing_before: number;
    bearing_after: number;
    location: [number, number];
    type: string;
    modifier?: string;
  };
}

export interface Waypoint {
  distance: number;
  name: string;
  location: [number, number];
}

// Types pour les options de recherche
export interface SearchOptions {
  query: string;
  proximity?: [number, number];
  autocomplete?: boolean;
  types?: string[];
  limit?: number;
  bbox?: [number, number, number, number];
  language?: string;
}

// Types pour les options d'itinéraire
export interface RouteOptions {
  profile: TransportMode;
  alternatives?: boolean;
  geometries?: 'geojson' | 'polyline';
  steps?: boolean;
  overview?: 'simplified' | 'full' | 'false';
  annotations?: ('distance' | 'duration' | 'speed' | 'congestion')[];
  continue_straight?: boolean;
  voice_instructions?: boolean;
  banner_instructions?: boolean;
  waypoints_per_route?: boolean;
}

class MapboxService {
  private token: string;
  private baseUrl: string = 'https://api.mapbox.com';

  constructor() {
    this.token = MAPBOX_TOKEN;
    if (!this.token) {
      console.error('Mapbox token missing. Functionality will be limited.');
      toast.error('Clé API Mapbox manquante. Certaines fonctionnalités ne seront pas disponibles.');
    }
  }

  /**
   * Vérifie si le token est défini
   */
  private checkToken(): boolean {
    if (!this.token) {
      toast.error('Clé API Mapbox manquante');
      return false;
    }
    return true;
  }

  /**
   * Recherche de lieux avec autocomplétion et proximité
   */
  async searchPlaces(options: SearchOptions): Promise<SearchResult[]> {
    if (!this.checkToken()) return [];

    try {
      const endpoint = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(options.query)}.json`;
      
      // Construction des paramètres de la requête
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
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      return data.features || [];
    } catch (error) {
      console.error('Erreur lors de la recherche de lieux:', error);
      toast.error('Erreur lors de la recherche de lieux');
      return [];
    }
  }

  /**
   * Calcul d'itinéraire entre plusieurs points
   */
  async getDirections(
    waypoints: [number, number][],
    options: RouteOptions
  ): Promise<RouteResponse | null> {
    if (!this.checkToken() || waypoints.length < 2) return null;

    try {
      // Formater les points de passage
      const coordinates = waypoints.map(point => `${point[0]},${point[1]}`).join(';');
      
      // Construire l'URL de l'API
      const endpoint = `${this.baseUrl}/directions/v5/mapbox/${options.profile}/${coordinates}`;
      
      // Construction des paramètres de la requête
      const params = new URLSearchParams({
        access_token: this.token,
        geometries: options.geometries || 'geojson',
        steps: String(options.steps || true),
      });

      if (options.alternatives !== undefined) {
        params.append('alternatives', String(options.alternatives));
      }

      if (options.overview) {
        params.append('overview', options.overview);
      }

      if (options.annotations && options.annotations.length > 0) {
        params.append('annotations', options.annotations.join(','));
      }

      if (options.continue_straight !== undefined) {
        params.append('continue_straight', String(options.continue_straight));
      }

      if (options.voice_instructions !== undefined) {
        params.append('voice_instructions', String(options.voice_instructions));
      }

      if (options.banner_instructions !== undefined) {
        params.append('banner_instructions', String(options.banner_instructions));
      }

      if (options.waypoints_per_route !== undefined) {
        params.append('waypoints_per_route', String(options.waypoints_per_route));
      }

      const response = await fetch(`${endpoint}?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors du calcul d\'itinéraire:', error);
      toast.error('Erreur lors du calcul d\'itinéraire');
      return null;
    }
  }

  /**
   * Calcul d'itinéraires multiples avec différents modes de transport
   */
  async getMultiModeDirections(
    waypoints: [number, number][],
    modes: TransportMode[]
  ): Promise<Record<TransportMode, RouteResponse | null>> {
    const results: Record<TransportMode, RouteResponse | null> = {} as any;
    
    for (const mode of modes) {
      results[mode] = await this.getDirections(waypoints, {
        profile: mode,
        alternatives: true,
        geometries: 'geojson',
        steps: true,
        overview: 'full',
        annotations: ['distance', 'duration'],
      });
    }
    
    return results;
  }
}

export const mapboxService = new MapboxService();
