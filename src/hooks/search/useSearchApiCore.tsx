
import { useCallback } from 'react';
import { toast } from 'sonner';
import { searchService } from '@/services/search/searchService';
import { searchMapper } from '@/services/search/searchMapper';
import { Result } from '@/components/ResultsList';

interface UseSearchApiCoreProps {
  userLocation: [number, number];
  setLoading: (loading: boolean) => void;
}

export const useSearchApiCore = ({
  userLocation,
  setLoading
}: UseSearchApiCoreProps) => {
  
  /**
   * Search for places near the user's location
   */
  const searchPlacesNearLocation = useCallback(async (
    searchQuery: string,
    transportMode: string
  ): Promise<Result[] | null> => {
    setLoading(true);
    console.log(`Searching places near [${userLocation}] for "${searchQuery}" using ${transportMode} mode`);
    
    try {
      // Search for places using the Mapbox API
      const features = await searchService.searchPlacesNearLocation({
        searchQuery,
        userLocation,
        transportMode
      });
      
      if (!features) {
        toast.error('Erreur lors de la recherche de lieux');
        return null;
      }
      
      if (features.length === 0) {
        toast.info(`Aucun résultat pour "${searchQuery}" près de votre position`);
        return [];
      }
      
      console.log(`Found ${features.length} places for "${searchQuery}"`);
      
      // Transform results with proper error handling
      const results: Result[] = await Promise.all(
        features.map((feature: any, index: number) => 
          searchMapper.mapFeatureToResult(feature, index, userLocation, transportMode)
        )
      );
      
      return results;
    } catch (error) {
      console.error('Error searching via Mapbox:', error);
      toast.error('Erreur lors de la recherche de lieux');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userLocation, setLoading]);

  return {
    searchPlacesNearLocation
  };
};

export default useSearchApiCore;
