
import { useEffect } from 'react';
import { toast } from 'sonner';
import { generateFilteredMockResults } from '@/data/mockSearchResults';
import type { Result } from '@/components/ResultsList';

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
    searchResults: Result[];
    setSearchResults: (results: Result[]) => void;
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

export const useSearchOperations = ({
  searchState,
  locationOperations,
  resultSelection
}: UseSearchOperationsProps) => {
  const {
    searchQuery,
    selectedDistance,
    selectedDuration,
    distanceUnit,
    transportMode,
    userLocation,
    resultsCount,
    isLocationActive,
    setIsLocationActive,
    setUserLocation,
    loading,
    setLoading,
    setSearchResults,
    selectedCategory,
    setShowRoutes,
    setSearchPerformed
  } = searchState;

  const { setSelectedResultId } = resultSelection;

  const handleSearchPress = async () => {
    if (searchQuery.trim() && !searchState.searchPerformed) {
      setLoading(true);
      await locationOperations.searchAddress(searchQuery);
      setLoading(false);
    }
    
    setSelectedResultId(undefined);
    
    handleSearch();
  };

  const handleSearch = () => {
    setLoading(true);
    console.log(`Recherche pour: ${searchQuery}`);
    console.log(`Filtres: Catégorie: ${selectedCategory}, Distance: ${selectedDistance}${distanceUnit}, Durée: ${selectedDuration}min, Transport: ${transportMode}`);
    console.log(`Position: ${userLocation}`);
    
    // Enable route display when search is performed
    setShowRoutes(true);
    setSearchPerformed(true);
    
    // Use our mock data generator with all filters
    setTimeout(() => {
      try {
        const mockResults = generateFilteredMockResults(
          searchQuery,
          userLocation,
          {
            category: selectedCategory || undefined,
            radius: selectedDistance,
            radiusUnit: distanceUnit,
            duration: selectedDuration,
            transportMode
          },
          resultsCount
        );
        
        setSearchResults(mockResults);
        
        if (mockResults.length === 0) {
          toast.info('Aucun résultat ne correspond à vos critères. Essayez d\'ajuster vos filtres.');
        } else {
          toast.success(`${mockResults.length} résultat${mockResults.length > 1 ? 's' : ''} trouvé${mockResults.length > 1 ? 's' : ''}`);
        }
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        toast.error('Une erreur s\'est produite lors de la recherche');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  // Initialize search results
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions && navigator.permissions.query({name: 'geolocation'})
        .then(permission => {
          if (permission.state === 'granted') {
            toast.info('Accès à la géolocalisation accordé');
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setUserLocation([position.coords.longitude, position.coords.latitude]);
                setIsLocationActive(true);
              },
              (error) => {
                console.error('Error getting location:', error);
              }
            );
          } else if (permission.state === 'prompt') {
            toast.info('Cliquez sur "Ma position" pour activer la géolocalisation');
          } else if (permission.state === 'denied') {
            toast.error('Accès à la géolocalisation refusé. Veuillez l\'activer dans vos paramètres');
          }
          
          permission.addEventListener('change', () => {
            if (permission.state === 'granted') {
              toast.success('Accès à la géolocalisation accordé');
            } else if (permission.state === 'denied') {
              toast.error('Accès à la géolocalisation refusé');
              setIsLocationActive(false);
            }
          });
        })
        .catch(error => {
          console.error('Error checking geolocation permission:', error);
        });
    }
    
    const initialResults = generateFilteredMockResults('', userLocation, {}, resultsCount);
    setSearchResults(initialResults);
  }, []);

  return {
    handleSearchPress,
    handleSearch
  };
};

export default useSearchOperations;
