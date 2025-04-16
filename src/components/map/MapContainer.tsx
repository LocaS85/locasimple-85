
import React, { useRef, useState, useEffect } from 'react';
import type { Result } from '../ResultsList';
import MapDisplay from '../map/MapDisplay';
import { MAPBOX_TOKEN } from '@/config/environment';
import mapboxgl from 'mapbox-gl';

// Set the mapboxgl access token globally at the module level
if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

interface MapContainerProps {
  results: Result[];
  center: [number, number];
  radius?: number;
  radiusUnit?: 'km' | 'miles';
  radiusType?: 'distance' | 'duration';
  duration?: number;
  timeUnit?: 'minutes' | 'hours';
  transportMode?: string;
  isRecording?: boolean;
  onMicClick?: () => void;
  onLocationClick?: () => void;
  isLocationActive?: boolean;
  loading?: boolean;
  showRoutes?: boolean;
  onSearch?: () => void;
  selectedResultId?: string;
  onResultClick?: (result: Result) => void;
  selectedCategory?: string | null;
  onCategorySelect?: (categoryId: string | null) => void;
  userLocation?: [number, number];
  onMapInitialized?: (map: mapboxgl.Map) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ 
  results, 
  center, 
  radius = 5, 
  radiusUnit = 'km', 
  radiusType = 'distance',
  duration = 15,
  timeUnit = 'minutes',
  transportMode = 'driving',
  isRecording = false,
  onMicClick = () => {},
  onLocationClick = () => {},
  isLocationActive = false,
  loading = false,
  showRoutes = false,
  onSearch = () => {},
  selectedResultId,
  onResultClick = () => {},
  selectedCategory = null,
  onCategorySelect = () => {},
  userLocation,
  onMapInitialized
}) => {
  const [viewport, setViewport] = useState({
    latitude: center[1],
    longitude: center[0],
    zoom: 13
  });
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  
  // Update viewport when center changes
  useEffect(() => {
    setViewport(prev => ({
      ...prev,
      latitude: center[1],
      longitude: center[0]
    }));
  }, [center]);

  // Handle marker click
  const handleMarkerClick = (place: any) => {
    setPopupInfo(place);
    if (onResultClick) {
      // Convert place to Result type for consistency
      const resultPlace: Result = {
        id: place.id,
        name: place.name,
        latitude: place.lat,
        longitude: place.lon,
        address: place.address,
        category: place.category,
        distance: place.distance || 0,
        duration: place.duration || 0,
        color: place.color || ''  // Add any other required properties with defaults
      };
      onResultClick(resultPlace);
    }
  };

  // Call the onMapInitialized callback when map is set
  useEffect(() => {
    if (map && onMapInitialized) {
      onMapInitialized(map);
    }
  }, [map, onMapInitialized]);

  // Map Result type to the format expected by MapDisplay
  const placesForMapDisplay = results.map(result => ({
    id: result.id,
    name: result.name,
    lat: result.latitude,
    lon: result.longitude,
    address: result.address,
    category: result.category,
    distance: result.distance,
    duration: result.duration,
    color: result.color || ''
  }));

  return (
    <div className="relative w-full h-full">
      <MapDisplay 
        viewport={viewport}
        setViewport={setViewport}
        places={placesForMapDisplay}
        resultsCount={results.length}
        selectedPlaceId={selectedResultId || null}
        popupInfo={popupInfo}
        setPopupInfo={setPopupInfo}
        handleResultClick={handleMarkerClick}
        isLocationActive={isLocationActive}
        userLocation={userLocation}
        loading={loading}
        handleLocationClick={onLocationClick || (() => {})}
        transportMode={transportMode || 'driving'}
        setMap={setMap}
      />
      
      {/* Map Results */}
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-2 text-center text-sm">
        {results.length > 0 ? 
          `${results.length} résultats trouvés` : 
          loading ? 'Recherche en cours...' : 'Aucun résultat'
        }
      </div>
    </div>
  );
};

export default MapContainer;
