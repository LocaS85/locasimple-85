
import React from 'react';
import Map from '@/components/Map';
import type { Result } from '@/components/ResultsList';

interface SearchControlsProps {
  searchResults: Result[];
  userLocation: [number, number];
  selectedDistance: number | null;
  selectedDuration: number | null;
  distanceUnit: 'km' | 'miles';
  transportMode: string;
  searchQuery: string;
  isRecording: boolean;
  isLocationActive: boolean;
  loading: boolean;
  onSearchChange: (query: string) => void;
  onMicClick: () => void;
  onLocationClick: () => void;
  handleSearch: (query?: string) => void;
  showRoutes?: boolean;
}

export const SearchControls: React.FC<SearchControlsProps> = ({
  searchResults,
  userLocation,
  selectedDistance,
  selectedDuration,
  distanceUnit,
  transportMode,
  searchQuery,
  isRecording,
  isLocationActive,
  loading,
  onSearchChange,
  onMicClick,
  onLocationClick,
  handleSearch,
  showRoutes = false,
}) => {
  return (
    <div className="absolute inset-0">
      <Map 
        results={searchResults} 
        center={userLocation}
        radius={selectedDistance || 5}
        radiusUnit={distanceUnit}
        radiusType={selectedDuration ? 'duration' : 'distance'}
        duration={selectedDuration || 15}
        timeUnit="minutes"
        transportMode={transportMode}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        isRecording={isRecording}
        onMicClick={onMicClick}
        onLocationClick={onLocationClick}
        isLocationActive={isLocationActive}
        loading={loading}
        showRoutes={showRoutes}
        onSearch={() => handleSearch()}
      />
    </div>
  );
};
