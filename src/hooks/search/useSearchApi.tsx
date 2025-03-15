
import { useCallback } from 'react';
import { useSearchApiCore } from './useSearchApiCore';
import { Result } from '@/components/ResultsList';

interface UseSearchApiProps {
  userLocation: [number, number];
  resultsCount: number;
  setLoading: (loading: boolean) => void;
}

export const useSearchApi = ({
  userLocation,
  resultsCount,
  setLoading
}: UseSearchApiProps) => {
  const { searchPlacesNearLocation } = useSearchApiCore({
    userLocation,
    setLoading
  });

  /**
   * Get search results based on query and filters
   */
  const getSearchResults = useCallback(async (
    searchQuery: string,
    transportMode: string,
    category: string | null,
    distance: number | null,
    duration: number | null,
    distanceUnit: 'km' | 'miles'
  ): Promise<Result[]> => {
    console.log(`Getting search results for "${searchQuery}" with filters:`);
    console.log(`- Category: ${category || 'All'}`);
    console.log(`- Distance: ${distance || 'Not set'} ${distanceUnit}`);
    console.log(`- Duration: ${duration || 'Not set'} minutes`);
    console.log(`- Transport mode: ${transportMode}`);
    
    try {
      // First, get places near the user's location
      const results = await searchPlacesNearLocation(searchQuery, transportMode);
      
      if (!results) return [];
      
      // Apply filters
      let filteredResults = [...results];
      
      // Apply category filter
      if (category) {
        filteredResults = filteredResults.filter(result => 
          result.category === category || 
          (result.categories && result.categories.includes(category))
        );
      }
      
      // Apply distance filter
      if (distance) {
        // Convert from km/miles to meters
        const distanceInMeters = distance * (distanceUnit === 'km' ? 1000 : 1609.34);
        filteredResults = filteredResults.filter(result => result.distanceInMeters <= distanceInMeters);
      }
      
      // Apply duration filter
      if (duration) {
        // Convert from minutes to seconds
        const durationInSeconds = duration * 60;
        filteredResults = filteredResults.filter(result => result.durationInSeconds <= durationInSeconds);
      }
      
      // Limit results
      return filteredResults.slice(0, resultsCount);
    } catch (error) {
      console.error('Error getting search results:', error);
      return [];
    }
  }, [searchPlacesNearLocation, resultsCount]);

  return {
    getSearchResults
  };
};

export default useSearchApi;
