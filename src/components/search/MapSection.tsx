import React from 'react';
import MapContainer from '../map/MapContainer';
import InteractiveMenu from '@/components/InteractiveMenu';
import type { Result } from '@/components/ResultsList';

interface MapSectionProps {
  results: Result[];
  userLocation: [number, number];
  radius: number;
  radiusUnit: 'km' | 'miles';
  radiusType: 'distance' | 'duration';
  duration: number;
  timeUnit: 'minutes' | 'hours';
  transportMode: string;
  onFilterChange: (filters: {
    radius: number;
    unit: 'km' | 'miles';
    duration: number;
    timeUnit: 'minutes' | 'hours';
    resultsCount: number;
    transportMode: string;
    radiusType: 'distance' | 'duration';
  }) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  isRecording?: boolean;
  onMicClick?: () => void;
  onLocationClick?: () => void;
  isLocationActive?: boolean;
}

export const MapSection: React.FC<MapSectionProps> = ({
  results,
  userLocation,
  radius,
  radiusUnit,
  radiusType,
  duration,
  timeUnit,
  transportMode,
  onFilterChange,
  searchQuery = '',
  onSearchChange = () => {},
  isRecording = false,
  onMicClick = () => {},
  onLocationClick = () => {},
  isLocationActive = false
}) => {
  return (
    <div className="w-full h-full">
      <MapContainer
        results={results}
        center={userLocation}
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
      />
      <InteractiveMenu onFilterChange={onFilterChange} />
    </div>
  );
};

export default MapSection;
