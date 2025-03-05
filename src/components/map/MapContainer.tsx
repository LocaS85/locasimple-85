
import React, { useRef, useState, useEffect } from 'react';
import { SearchInput } from '../search/SearchInput';
import type { Result } from '../ResultsList';
import RadiusCircle from './RadiusCircle';
import MapMarkers from './MapMarkers';
import { MapStyle } from './MapStyleSelector';
import MapControls from './MapControls';
import MapResults from './MapResults';
import useMapInitialization from '@/hooks/useMapInitialization';

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
  onCategorySelect = () => {}
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

  // Update map center when coordinates change
  useEffect(() => {
    updateMapCenter(center, isLocationActive);
  }, [center, isLocationActive, updateMapCenter]);

  // Handle map style change
  const handleStyleChange = (newStyle: MapStyle) => {
    setMapStyle(newStyle);
    updateMapStyle(newStyle);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      
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
      
      {/* Results Counter */}
      <MapResults results={results} />
    </div>
  );
};

export default MapContainer;
