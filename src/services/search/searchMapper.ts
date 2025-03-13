
import { Result } from '@/components/ResultsList';
import { searchService } from './searchService';

export const searchMapper = {
  /**
   * Transform a Mapbox feature into our Result type with additional metadata
   */
  async mapFeatureToResult(
    feature: any,
    index: number,
    userLocation: [number, number],
    transportMode: string
  ): Promise<Result> {
    // Default values to ensure we always return a valid Result
    const defaultResult: Result = {
      id: feature.id || `result-${index}`,
      name: feature.text || feature.place_name?.split(',')[0] || 'Lieu inconnu',
      address: feature.place_name || '',
      distance: 0,
      duration: 0,
      category: 'autre',
      color: 'blue',
      latitude: feature.center[1],
      longitude: feature.center[0],
      description: feature.properties?.description || '',
    };
    
    try {
      // Calculate distance and duration if possible
      if (userLocation && feature.center) {
        const [lon, lat] = feature.center;
        
        try {
          const routeInfo = await searchService.calculateRouteInfo({
            origin: userLocation,
            destination: [lon, lat],
            transportMode
          });
          
          if (routeInfo) {
            defaultResult.distance = routeInfo.distance;
            defaultResult.duration = routeInfo.duration;
            console.log(`Route to ${defaultResult.name}: ${defaultResult.distance.toFixed(2)}km, ${defaultResult.duration}min`);
          }
        } catch (directionError) {
          console.error('Direction calculation error:', directionError);
          // Fallback to approximate calculation
          const R = 6371; // Earth radius in km
          const dLat = (lat - userLocation[1]) * Math.PI / 180;
          const dLon = (lon - userLocation[0]) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(userLocation[1] * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          defaultResult.distance = R * c;
          defaultResult.duration = Math.round(defaultResult.distance / 50 * 60); // Estimate based on 50 km/h
          console.log(`Estimated route to ${defaultResult.name}: ${defaultResult.distance.toFixed(2)}km, ${defaultResult.duration}min`);
        }
      }

      // Determine category and color
      if (feature.properties && feature.properties.category) {
        defaultResult.category = feature.properties.category;
      } else {
        // Try to infer category from name
        const name = defaultResult.name.toLowerCase();
        if (name.includes('restaurant') || name.includes('café') || name.includes('bar')) {
          defaultResult.category = 'restaurants';
          defaultResult.color = 'orange';
        } else if (name.includes('hotel') || name.includes('auberge')) {
          defaultResult.category = 'hébergements';
          defaultResult.color = 'purple';
        } else if (name.includes('magasin') || name.includes('boutique') || name.includes('store')) {
          defaultResult.category = 'commerces';
          defaultResult.color = 'green';
        }
      }
      
      return defaultResult;
    } catch (error) {
      console.error('Error processing search result:', error);
      return defaultResult;
    }
  }
};

export default searchMapper;
