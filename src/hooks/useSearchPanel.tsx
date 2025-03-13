
import { useState, useEffect } from 'react';
import { useSearchState } from '@/hooks/useSearchState';
import { useSearchMenu } from '@/hooks/useSearchMenu';
import { useResultSelection } from '@/hooks/useResultSelection';
import { useSearchOperations } from '@/hooks/useSearchOperations';
import { useSearchLocation } from './SearchLocation';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useMapboxSearch } from '@/hooks/useMapboxSearch';
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
      search(text);
    }
  });
  
  // Location handling
  const { handleLocationClick, searchAddress } = useSearchLocation(
    searchState.isLocationActive,
    searchLoading || searchState.loading,
    searchState.setLoading,
    searchState.setIsLocationActive,
    searchState.setUserLocation
  );
  
  // Search operations
  const { handleSearchPress } = useSearchOperations({
    searchState,
    locationOperations: { handleLocationClick, searchAddress },
    resultSelection
  });

  // History item handling
  const handleHistoryItemClick = (query: string) => {
    setQuery(query);
    search(query);
    setShowHistory(false);
  };

  const handleSaveSearch = (query: string) => {
    saveSearch(query);
    toast.success(`Recherche "${query}" sauvegardée`);
  };

  // Fill search results when mapbox results change
  useEffect(() => {
    if (results.length > 0) {
      const formattedResults = results.map(result => ({
        id: result.id,
        name: result.place_name.split(',')[0],
        address: result.place_name,
        distance: 0,
        duration: 0,
        category: result.properties?.category || 'other',
        color: 'blue',
        latitude: result.center[1],
        longitude: result.center[0],
        description: result.properties?.description || '',
      }));
      
      searchState.setSearchResults(formattedResults);
      searchState.setSearchPerformed(true);
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
    handleSearchPress
  };
};
