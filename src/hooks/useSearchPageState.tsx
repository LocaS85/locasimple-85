
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { MAPBOX_TOKEN } from '@/config/environment';
import { useSearchCore } from './useSearchCore';
import { useGeolocation } from './useGeolocation';
import { useVoiceRecording } from './useVoiceRecording';
import { Result } from '@/components/ResultsList';

export const useSearchPageState = () => {
  // Get core search functionality
  const searchCore = useSearchCore();
  
  // Additional UI state
  const [selectedDuration, setSelectedDuration] = useState<number | null>(15);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(5);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const [viewport, setViewport] = useState({
    latitude: 48.8566, // Paris par défaut
    longitude: 2.3522,
    zoom: 12
  });
  
  // UI interaction state
  const [isLocationActive, setIsLocationActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [showRoutes, setShowRoutes] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Use geolocation hook
  const { activateGeolocation } = useGeolocation({
    setLoading: searchCore.setLoading,
    setIsLocationActive,
    setUserLocation: searchCore.setUserLocation
  });

  // Use voice recording hook
  const { handleMicClick } = useVoiceRecording({
    isRecording,
    setIsRecording,
    onTextResult: (text) => {
      searchCore.setSearchQuery(text);
    }
  });

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    searchCore.setSearchQuery(value);
  };

  // Handle location button click
  const handleLocationClick = () => {
    activateGeolocation();
    
    // If already active, toggle off
    if (isLocationActive) {
      setIsLocationActive(false);
    }
  };

  // Handle menu toggle
  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  // Handle result click
  const handleResultClick = (place: any) => {
    setSelectedPlaceId(place.id);
    setPopupInfo(place);
    
    // Center map on selected place
    setViewport({
      latitude: place.lat,
      longitude: place.lon,
      zoom: 14
    });
  };

  // Reset search
  const resetSearch = () => {
    searchCore.setSearchQuery('');
    searchCore.setPlaces([]);
    setSearchResults([]);
    setPopupInfo(null);
    setSelectedPlaceId(null);
    setShowRoutes(false);
    searchCore.setSearchPerformed(false);
  };

  // Handle history item click
  const handleHistoryItemClick = (query: string) => {
    searchCore.setSearchQuery(query);
    searchCore.performSearch(query);
  };

  // Handle save search
  const handleSaveSearch = (query: string) => {
    if (!savedSearches.includes(query)) {
      setSavedSearches(prev => [query, ...prev]);
      toast.success(`Recherche "${query}" sauvegardée`);
    }
  };

  // Handle remove saved search
  const handleRemoveSavedSearch = (query: string) => {
    setSavedSearches(prev => prev.filter(q => q !== query));
    toast.success(`Recherche "${query}" supprimée`);
  };

  // Update our results state when core places change
  useEffect(() => {
    setSearchResults(searchCore.places);
  }, [searchCore.places]);

  // Update viewport when user location changes and is active
  useEffect(() => {
    if (isLocationActive && searchCore.userLocation) {
      setViewport({
        latitude: searchCore.userLocation[1],
        longitude: searchCore.userLocation[0],
        zoom: 14
      });
    }
  }, [isLocationActive, searchCore.userLocation]);

  // Check Mapbox token on component mount
  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      toast.error('Token Mapbox manquant. La carte ne fonctionnera pas correctement.');
    } else {
      console.log('SearchPage loaded with Mapbox token available');
    }
  }, []);

  // Add searched term to history
  useEffect(() => {
    if (searchCore.searchPerformed && searchCore.searchQuery) {
      setSearchHistory(prev => 
        [searchCore.searchQuery, ...prev.filter(q => q !== searchCore.searchQuery)].slice(0, 10)
      );
    }
  }, [searchCore.searchPerformed, searchCore.searchQuery]);

  // Wrap search execution to handle history and UI updates
  const executeSearch = useCallback(() => {
    searchCore.performSearch();
    setShowRoutes(true);
  }, [searchCore]);

  return {
    ...searchCore,
    selectedDuration,
    setSelectedDuration,
    selectedDistance,
    setSelectedDistance,
    distanceUnit,
    setDistanceUnit,
    viewport,
    setViewport,
    isLocationActive,
    isRecording,
    showMenu,
    selectedPlaceId,
    popupInfo,
    setPopupInfo,
    searchResults,
    showHistory,
    setShowHistory,
    searchHistory,
    savedSearches,
    showRoutes,
    setShowRoutes,
    handleSearchChange,
    handleLocationClick,
    handleMenuClick,
    handleResultClick,
    resetSearch,
    handleHistoryItemClick,
    handleSaveSearch,
    handleRemoveSavedSearch,
    handleMicClick,
    executeSearch,
    selectedCategory,
    setSelectedCategory
  };
};

export default useSearchPageState;
