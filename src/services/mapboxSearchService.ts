
import axios from 'axios';
import { MAPBOX_TOKEN } from '@/config/environment';
import { DistanceUnit } from '@/types/categoryTypes';
import { Result } from '@/components/ResultsList';
import { toast } from 'sonner';

export interface SearchOptions {
  query: string;
  userLocation: [number, number];
  limit?: number;
  radius?: number;
  radiusUnit?: DistanceUnit;
  category?: string | null;
  transportMode?: string;
}

export class MapboxSearchService {
  private getMapboxToken(): string | null {
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN.trim().length === 0) {
      console.error('Mapbox token is missing or empty');
      return null;
    }
    return MAPBOX_TOKEN;
  }
  
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  private estimateDuration(distanceInMeters: number, mode: string): number {
    // Average speeds in meters per second
    const speeds: Record<string, number> = {
      'driving': 13.9, // 50 km/h
      'walking': 1.4,  // 5 km/h
      'cycling': 4.2,  // 15 km/h
      'transit': 8.3   // 30 km/h
    };

    const speed = speeds[mode] || speeds.driving;
    return distanceInMeters / speed; // Duration in seconds
  }
  
  private getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'restaurants': '#FF5252',
      'shopping': '#448AFF',
      'entertainment': '#7C4DFF',
      'health': '#4CAF50',
      'services': '#FF9800',
      'transport': '#795548'
    };

    // Simple category matching
    if (category.toLowerCase().includes('restaurant') || category.toLowerCase().includes('food')) 
      return colors.restaurants;
    if (category.toLowerCase().includes('shop') || category.toLowerCase().includes('store')) 
      return colors.shopping;
    if (category.toLowerCase().includes('entertainment') || category.toLowerCase().includes('theater')) 
      return colors.entertainment;
    if (category.toLowerCase().includes('health') || category.toLowerCase().includes('doctor')) 
      return colors.health;
    if (category.toLowerCase().includes('service') || category.toLowerCase().includes('bank')) 
      return colors.services;
    if (category.toLowerCase().includes('transport') || category.toLowerCase().includes('station')) 
      return colors.transport;

    // Default color
    return '#9E9E9E';
  }

  async search({
    query,
    userLocation,
    limit = 10,
    radius = 5000,
    category = null,
    transportMode = 'driving'
  }: SearchOptions): Promise<Result[]> {
    const token = this.getMapboxToken();
    
    if (!token) {
      toast.error('Token Mapbox manquant');
      return [];
    }
    
    try {
      let searchQuery = query.trim();
      
      // If no query but category is provided, use the category as query
      if (!searchQuery && category) {
        searchQuery = category;
      }
      
      // Fallback to a generic term if no query or category
      if (!searchQuery) searchQuery = 'places';
      
      const searchParams = {
        access_token: token,
        proximity: `${userLocation[0]},${userLocation[1]}`,
        limit: limit,
        language: 'fr'
      };
      
      // Add category filter
      if (category) {
        // For Mapbox Geocoding API, we can focus on POIs
        searchParams["types"] = "poi";
      }
      
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json`,
        { params: searchParams }
      );
      
      if (!response.data || !response.data.features || response.data.features.length === 0) {
        return [];
      }
      
      // Transform results to our format
      const results: Result[] = response.data.features.map((feature: any, index: number) => {
        const distance = this.calculateDistance(
          userLocation[1], userLocation[0], 
          feature.center[1], feature.center[0]
        );
        
        const duration = this.estimateDuration(distance, transportMode);
        
        return {
          id: feature.id || `result-${index}`,
          name: feature.text || feature.place_name,
          address: feature.place_name,
          category: feature.properties?.category || category || '',
          latitude: feature.center[1],
          longitude: feature.center[0],
          distance: parseFloat((distance / 1000).toFixed(1)), // Convert to km
          duration: Math.round(duration / 60), // Convert to minutes
          distanceInMeters: distance,
          durationInSeconds: duration,
          color: this.getCategoryColor(feature.properties?.category || category || '')
        };
      });
      
      return results;
      
    } catch (error) {
      console.error('Error searching with Mapbox:', error);
      toast.error('Erreur lors de la recherche avec Mapbox');
      return [];
    }
  }
  
  async getDirections(
    origin: [number, number],
    destination: [number, number],
    mode: string = 'driving'
  ): Promise<any> {
    const token = this.getMapboxToken();
    
    if (!token) {
      toast.error('Token Mapbox manquant');
      return null;
    }
    
    try {
      // Convert transport mode to Mapbox profile
      const profile = 
        mode === 'walking' ? 'mapbox/walking' :
        mode === 'cycling' ? 'mapbox/cycling' :
        mode === 'transit' ? 'mapbox/driving' : // Mapbox doesn't have transit, fallback to driving
        'mapbox/driving';
      
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/${profile}/${origin[0]},${origin[1]};${destination[0]},${destination[1]}`,
        {
          params: {
            access_token: token,
            alternatives: false,
            geometries: 'geojson',
            overview: 'full',
            steps: true
          }
        }
      );
      
      if (!response.data || !response.data.routes || response.data.routes.length === 0) {
        return null;
      }
      
      return response.data;
      
    } catch (error) {
      console.error('Error getting directions from Mapbox:', error);
      toast.error('Erreur lors du calcul d\'itinéraire');
      return null;
    }
  }
}

const mapboxSearchService = new MapboxSearchService();
export default mapboxSearchService;
