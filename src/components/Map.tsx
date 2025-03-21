
import React, { useEffect } from 'react';
import type { Result } from './ResultsList';
import MapContainer from './map/MapContainer';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
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
}

const Map = ({ 
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
  selectedCategory,
  onCategorySelect = () => {},
  userLocation
}: MapProps) => {
  // Verify that we have a Mapbox token
  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      toast.error('Mapbox token manquant. Veuillez configurer votre token dans le fichier .env.');
      console.error('Mapbox token is missing or empty');
    } else {
      console.log('Map component initialized with Mapbox token');
    }
  }, []);

  return (
    <div className="w-full h-full">
      <MapContainer
        results={results}
        center={center}
        radius={radius}
        radiusUnit={radiusUnit}
        radiusType={radiusType}
        duration={duration}
        timeUnit={timeUnit}
        transportMode={transportMode}
        isRecording={isRecording}
        onMicClick={onMicClick}
        onLocationClick={onLocationClick}
        isLocationActive={isLocationActive}
        loading={loading}
        showRoutes={showRoutes}
        onSearch={onSearch}
        selectedResultId={selectedResultId}
        onResultClick={onResultClick}
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
        userLocation={userLocation}
      />
    </div>
  );
};

export default Map;
