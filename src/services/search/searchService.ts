
import { MAPBOX_TOKEN } from '@/config/environment';
import { Result } from '@/components/ResultsList';
import { toast } from 'sonner';

export interface SearchParams {
  searchQuery: string;
  userLocation: [number, number];
  transportMode: string;
  limit?: number;
}

export interface RouteCalculationParams {
  origin: [number, number];
  destination: [number, number];
  transportMode: string;
}

export const searchService = {
  /**
   * Search for places near a location using the Mapbox API
   */
  async searchPlacesNearLocation({
    searchQuery,
    userLocation,
    transportMode,
    limit = 5
  }: SearchParams): Promise<Result[] | null> {
    if (!MAPBOX_TOKEN) {
      console.error('Mapbox token missing for place search');
      return null;
    }

    if (!userLocation) {
      console.warn('User location not available for search');
      return null;
    }

    console.log(`Searching places near [${userLocation}] for "${searchQuery}" using ${transportMode} mode`);
    
    try {
      // Proximity parameters based on user location
      const proximity = `${userLocation[0]},${userLocation[1]}`;
      
      // Create Mapbox request with POI search
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&proximity=${proximity}&types=poi&limit=${limit}&language=fr`;
      console.log(`Fetching from: ${url.replace(MAPBOX_TOKEN, 'API_KEY_HIDDEN')}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        console.log(`No results found for "${searchQuery}"`);
        return [];
      }
      
      console.log(`Found ${data.features.length} places for "${searchQuery}"`);
      return data.features;
    } catch (error) {
      console.error('Error searching via Mapbox:', error);
      return null;
    }
  },

  /**
   * Calculate route information between two points
   */
  async calculateRouteInfo({
    origin,
    destination,
    transportMode
  }: RouteCalculationParams): Promise<{ distance: number; duration: number } | null> {
    if (!MAPBOX_TOKEN) {
      console.error('Mapbox token missing for route calculation');
      return null;
    }

    try {
      const [originLon, originLat] = origin;
      const [destLon, destLat] = destination;
      
      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${originLon},${originLat};${destLon},${destLat}?access_token=${MAPBOX_TOKEN}`;
      
      const directionsResponse = await fetch(directionsUrl);
      
      if (!directionsResponse.ok) {
        throw new Error(`Directions API Error: ${directionsResponse.status}`);
      }
      
      const directionsData = await directionsResponse.json();
      
      if (directionsData.routes && directionsData.routes.length > 0) {
        return {
          distance: (directionsData.routes[0].distance / 1000) || 0, // km
          duration: Math.round(directionsData.routes[0].duration / 60) || 0 // minutes
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error calculating route info:', error);
      return null;
    }
  }
};

export default searchService;
