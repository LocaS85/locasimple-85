
import { useState } from 'react';

export const useSearchPageState = () => {
  // Basic state
  const [searchQuery, setSearchQuery] = useState('');
  const [resultsCount, setResultsCount] = useState(3);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [transportMode, setTransportMode] = useState('driving');
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]); // Paris by default
  const [isLocationActive, setIsLocationActive] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 12
  });
  const [showRoutes, setShowRoutes] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNoMapboxTokenWarning, setShowNoMapboxTokenWarning] = useState(false);

  return {
    // State values
    searchQuery,
    setSearchQuery,
    resultsCount,
    setResultsCount,
    searchResults,
    setSearchResults,
    loading,
    setLoading,
    transportMode,
    setTransportMode,
    userLocation,
    setUserLocation,
    isLocationActive, 
    setIsLocationActive,
    selectedPlaceId,
    setSelectedPlaceId,
    popupInfo,
    setPopupInfo,
    viewport,
    setViewport,
    showRoutes,
    setShowRoutes,
    selectedCategory,
    setSelectedCategory,
    showNoMapboxTokenWarning,
    setShowNoMapboxTokenWarning
  };
};

export default useSearchPageState;
