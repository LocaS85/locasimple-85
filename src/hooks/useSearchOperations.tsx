
import { useSearchOperationsCore } from './search/useSearchOperationsCore';
import { useSearchInitialization } from './search/useSearchInitialization';

interface UseSearchOperationsProps {
  searchState: {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedDistance: number | null;
    selectedDuration: number | null;
    distanceUnit: 'km' | 'miles';
    transportMode: string;
    userLocation: [number, number];
    resultsCount: number;
    isLocationActive: boolean;
    setIsLocationActive: (active: boolean) => void;
    setUserLocation: (location: [number, number]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    searchResults: any[];
    setSearchResults: (results: any[]) => void;
    selectedCategory: string | null;
    showRoutes: boolean;
    setShowRoutes: (show: boolean) => void;
    searchPerformed: boolean;
    setSearchPerformed: (performed: boolean) => void;
  };
  locationOperations: {
    handleLocationClick: () => void;
    searchAddress: (address: string) => Promise<void>;
  };
  resultSelection: {
    selectedResultId: string | undefined;
    setSelectedResultId: (id: string | undefined) => void;
  };
}

export const useSearchOperations = (props: UseSearchOperationsProps) => {
  const { searchState, locationOperations, resultSelection } = props;

  // Initialize search results and geolocation
  useSearchInitialization({
    userLocation: searchState.userLocation,
    resultsCount: searchState.resultsCount,
    setUserLocation: searchState.setUserLocation,
    setIsLocationActive: searchState.setIsLocationActive,
    setSearchResults: searchState.setSearchResults
  });

  // Core search operations
  const { handleSearchPress, handleSearch } = useSearchOperationsCore({
    searchState,
    locationOperations,
    resultSelection
  });

  return {
    handleSearchPress,
    handleSearch
  };
};

export default useSearchOperations;
