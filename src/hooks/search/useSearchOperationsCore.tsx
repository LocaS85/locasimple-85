
import { toast } from 'sonner';
import { useSearchApi } from './useSearchApi';
import { startPerformanceMarker, endPerformanceMarker } from '@/utils/performanceMonitoring';
import { handleError, withNetworkErrorHandling } from '@/utils/errorHandling';
import { useWebSocketSearch } from '@/hooks/useWebSocketSearch';
import { appPerformance } from '@/utils/appPerformanceTracker';

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
    searchPerformed: boolean;
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

  // Hook API traditionnel
  const searchApi = useSearchApi({
    userLocation,
    resultsCount,
    setLoading
  });

  // Hook pour WebSocket (temps réel)
  const webSocketSearch = useWebSocketSearch({
    userLocation,
    enabled: true // Active par défaut
  });

  const handleSearchPress = async () => {
    // Ne pas effectuer la recherche si elle est déjà en cours
    if (loading) {
      console.log('Search already in progress, ignoring request');
      return;
    }
    
    appPerformance.trackEvent('search_button_pressed');
    console.log(`Search button pressed with query: "${searchQuery}"`);
    
    if (searchQuery.trim() && !searchState.searchPerformed) {
      setLoading(true);
      startPerformanceMarker('address-search');
      
      try {
        console.log('Attempting address search first');
        await withNetworkErrorHandling(
          () => locationOperations.searchAddress(searchQuery),
          {
            offlineMessage: 'Mode hors ligne: impossible de rechercher l\'adresse',
            offlineFallback: async () => {
              // Si hors ligne, essayer de chercher dans le cache
              console.log('Fallback to cached locations for address search');
              // Logique de fallback si nécessaire
            }
          }
        );
      } catch (error) {
        handleError(error, "Erreur lors de la recherche d'adresse");
      } finally {
        setLoading(false);
        endPerformanceMarker('address-search');
      }
    }
    
    setSelectedResultId(undefined);
    handleSearch();
  };

  const handleSearch = async () => {
    // Ne pas effectuer la recherche si elle est déjà en cours
    if (loading) {
      console.log('Search already in progress, ignoring request');
      return;
    }
    
    setLoading(true);
    startPerformanceMarker('search-execution');
    appPerformance.trackEvent('search_executed');
    
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

      // Essayer d'abord avec WebSocket pour les mises à jour en temps réel
      if (webSocketSearch.connected) {
        console.log('Using WebSocket for real-time search');
        webSocketSearch.search(searchQuery, {
          category: selectedCategory,
          distance: selectedDistance,
          distanceUnit: distanceUnit,
          duration: selectedDuration,
          transportMode: transportMode
        });
        
        // Observer les résultats du WebSocket
        if (webSocketSearch.results.length > 0) {
          console.log(`Got ${webSocketSearch.results.length} results from WebSocket`);
          setSearchResults(webSocketSearch.results);
          endPerformanceMarker('search-execution');
          setLoading(false);
          return;
        }
      }

      // Fallback sur API traditionnelle
      console.log('Falling back to traditional API search');
      const results = await withNetworkErrorHandling(
        () => searchApi.getSearchResults(
          searchQuery,
          transportMode,
          selectedCategory,
          selectedDistance,
          selectedDuration,
          distanceUnit
        ),
        {
          offlineMessage: 'Recherche en mode hors ligne avec données en cache',
        }
      );
      
      console.log(`Search completed with ${results.length} results`);
      setSearchResults(results);
    } catch (error) {
      handleError(error, 'Une erreur s\'est produite lors de la recherche', {
        retry: {
          callback: handleSearch,
          maxAttempts: 2
        }
      });
      setSearchResults([]);
    } finally {
      setLoading(false);
      endPerformanceMarker('search-execution');
    }
  };

  return {
    handleSearchPress,
    handleSearch
  };
};

export default useSearchOperationsCore;
