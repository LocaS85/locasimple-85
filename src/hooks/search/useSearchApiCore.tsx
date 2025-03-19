
import { useCallback } from 'react';
import { toast } from 'sonner';
import { searchService } from '@/services/search/searchService';
import { searchMapper } from '@/services/search/searchMapper';
import { Result } from '@/components/ResultsList';
import axios from 'axios';

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
      // Try to search using the Flask API first
      try {
        const response = await axios.get(`http://127.0.0.1:5000/search`, {
          params: {
            query: searchQuery,
            mode: transportMode,
            lat: userLocation[1],
            lon: userLocation[0],
            limit: 5 // Default limit
          },
          timeout: 3000 // 3 second timeout
        });
        
        if (response.data && response.data.length > 0) {
          console.log(`Found ${response.data.length} results from Flask API`);
          
          // Transform Flask API response to Result format
          const results: Result[] = response.data.map((item: any, index: number) => ({
            id: `result-${index}`,
            name: item.name,
            latitude: item.lat,
            longitude: item.lon,
            address: '',
            category: '',
            distance: item.distance,
            duration: item.duration
          }));
          
          return results;
        }
      } catch (flaskError) {
        console.warn('Flask API not available, falling back to Mapbox:', flaskError);
      }
      
      // Fallback to Mapbox API if Flask API fails
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
      
      console.log(`Found ${features.length} places for "${searchQuery}" using Mapbox API`);
      
      // Transform results with proper error handling
      const results: Result[] = await Promise.all(
        features.map((feature: any, index: number) => 
          searchMapper.mapFeatureToResult(feature, index, userLocation, transportMode)
        )
      );
      
      return results;
    } catch (error) {
      console.error('Error searching places:', error);
      toast.error('Erreur lors de la recherche de lieux');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userLocation, setLoading]);

  /**
   * Generate PDF from search results
   */
  const generatePDF = useCallback(async (places: any[]): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await axios.post('http://127.0.0.1:5000/generate_pdf', { places });
      
      if (response.status === 200) {
        toast.success('PDF généré avec succès');
        return true;
      } else {
        throw new Error('Erreur lors de la génération du PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erreur lors de la génération du PDF. Vérifiez que le serveur Flask est démarré.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  return {
    searchPlacesNearLocation,
    generatePDF
  };
};

export default useSearchApiCore;
