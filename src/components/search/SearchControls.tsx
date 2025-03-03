
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
  onSearchChange: (query: string) => void;
  onMicClick: () => void;
  onLocationClick: () => void;
  handleSearch: (query: string) => void;
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
  onSearchChange,
  onMicClick,
  onLocationClick,
  handleSearch,
}) => {
  const handleSearchChange = (query: string) => {
    onSearchChange(query);
    handleSearch(query);
  };

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
        onSearchChange={handleSearchChange}
        isRecording={isRecording}
        onMicClick={onMicClick}
        onLocationClick={onLocationClick}
        isLocationActive={isLocationActive}
      />
    </div>
  );
};
