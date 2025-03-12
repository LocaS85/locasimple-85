
// Re-export all types and services for backwards compatibility
export * from './types';
export * from './searchService';
export * from './directionsService';

// Create a combined service for backwards compatibility
import { mapboxSearchService } from './searchService';
import { mapboxDirectionsService } from './directionsService';

class MapboxService {
  searchPlaces = mapboxSearchService.searchPlaces.bind(mapboxSearchService);
  getDirections = mapboxDirectionsService.getDirections.bind(mapboxDirectionsService);
  getMultiModeDirections = mapboxDirectionsService.getMultiModeDirections.bind(mapboxDirectionsService);
}

export const mapboxService = new MapboxService();
