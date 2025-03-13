
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Result } from '@/components/ResultsList';
import { useSearchApiCore } from './useSearchApiCore';
import { mockDataService } from '@/services/search/mockDataService';
import { startPerformanceMarker, endPerformanceMarker } from '@/utils/performanceMonitoring';

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
  
  // Use the core search API hook
  const { searchPlacesNearLocation } = useSearchApiCore({
    userLocation,
    setLoading
  });

  /**
   * Main search function with filtering and fallback to mock data
   */
  const getSearchResults = useCallback(async (
    searchQuery: string,
    transportMode: string,
    selectedCategory: string | null,
    selectedDistance: number | null, 
    selectedDuration: number | null,
    distanceUnit: 'km' | 'miles'
  ): Promise<Result[]> => {
    try {
      startPerformanceMarker('search-execution');
      
      console.log(`Starting search for "${searchQuery}" with filters:`, {
        category: selectedCategory,
        distance: selectedDistance,
        duration: selectedDuration,
        unit: distanceUnit,
        mode: transportMode
      });
      
      // Use Mapbox for real results
      const mapboxResults = await searchPlacesNearLocation(searchQuery, transportMode);
      
      if (mapboxResults) {
        // Filter results according to selected criteria
        console.log(`Filtering ${mapboxResults.length} results by criteria`);
        
        const filteredResults = mapboxResults.filter(result => {
          const matchesCategory = !selectedCategory || result.category === selectedCategory;
          const matchesDistance = !selectedDistance || result.distance <= selectedDistance;
          const matchesDuration = !selectedDuration || result.duration <= selectedDuration;
          return matchesCategory && matchesDistance && matchesDuration;
        });
        
        console.log(`Filter resulted in ${filteredResults.length} matching results`);
        
        if (filteredResults.length === 0) {
          toast.info('Aucun résultat ne correspond à vos critères. Essayez d\'ajuster vos filtres.');
        } else {
          toast.success(`${filteredResults.length} résultat${filteredResults.length > 1 ? 's' : ''} trouvé${filteredResults.length > 1 ? 's' : ''}`);
        }
        
        endPerformanceMarker('search-execution');
        return filteredResults;
      }
      
      // Fallback to mock data if Mapbox fails
      console.log('Mapbox search failed, falling back to mock data');
      toast.info('Utilisation de données simulées (API indisponible)');
      
      const mockResults = await mockDataService.getMockSearchResults({
        searchQuery,
        userLocation,
        transportMode,
        category: selectedCategory,
        distance: selectedDistance,
        duration: selectedDuration,
        distanceUnit,
        resultsCount
      });
      
      if (mockResults.length === 0) {
        toast.info('Aucun résultat ne correspond à vos critères.');
      } else {
        toast.success(`${mockResults.length} résultat${mockResults.length > 1 ? 's' : ''} trouvé${mockResults.length > 1 ? 's' : ''}`);
      }
      
      endPerformanceMarker('search-execution');
      return mockResults;
    } catch (error) {
      console.error('Global search error:', error);
      toast.error('Une erreur s\'est produite lors de la recherche');
      endPerformanceMarker('search-execution');
      return [];
    }
  }, [searchPlacesNearLocation, userLocation, resultsCount]);

  return {
    searchPlacesNearLocation,
    getSearchResults
  };
};

export default useSearchApi;
