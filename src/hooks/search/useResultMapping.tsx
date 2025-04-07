
import { useCallback } from 'react';

// Define the Result interface with the color property
export interface RawResult {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address: string;
  category?: string;
  distance: number;
  duration: number;
  color?: string;  // Add color property
}

export interface MappedResult {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  category?: string;
  distance: number;
  duration: number;
  color?: string;  // Include color property
}

export const useResultMapping = (searchResults: RawResult[]) => {
  const mapResults = useCallback((results: RawResult[]): MappedResult[] => {
    return results.map(place => ({
      id: place.id,
      name: place.name,
      latitude: place.lat,
      longitude: place.lon,
      address: place.address || '',
      category: place.category || '',
      distance: place.distance || 0,
      duration: place.duration || 0,
      color: place.color || ''  // Map color property with default
    }));
  }, []);
  
  const places = mapResults(searchResults);
  
  return { places };
};
