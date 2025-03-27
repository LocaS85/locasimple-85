import React, { useRef, useState, useEffect } from 'react';
import type { Result } from '../ResultsList';
import RadiusCircle from './RadiusCircle';
import MapMarkers from './MapMarkers';
import { MapStyle } from './MapStyleSelector';
import MapControls from './MapControls';
import MapResults from './MapResults';
import useMapInitialization from '@/hooks/useMapInitialization';
import useMarkerManagement from '@/hooks/useMarkerManagement';
import { toast } from 'sonner';
import MapDisplay from '../search/MapDisplay';
import mapboxgl from 'mapbox-gl';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>('streets');
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
      onResultClick(place);
    }
  };

  // Call the onMapInitialized callback when map is set
  useEffect(() => {
    if (map && onMapInitialized) {
      onMapInitialized(map);
    }
  }, [map, onMapInitialized]);

  return (
    <div className="relative w-full h-full">
      <MapDisplay 
        viewport={viewport}
        setViewport={setViewport}
        places={results.map(r => ({
          id: r.id,
          name: r.name,
          lat: r.latitude,
          lon: r.longitude,
          address: r.address,
          category: r.category
        }))}
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
      <MapResults results={results} />
    </div>
  );
};

export default MapContainer;
