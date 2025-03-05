import React from 'react';

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
      {/* This component is deprecated and its functionality has been moved to useSearchOperations */}
    </React.Fragment>
  );
};

// This export is kept for backward compatibility
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
  console.warn('useSearchHandler is deprecated. Use useSearchOperations instead.');
  
  const handleSearch = (query: string = searchQuery) => {
    console.warn('This function is deprecated. Use useSearchOperations instead.');
    // Functionality moved to useSearchOperations
  };

  return { handleSearch };
};

export default SearchHandler;
