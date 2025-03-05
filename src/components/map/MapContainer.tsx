
import React, { useRef, useState, useEffect } from 'react';
import { SearchInput } from '../search/SearchInput';
import type { Result } from '../ResultsList';
import RadiusCircle from './RadiusCircle';
import MapMarkers from './MapMarkers';
import { MapStyle } from './MapStyleSelector';
import MapControls from './MapControls';
import MapResults from './MapResults';
import useMapInitialization from '@/hooks/useMapInitialization';
import useMarkerManagement from '@/hooks/useMarkerManagement';
import { toast } from 'sonner';

interface MapContainerProps {
  results: Result[];
  center: [number, number];
  radius?: number;
  radiusUnit?: 'km' | 'miles';
  radiusType?: 'distance' | 'duration';
  duration?: number;
  timeUnit?: 'minutes' | 'hours';
  transportMode?: string;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
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
  searchQuery = '',
  onSearchChange = () => {},
  isRecording = false,
  onMicClick = () => {},
  onLocationClick = () => {},
  isLocationActive = false,
  loading = false,
  showRoutes = false,
  onSearch = () => {},
  selectedResultId,
  onResultClick,
  selectedCategory = null,
  onCategorySelect = () => {},
  userLocation
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>('streets');
  
  // Use custom hook for map initialization and management
  const { 
    map, 
    isMapInitialized,
    updateMapCenter,
    updateMapStyle
  } = useMapInitialization({
    container: mapContainer,
    center,
    mapStyle
  });
  
  // Use custom hook for marker management
  const { 
    centerMarker,
    updateMarkerPosition
  } = useMarkerManagement({
    map,
    center,
    isMapInitialized,
    isLocationActive
  });

  // Display the map initialization state for debugging
  useEffect(() => {
    console.log('Map initialized state:', isMapInitialized);
    if (!isMapInitialized && mapContainer.current) {
      console.log('Map container exists but map not initialized');
    }
  }, [isMapInitialized]);

  // Update map center and marker when coordinates change
  useEffect(() => {
    updateMapCenter(center);
    updateMarkerPosition(center, isLocationActive);
  }, [center, isLocationActive, updateMapCenter, updateMarkerPosition]);

  // Handle map style change
  const handleStyleChange = (newStyle: MapStyle) => {
    setMapStyle(newStyle);
    updateMapStyle(newStyle);
    toast.success(`Style de carte changé en ${newStyle}`);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" style={{ backgroundColor: '#e9eef2' }} />
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-auto">
        <SearchInput
          searchQuery={searchQuery}
          isRecording={isRecording}
          isLocationActive={isLocationActive}
          loading={loading}
          onSearchChange={onSearchChange}
          onMicClick={onMicClick}
          onLocationClick={onLocationClick}
          onSearch={onSearch}
          userLocation={userLocation}
        />
      </div>
      
      {/* Map Controls (Categories and Map Style) */}
      <MapControls
        mapStyle={mapStyle}
        onStyleChange={handleStyleChange}
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
      />
      
      {isMapInitialized && map && (
        <>
          <RadiusCircle
            map={map}
            center={center}
            radius={radius}
            radiusUnit={radiusUnit}
            radiusType={radiusType}
            duration={duration}
            timeUnit={timeUnit}
            transportMode={transportMode}
          />
          
          <MapMarkers
            map={map}
            results={results}
            center={center}
            transportMode={transportMode}
            showRoutes={showRoutes}
            selectedResultId={selectedResultId}
            onResultClick={onResultClick}
          />
        </>
      )}
      
      {/* Display message when map is not initialized */}
      {!isMapInitialized && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-600">
          <p>Chargement de la carte...</p>
        </div>
      )}
      
      {/* Results Counter */}
      <MapResults results={results} />
    </div>
  );
};

export default MapContainer;
