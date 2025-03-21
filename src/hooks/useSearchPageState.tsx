
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
  duration?: number;
  distance?: number;
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
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  
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
    }
  });

  const performSearch = useCallback(async (query: string = searchQuery) => {
    if (!query.trim()) {
      toast.error('Veuillez entrer une recherche');
      return;
    }

    setLoading(true);
    try {
      // Add to search history
      setSearchHistory(prev => [query, ...prev.filter(q => q !== query)].slice(0, 10));
      
      // Connect to Flask API for search
      const response = await fetch(`http://localhost:5000/search?query=${encodeURIComponent(query)}&mode=${transportMode}&lat=${userLocation[1]}&lon=${userLocation[0]}&limit=${resultsCount}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }
      
      const results = await response.json();
      console.log('API search results:', results);
      
      // Transform to Place objects
      const places = results.map((result: any, index: number) => ({
        id: `place-${index}`,
        name: result.name,
        lat: result.lat,
        lon: result.lon,
        duration: result.duration,
        distance: result.distance
      }));
      
      setPlaces(places);
      
      if (places.length === 0) {
        toast.info('Aucun résultat trouvé');
      } else {
        toast.success(`${places.length} résultats trouvés`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Erreur lors de la recherche. Vérifiez que le serveur Flask est en cours d\'exécution.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, transportMode, userLocation, resultsCount]);

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
  };

  const handleSaveSearch = (query: string) => {
    if (!savedSearches.includes(query)) {
      setSavedSearches(prev => [query, ...prev]);
      toast.success(`Recherche "${query}" sauvegardée`);
    }
  };

  const handleRemoveSavedSearch = (query: string) => {
    setSavedSearches(prev => prev.filter(q => q !== query));
    toast.success(`Recherche "${query}" supprimée`);
  };

  const generatePDF = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/generate_pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ places }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la génération du PDF');
      }
      
      const result = await response.json();
      toast.success('PDF généré avec succès');
      console.log('PDF result:', result);
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setLoading(false);
    }
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
    if (!MAPBOX_TOKEN) {
      toast.error('Token Mapbox manquant. La carte ne fonctionnera pas correctement.');
    } else {
      console.log('SearchPage loaded with Mapbox token available');
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
    handleMicClick,
    generatePDF
  };
};

export default useSearchPageState;
