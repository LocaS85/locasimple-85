
import { toast } from 'sonner';
import { MAPBOX_TOKEN } from '@/config/environment';
import { RouteOptions, RouteResponse, TransportMode } from './types';

class MapboxDirectionsService {
  private token: string;
  private baseUrl: string = 'https://api.mapbox.com';

  constructor() {
    this.token = MAPBOX_TOKEN;
    if (!this.token) {
      console.error('Mapbox token missing. Directions functionality will be limited.');
      toast.error('Clé API Mapbox manquante. Les itinéraires seront limités.');
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
   * Calculate route between multiple points
   */
  async getDirections(
    waypoints: [number, number][],
    options: RouteOptions
  ): Promise<RouteResponse | null> {
    if (!this.checkToken() || waypoints.length < 2) return null;

    try {
      // Format waypoints
      const coordinates = waypoints.map(point => `${point[0]},${point[1]}`).join(';');
      
      // Build API URL
      const endpoint = `${this.baseUrl}/directions/v5/mapbox/${options.profile}/${coordinates}`;
      
      // Build query parameters
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
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating route:', error);
      toast.error('Erreur lors du calcul d\'itinéraire');
      return null;
    }
  }

  /**
   * Calculate multiple routes with different transport modes
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

export const mapboxDirectionsService = new MapboxDirectionsService();
