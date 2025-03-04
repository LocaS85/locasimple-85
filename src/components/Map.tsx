
import React from 'react';
import type { Result } from './ResultsList';
import MapContainer from './map/MapContainer';

interface MapProps {
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
  searchQuery = '',
  onSearchChange = () => {},
  isRecording = false,
  onMicClick = () => {},
  onLocationClick = () => {},
  isLocationActive = false,
  loading = false
}: MapProps) => {
  // Pass all props directly to MapContainer
  return (
    <MapContainer
      results={results}
      center={center}
      radius={radius}
      radiusUnit={radiusUnit}
      radiusType={radiusType}
      duration={duration}
      timeUnit={timeUnit}
      transportMode={transportMode}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      isRecording={isRecording}
      onMicClick={onMicClick}
      onLocationClick={onLocationClick}
      isLocationActive={isLocationActive}
      loading={loading}
    />
  );
};

export default Map;
