
import axios from 'axios';
import { toast } from 'sonner';

export interface SearchResult {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number | string;
  time?: number | string;
  duration?: number | string;
  address?: string;
  category?: string;
  rating?: number;
  image?: string;
}

class SearchResultsService {
  private apiBaseUrl = 'http://127.0.0.1:5000';
  private mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || '';
  
  // Get mock search results for testing purposes
  async getMockResults(query: string): Promise<SearchResult[]> {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: 'place-1',
        name: 'Café Paris',
        latitude: 48.8584,
        longitude: 2.2945,
        distance: '2.3 km',
        time: '15 min',
        address: '25 Rue de la Paix, Paris',
        category: 'restaurants',
        rating: 4.5,
      },
      {
        id: 'place-2',
        name: 'Galeries Lafayette',
        latitude: 48.8738,
        longitude: 2.3324,
        distance: '1.8 km',
        time: '12 min',
        address: '40 Boulevard Haussmann, Paris',
        category: 'shopping',
        rating: 4.2,
      },
      {
        id: 'place-3',
        name: 'Louvre Museum',
        latitude: 48.8606,
        longitude: 2.3376,
        distance: '3.5 km',
        time: '20 min',
        address: 'Rue de Rivoli, Paris',
        category: 'entertainment',
        rating: 4.8,
      }
    ];
  }
  
  // Search for places using the API
  async searchPlaces(
    query: string, 
    lat: number, 
    lon: number, 
    limit: number = 5, 
    transportMode: string = 'driving'
  ): Promise<SearchResult[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/search`, {
        params: {
          query,
          lat,
          lon,
          limit,
          mode: transportMode
        },
        timeout: 5000
      });
      
      return response.data.map((item: any) => ({
        id: item.id || `place-${Math.random().toString(36).substr(2, 9)}`,
        name: item.name,
        latitude: item.lat,
        longitude: item.lon,
        distance: item.distance,
        time: item.duration,
        duration: item.duration,
        address: item.place_name || '',
        category: item.category || 'general',
        rating: item.rating || Math.random() * 2 + 3, // Random rating between 3-5 if not provided
      }));
    } catch (error) {
      console.error('Error searching places:', error);
      toast.error('Server error. Using backup search method.');
      return this.searchWithMapbox(query, lat, lon, limit);
    }
  }
  
  // Backup search using Mapbox
  async searchWithMapbox(
    query: string, 
    lat: number, 
    lon: number, 
    limit: number = 5
  ): Promise<SearchResult[]> {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
        {
          params: {
            access_token: this.mapboxToken,
            proximity: `${lon},${lat}`,
            types: 'poi',
            limit: limit,
            language: 'fr'
          }
        }
      );
      
      if (response.data && response.data.features && response.data.features.length > 0) {
        return response.data.features.map((feature: any) => ({
          id: feature.id,
          name: feature.text,
          latitude: feature.center[1],
          longitude: feature.center[0],
          address: feature.place_name,
          category: this.classifyPlace(feature.properties?.category || ''),
          distance: '~',
          time: '~'
        }));
      }
      return [];
    } catch (error) {
      console.error('Error with Mapbox search:', error);
      toast.error('Impossible de communiquer avec les serveurs de recherche');
      return [];
    }
  }
  
  // Method to search by category
  async searchByCategory(
    categoryType: string,
    lat: number,
    lon: number,
    limit: number = 5
  ): Promise<SearchResult[]> {
    try {
      // Try to use the backend API first
      const response = await axios.get(`${this.apiBaseUrl}/search`, {
        params: {
          query: categoryType,
          lat,
          lon,
          limit,
          category: categoryType
        },
        timeout: 3000
      });
      
      if (response.data && response.data.length > 0) {
        return response.data.map((item: any) => ({
          id: item.id || `place-${Math.random().toString(36).substr(2, 9)}`,
          name: item.name,
          latitude: item.lat,
          longitude: item.lon,
          distance: item.distance,
          time: item.duration,
          address: item.place_name || '',
          category: categoryType,
          rating: item.rating
        }));
      }
      
      // Fallback to Mapbox if no results from backend
      return await this.searchWithMapbox(categoryType, lat, lon, limit);
    } catch (error) {
      console.error('Error searching by category:', error);
      // Fallback to Mapbox
      return await this.searchWithMapbox(categoryType, lat, lon, limit);
    }
  }
  
  // Helper to classify place categories
  private classifyPlace(category: string): string {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('restaurant') || lowerCategory.includes('food') || lowerCategory.includes('café')) {
      return 'restaurants';
    } else if (lowerCategory.includes('shop') || lowerCategory.includes('store') || lowerCategory.includes('market')) {
      return 'shopping';
    } else if (
      lowerCategory.includes('museum') || 
      lowerCategory.includes('theater') || 
      lowerCategory.includes('cinema') || 
      lowerCategory.includes('park')
    ) {
      return 'entertainment';
    }
    
    return 'general';
  }
}

const searchResultsService = new SearchResultsService();
export default searchResultsService;
