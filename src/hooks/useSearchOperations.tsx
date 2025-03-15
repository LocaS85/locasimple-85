
import { useCallback } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useSearchOperationsCore } from './search/useSearchOperationsCore';

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
      // Implementation goes here
      console.log(`Searching for address: ${address}`);
    }, [])
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
