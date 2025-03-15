
import { useState, useEffect } from 'react';
import { useSearchState } from '@/hooks/useSearchState';
import { useSearchMenu } from '@/hooks/useSearchMenu';
import { useResultSelection } from '@/hooks/useResultSelection';
import { useSearchOperations } from '@/hooks/useSearchOperations';
import { useMapboxSearch } from '@/hooks/useMapboxSearch';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { toast } from 'sonner';

export const useSearchPanel = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const searchState = useSearchState();
  const searchMenu = useSearchMenu();
  const resultSelection = useResultSelection();
  
  // Use mapbox search
  const {
    query,
    setQuery,
    results,
    loading: searchLoading,
    search,
    resetSearch,
    searchHistory,
    savedSearches,
    saveSearch,
    removeSavedSearch
  } = useMapboxSearch({
    userLocation: searchState.userLocation,
    limit: searchState.resultsCount
  });

  // Voice recording handling
  const { handleMicClick } = useVoiceRecording({ 
    isRecording, 
    setIsRecording,
    onTextResult: (text) => {
      setQuery(text);
      handleSearchPress();
    }
  });

  // Use search operations
  const { handleSearchPress, handleSearch, activateGeolocation } = useSearchOperations({
    searchState,
    resultSelection
  });

  // Handle location button click
  const handleLocationClick = () => {
    activateGeolocation();
  };

  // Handle history item click
  const handleHistoryItemClick = (historyQuery: string) => {
    setQuery(historyQuery);
    setShowHistory(false);
    handleSearchPress();
  };

  // Handle save search
  const handleSaveSearch = (searchQuery: string) => {
    saveSearch(searchQuery);
    toast.success(`Recherche "${searchQuery}" sauvegardée`);
  };

  // Handle transport mode change
  const onTransportModeChange = (mode: string) => {
    searchState.setTransportMode(mode);
    // If we have active search results, update the routes
    if (searchState.searchPerformed) {
      handleSearch();
    }
  };

  // Update search results when query results change
  useEffect(() => {
    if (results.length > 0) {
      searchState.setSearchResults(results);
    }
  }, [results]);

  return {
    query,
    setQuery,
    searchLoading,
    isRecording,
    handleMicClick,
    handleLocationClick,
    showHistory,
    setShowHistory,
    searchHistory,
    savedSearches,
    handleHistoryItemClick,
    handleSaveSearch,
    removeSavedSearch,
    search,
    resetSearch,
    searchMenu,
    searchState,
    resultSelection,
    handleSearchPress,
    isLocationActive: searchState.isLocationActive,
    transportMode: searchState.transportMode,
    onTransportModeChange
  };
};

export default useSearchPanel;
