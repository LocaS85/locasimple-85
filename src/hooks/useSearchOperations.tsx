
import { useCallback } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useSearchOperationsCore } from './search/useSearchOperationsCore';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

interface UseSearchOperationsProps {
  searchState: any;
  resultSelection: any;
}

export const useSearchOperations = ({
  searchState,
  resultSelection
}: UseSearchOperationsProps) => {
  // Setup geolocation hook
  const { activateGeolocation } = useGeolocation({
    setLoading: searchState.setLoading,
    setIsLocationActive: searchState.setIsLocationActive,
    setUserLocation: searchState.setUserLocation
  });

  // Define location operations
  const locationOperations = {
    searchAddress: useCallback(async (address: string) => {
      if (!address.trim() || !MAPBOX_TOKEN) {
        return;
      }
      
      searchState.setLoading(true);
      console.log(`Searching for address: "${address}"`);
      
      try {
        // Utiliser l'API de géocodage Mapbox
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&limit=1&language=fr`
        );
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const [longitude, latitude] = data.features[0].center;
          searchState.setUserLocation([longitude, latitude]);
          searchState.setIsLocationActive(true);
          toast.success(`Position définie sur: ${data.features[0].place_name}`);
          console.log(`Address found: ${data.features[0].place_name} at [${longitude}, ${latitude}]`);
        } else {
          toast.error(`Adresse "${address}" introuvable`);
        }
      } catch (error) {
        console.error('Erreur de recherche d\'adresse:', error);
        toast.error('Erreur lors de la recherche d\'adresse');
      }
    }, [searchState])
  };

  // Setup core search operations
  const { handleSearchPress, handleSearch } = useSearchOperationsCore({
    searchState,
    locationOperations,
    resultSelection
  });

  // Define the public interface
  return {
    handleSearchPress,
    handleSearch,
    activateGeolocation
  };
};

export default useSearchOperations;
