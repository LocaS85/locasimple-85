
import React from 'react';
import MapContainer from '@/components/map/MapContainer';
import type { Result } from '@/components/ResultsList';

interface MapSectionProps {
  results: Result[];
  center: [number, number];
  radius: number;
  radiusUnit: 'km' | 'miles';
  radiusType: 'distance' | 'duration';
  duration: number;
  timeUnit: 'minutes' | 'hours';
  transportMode: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isRecording: boolean;
  onMicClick: () => void;
  onLocationClick: () => void;
  isLocationActive: boolean;
  loading: boolean;
  showRoutes: boolean;
  onSearch: () => void;
  selectedResultId?: string;
  onResultClick: (result: Result) => void;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export const MapSection: React.FC<MapSectionProps> = ({
  results,
  center,
  radius,
  radiusUnit,
  radiusType,
  duration,
  timeUnit,
  transportMode,
  searchQuery,
  onSearchChange,
  isRecording,
  onMicClick,
  onLocationClick,
  isLocationActive,
  loading,
  showRoutes,
  onSearch,
  selectedResultId,
  onResultClick,
  selectedCategory,
  onCategorySelect
}) => {
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
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
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
      />
    </div>
  );
};
