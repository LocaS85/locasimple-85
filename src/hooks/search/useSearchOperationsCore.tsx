
import { toast } from 'sonner';
import { useSearchApi } from './useSearchApi';

interface UseSearchOperationsCoreProps {
  searchState: {
    searchQuery: string;
    selectedDistance: number | null;
    selectedDuration: number | null;
    distanceUnit: 'km' | 'miles';
    transportMode: string;
    userLocation: [number, number];
    resultsCount: number;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setSearchResults: (results: any[]) => void;
    selectedCategory: string | null;
    setShowRoutes: (show: boolean) => void;
    setSearchPerformed: (performed: boolean) => void;
  };
  locationOperations: {
    searchAddress: (address: string) => Promise<void>;
  };
  resultSelection: {
    setSelectedResultId: (id: string | undefined) => void;
  };
}

export const useSearchOperationsCore = ({
  searchState,
  locationOperations,
  resultSelection
}: UseSearchOperationsCoreProps) => {
  const {
    searchQuery,
    selectedDistance,
    selectedDuration,
    distanceUnit,
    transportMode,
    userLocation,
    resultsCount,
    loading,
    setLoading,
    setSearchResults,
    selectedCategory,
    setShowRoutes,
    setSearchPerformed
  } = searchState;

  const { setSelectedResultId } = resultSelection;

  const searchApi = useSearchApi({
    userLocation,
    resultsCount,
    setLoading
  });

  const handleSearchPress = async () => {
    if (searchQuery.trim() && !searchState.searchPerformed) {
      setLoading(true);
      try {
        await locationOperations.searchAddress(searchQuery);
      } catch (error) {
        console.error("Error during address search:", error);
        toast.error("Erreur lors de la recherche d'adresse");
      } finally {
        setLoading(false);
      }
    }
    
    setSelectedResultId(undefined);
    
    handleSearch();
  };

  const handleSearch = async () => {
    setLoading(true);
    console.log(`Recherche pour: ${searchQuery}`);
    console.log(`Filtres: Catégorie: ${selectedCategory}, Distance: ${selectedDistance}${distanceUnit}, Durée: ${selectedDuration}min, Transport: ${transportMode}`);
    console.log(`Position: ${userLocation}`);
    
    // Enable route display when search is performed
    setShowRoutes(true);
    setSearchPerformed(true);
    
    try {
      // Handle empty search query gracefully
      if (!searchQuery.trim()) {
        toast.info('Veuillez saisir un terme de recherche');
        setLoading(false);
        return;
      }

      const results = await searchApi.getSearchResults(
        searchQuery,
        transportMode,
        selectedCategory,
        selectedDistance,
        selectedDuration,
        distanceUnit
      );
      
      setSearchResults(results);
      setLoading(false);
    } catch (error) {
      console.error('Erreur globale de recherche:', error);
      toast.error('Une erreur s\'est produite lors de la recherche');
      setSearchResults([]);
      setLoading(false);
    }
  };

  return {
    handleSearchPress,
    handleSearch
  };
};

export default useSearchOperationsCore;
