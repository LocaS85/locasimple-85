
import React from 'react';
import { toast } from 'sonner';
import { generateFilteredMockResults } from '@/data/mockSearchResults';

interface SearchHandlerProps {
  searchQuery: string;
  selectedCategory: string | null;
  selectedDistance: number | null;
  selectedDuration: number | null;
  distanceUnit: 'km' | 'miles';
  transportMode: string;
  userLocation: [number, number];
  resultsCount: number;
  setLoading: (loading: boolean) => void;
  setSearchResults: (results: any[]) => void;
  showRoutes?: boolean;
  setShowRoutes?: (show: boolean) => void;
  setSearchPerformed?: (performed: boolean) => void;
}

export const SearchHandler: React.FC<SearchHandlerProps> = (props) => {
  return (
    <React.Fragment>
      {/* This is a utility component that only provides functionality */}
    </React.Fragment>
  );
};

// Export the handler separately
export const useSearchHandler = ({
  searchQuery,
  selectedCategory,
  selectedDistance,
  selectedDuration,
  distanceUnit,
  transportMode,
  userLocation,
  resultsCount,
  setLoading,
  setSearchResults,
  showRoutes = false,
  setShowRoutes = () => {},
  setSearchPerformed = () => {}
}: SearchHandlerProps) => {
  const handleSearch = (query: string = searchQuery) => {
    setLoading(true);
    console.log(`Recherche pour: ${query}`);
    console.log(`Filtres: Catégorie: ${selectedCategory}, Distance: ${selectedDistance}${distanceUnit}, Durée: ${selectedDuration}min, Transport: ${transportMode}`);
    console.log(`Position: ${userLocation}`);
    
    // Enable route display when search is performed
    setShowRoutes(true);
    setSearchPerformed(true);
    
    // Use our mock data generator with all filters
    setTimeout(() => {
      try {
        const mockResults = generateFilteredMockResults(
          query,
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

  return { handleSearch };
};

export default SearchHandler;
