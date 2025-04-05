
import { useCallback } from 'react';
import { useSearchPageState } from './search/useSearchPageState';
import { useLocationHandling } from './search/useLocationHandling';
import { useSearchOperations } from './search/useSearchOperations';
import { useResultHandling } from './search/useResultHandling';
import { useInitialization } from './search/useInitialization';
import { useResultMapping } from './search/useResultMapping';

export const useSearchPageStateManager = () => {
  // Core state
  const searchState = useSearchPageState();
  
  // Result mapping
  const { places } = useResultMapping(searchState.searchResults);
  
  // Location handling
  const { handleLocationClick } = useLocationHandling(
    searchState.setLoading,
    searchState.setUserLocation,
    searchState.setViewport,
    searchState.setIsLocationActive
  );
  
  // Search operations
  const { performSearch, resetSearch } = useSearchOperations(
    searchState.searchQuery,
    searchState.transportMode,
    searchState.userLocation,
    searchState.resultsCount,
    searchState.selectedCategory,
    searchState.setSearchResults,
    searchState.setLoading,
    searchState.setViewport,
    searchState.setShowNoMapboxTokenWarning
  );
  
  // Category operations - implemented here to maintain state reference
  const handleCategoryToggle = useCallback((category: string) => {
    searchState.setSelectedCategory(prev => prev === category ? null : category);
  }, [searchState.setSelectedCategory]);

  const clearFilters = useCallback(() => {
    searchState.setSelectedCategory(null);
  }, [searchState.setSelectedCategory]);
  
  // Result handling operations - Fixed to match the expected parameters
  const resultHandling = useResultHandling(
    searchState.setPopupInfo || (() => {}), // Provide a default function if setPopupInfo is undefined
    searchState.setViewport,
    searchState.setShowRoutes
  );
  
  // Initialization
  useInitialization(handleLocationClick, searchState.setShowNoMapboxTokenWarning);

  return {
    // Basic state
    searchQuery: searchState.searchQuery,
    setSearchQuery: searchState.setSearchQuery,
    resultsCount: searchState.resultsCount,
    setResultsCount: searchState.setResultsCount,
    searchResults: searchState.searchResults,
    loading: searchState.loading,
    transportMode: searchState.transportMode,
    setTransportMode: searchState.setTransportMode,
    userLocation: searchState.userLocation,
    isLocationActive: searchState.isLocationActive,
    selectedPlaceId: searchState.selectedPlaceId,
    showRoutes: searchState.showRoutes,
    selectedCategory: searchState.selectedCategory,
    setSelectedCategory: searchState.setSelectedCategory,
    showNoMapboxTokenWarning: searchState.showNoMapboxTokenWarning,
    setShowNoMapboxTokenWarning: searchState.setShowNoMapboxTokenWarning,
    places,
    
    // Handlers
    handleLocationClick,
    handleCategoryToggle,
    clearFilters,
    performSearch,
    handleResultClick: resultHandling.handleResultClick,
    generatePDF: resultHandling.generatePDF,
    toggleRoutes: resultHandling.toggleRoutes,
    resetSearch
  };
};

export default useSearchPageStateManager;
