
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
    handleLocationClick,
    handleMenuClick,
    handleResultClick,
    resetSearch,
    handleMicClick
  };
};

export default useSearchPageState;
