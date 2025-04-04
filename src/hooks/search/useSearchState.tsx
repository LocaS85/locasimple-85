
import { useState } from 'react';

export interface Place {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  category?: string;
  duration?: number;
  distance?: number;
}

export const useSearchState = () => {
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
  
  // Map and results state
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [popupInfo, setPopupInfo] = useState<Place | null>(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return {
    places,
    setPlaces,
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
    searchResults,
    setSearchResults,
    selectedPlaceId,
    setSelectedPlaceId,
    popupInfo,
    setPopupInfo,
    showRoutes,
    setShowRoutes,
    searchPerformed,
    setSearchPerformed,
    selectedCategory,
    setSelectedCategory
  };
};

export default useSearchState;
