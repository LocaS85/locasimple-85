
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { MAPBOX_TOKEN } from '@/config/environment';
import { mapboxService, SearchResult } from '@/services/mapboxService';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

interface Place {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  category?: string;
}

export const useSearchPageState = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [resultsCount, setResultsCount] = useState<number>(5);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(15);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(5);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const [viewport, setViewport] = useState({
    latitude: 48.8566, // Paris par défaut
    longitude: 2.3522,
    zoom: 12
  });
  
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLocationActive, setIsLocationActive] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]);
  const [isRecording, setIsRecording] = useState(false);
  const [transportMode, setTransportMode] = useState('driving');
  const [showMenu, setShowMenu] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [popupInfo, setPopupInfo] = useState<Place | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Search history
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('search_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading search history:', e);
      return [];
    }
  });

  // Saved searches
  const [savedSearches, setSavedSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_searches');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading saved searches:', e);
      return [];
    }
  });

  // Use geolocation hook
  const { activateGeolocation } = useGeolocation({
    setLoading,
    setIsLocationActive,
    setUserLocation
  });

  // Use voice recording hook
  const { handleMicClick } = useVoiceRecording({
    isRecording,
    setIsRecording,
    onTextResult: (text) => {
      setSearchQuery(text);
      // Trigger search with the transcribed text
      performSearch(text);
    }
  });

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    console.log(`Searching for: ${query}`);
    
    try {
      if (MAPBOX_TOKEN) {
        // Use Mapbox search API
        const searchOptions = {
          query,
          limit: resultsCount,
          language: 'fr',
          types: ['poi', 'address', 'place'],
        };
        
        if (isLocationActive && userLocation) {
          searchOptions['proximity'] = userLocation;
        }
        
        const results = await mapboxService.searchPlaces(searchOptions);
        setSearchResults(results);
        
        // Transform to places format
        const newPlaces = results.map(result => ({
          id: result.id,
          name: result.place_name.split(',')[0],
          lat: result.center[1],
          lon: result.center[0],
          address: result.place_name,
          category: result.properties?.category || 'other'
        }));
        
        setPlaces(newPlaces);
        
        // Update search history
        if (query && (!searchHistory.length || searchHistory[0] !== query)) {
          const newHistory = [query, ...searchHistory.filter(s => s !== query)].slice(0, 10);
          setSearchHistory(newHistory);
          localStorage.setItem('search_history', JSON.stringify(newHistory));
        }
        
        toast.success(`${newPlaces.length} résultats trouvés pour "${query}"`);
      } else {
        // Simulate search if no Mapbox token
        simulateSearch(query);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Erreur lors de la recherche');
      simulateSearch(query);
    } finally {
      setLoading(false);
    }
  }, [resultsCount, isLocationActive, userLocation, searchHistory]);

  const simulateSearch = (query: string) => {
    // Simulate search delay
    setTimeout(() => {
      // Update places based on search query (simulated)
      const newPlaces = [
        { id: '1', name: `${query} A`, lat: 48.857, lon: 2.353 },
        { id: '2', name: `${query} B`, lat: 48.858, lon: 2.354 },
        { id: '3', name: `${query} C`, lat: 48.856, lon: 2.351 },
        { id: '4', name: `${query} D`, lat: 48.855, lon: 2.356 },
        { id: '5', name: `${query} E`, lat: 48.859, lon: 2.358 },
      ];
      
      setPlaces(newPlaces.slice(0, resultsCount));
      toast.success(`${resultsCount} résultats trouvés pour "${query}"`);
    }, 1000);
  };

  const handleLocationClick = () => {
    activateGeolocation();
    
    // If already active, toggle off
    if (isLocationActive) {
      setIsLocationActive(false);
    }
  };

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleResultClick = (place: Place) => {
    setSelectedPlaceId(place.id);
    setPopupInfo(place);
    
    // Center map on selected place
    setViewport({
      latitude: place.lat,
      longitude: place.lon,
      zoom: 14
    });
  };

  const resetSearch = () => {
    setSearchQuery('');
    setPlaces([]);
    setSearchResults([]);
    setPopupInfo(null);
  };

  const handleHistoryItemClick = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
    setShowHistory(false);
  };

  const handleSaveSearch = (query: string) => {
    if (!query || savedSearches.includes(query)) return;
    
    const newSavedSearches = [...savedSearches, query];
    setSavedSearches(newSavedSearches);
    localStorage.setItem('saved_searches', JSON.stringify(newSavedSearches));
    toast.success(`Recherche "${query}" sauvegardée`);
  };

  const handleRemoveSavedSearch = (query: string) => {
    const newSavedSearches = savedSearches.filter(s => s !== query);
    setSavedSearches(newSavedSearches);
    localStorage.setItem('saved_searches', JSON.stringify(newSavedSearches));
    toast.success(`Recherche "${query}" supprimée`);
  };

  // Update viewport when user location changes and is active
  useEffect(() => {
    if (isLocationActive && userLocation) {
      setViewport({
        latitude: userLocation[1],
        longitude: userLocation[0],
        zoom: 14
      });
    }
  }, [isLocationActive, userLocation]);

  // Update places based on resultsCount
  useEffect(() => {
    setPlaces(prev => prev.slice(0, resultsCount));
  }, [resultsCount]);

  // Check Mapbox token on component mount
  useEffect(() => {
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === '') {
      toast.error('Token Mapbox manquant. La carte ne fonctionnera pas correctement.');
    } else {
      console.log('SearchPage loaded with Mapbox token available');
      
      // Initial places
      simulateSearch('');
    }
  }, []);

  return {
    places,
    resultsCount,
    setResultsCount,
    selectedDuration,
    setSelectedDuration,
    selectedDistance,
    setSelectedDistance,
    distanceUnit,
    setDistanceUnit,
    viewport,
    setViewport,
    searchQuery,
    setSearchQuery,
    loading,
    isLocationActive,
    userLocation,
    isRecording,
    transportMode,
    setTransportMode,
    showMenu,
    selectedPlaceId,
    popupInfo,
    setPopupInfo,
    searchResults,
    showHistory,
    setShowHistory,
    searchHistory,
    savedSearches,
    performSearch,
    handleLocationClick,
    handleMenuClick,
    handleResultClick,
    resetSearch,
    handleHistoryItemClick,
    handleSaveSearch,
    handleRemoveSavedSearch,
    handleMicClick
  };
};

export default useSearchPageState;
