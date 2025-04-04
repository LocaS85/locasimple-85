
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MAPBOX_TOKEN } from '@/config/environment';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useSearchState, Place } from './search/useSearchState';
import { useSearchInputState } from './search/useSearchInputState';
import { useSearchHistoryState } from './search/useSearchHistoryState';
import { useSearchOperations } from './search/useSearchOperations';
import { useMapViewport } from './search/useMapViewport';

export const useSearchPageState = () => {
  // Use smaller hooks for state management
  const searchState = useSearchState();
  const inputState = useSearchInputState();
  const historyState = useSearchHistoryState();
  
  // Use geolocation hook
  const { activateGeolocation } = useGeolocation({
    setLoading: inputState.setLoading,
    setIsLocationActive: inputState.setIsLocationActive,
    setUserLocation: inputState.setUserLocation
  });

  // Use voice recording hook
  const { handleMicClick } = useVoiceRecording({
    isRecording: inputState.isRecording,
    setIsRecording: inputState.setIsRecording,
    onTextResult: (text) => {
      inputState.setSearchQuery(text);
    }
  });
  
  // Search operations hook
  const operations = useSearchOperations(
    inputState.searchQuery,
    inputState.transportMode,
    inputState.userLocation,
    searchState.resultsCount,
    inputState.isLocationActive,
    inputState.setLoading,
    searchState.setPlaces,
    historyState.setSearchHistory,
    searchState.setSelectedPlaceId
  );
  
  // Pass data to operations hook
  operations._setData(searchState.places);
  
  // Connect history functions
  historyState._setFunctions(
    inputState.setSearchQuery,
    operations.performSearch
  );
  
  // Use map viewport hook
  useMapViewport(
    inputState.isLocationActive,
    inputState.userLocation,
    searchState.setViewport
  );

  // Handle location button click
  const handleLocationClick = () => {
    activateGeolocation();
    
    // If already active, toggle off
    if (inputState.isLocationActive) {
      inputState.setIsLocationActive(false);
    }
  };

  // Handle menu button click
  const handleMenuClick = () => {
    inputState.setShowMenu(!inputState.showMenu);
  };

  // Handle result click
  const handleResultClick = (place: Place) => {
    searchState.setSelectedPlaceId(place.id);
    searchState.setPopupInfo(place);
    
    // Center map on selected place
    searchState.setViewport({
      latitude: place.lat,
      longitude: place.lon,
      zoom: 14
    });
  };

  // Reset search
  const resetSearch = () => {
    inputState.setSearchQuery('');
    searchState.setPlaces([]);
    searchState.setSearchResults([]);
    searchState.setPopupInfo(null);
  };

  // Update places based on resultsCount
  useEffect(() => {
    searchState.setPlaces(prev => prev.slice(0, searchState.resultsCount));
  }, [searchState.resultsCount]);

  // Check Mapbox token on component mount
  useEffect(() => {
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === '') {
      toast.error('Token Mapbox manquant. La carte ne fonctionnera pas correctement.');
    } else {
      console.log('SearchPage loaded with Mapbox token available');
    }
  }, []);

  return {
    // Return all properties and methods from all hooks
    ...searchState,
    searchQuery: inputState.searchQuery,
    setSearchQuery: inputState.setSearchQuery,
    loading: inputState.loading,
    isLocationActive: inputState.isLocationActive,
    userLocation: inputState.userLocation,
    isRecording: inputState.isRecording,
    transportMode: inputState.transportMode,
    setTransportMode: inputState.setTransportMode,
    showMenu: inputState.showMenu,
    ...historyState,
    performSearch: operations.performSearch,
    handleLocationClick,
    handleMenuClick,
    handleResultClick,
    resetSearch,
    handleMicClick,
    generatePDF: operations.generatePDF
  };
};

export default useSearchPageState;
