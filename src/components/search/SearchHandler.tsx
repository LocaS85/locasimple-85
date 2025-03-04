
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
    console.log(`Searching for: ${query}`);
    console.log(`Filters: Category: ${selectedCategory}, Distance: ${selectedDistance}${distanceUnit}, Duration: ${selectedDuration}min, Transport: ${transportMode}`);
    console.log(`User location: ${userLocation}`);
    
    // Enable route display when search is performed
    setShowRoutes(true);
    setSearchPerformed(true);
    
    // Use our mock data generator
    setTimeout(() => {
      setLoading(false);
      const mockResults = generateFilteredMockResults(
        query,
        userLocation,
        {
          category: selectedCategory || undefined,
          radius: selectedDistance || 5,
          radiusUnit: distanceUnit,
          duration: selectedDuration || 15,
          transportMode
        },
        resultsCount
      );
      setSearchResults(mockResults);
      toast.success(`${mockResults.length} résultats trouvés`);
    }, 1000);
  };

  return { handleSearch };
};

export default SearchHandler;
