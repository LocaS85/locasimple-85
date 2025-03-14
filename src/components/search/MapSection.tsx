
import React, { useState } from 'react';
import MapContainer from '@/components/map/MapContainer';
import type { Result } from '@/components/ResultsList';
import { SearchPanel } from './SearchPanel';
import { useSearchMenu } from '@/hooks/useSearchMenu';

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
  searchHistory: string[];
  savedSearches: string[];
  onHistoryItemClick: (query: string) => void;
  onSaveSearch: (query: string) => void;
  onRemoveSavedSearch: (query: string) => void;
  resetSearch: () => void;
  onTransportModeChange: (mode: string) => void;
  userLocation?: [number, number];
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
  onCategorySelect,
  searchHistory,
  savedSearches,
  onHistoryItemClick,
  onSaveSearch,
  onRemoveSavedSearch,
  resetSearch,
  onTransportModeChange,
  userLocation
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const { menuOpen, setMenuOpen, toggleMenu } = useSearchMenu();

  return (
    <div className="w-full h-full relative">
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
        userLocation={userLocation}
      />
      
      <SearchPanel
        query={searchQuery}
        setQuery={onSearchChange}
        search={(query) => {
          onSearchChange(query);
          onSearch();
        }}
        onResultSelect={onResultClick}
        resetSearch={resetSearch}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        searchHistory={searchHistory}
        savedSearches={savedSearches}
        onHistoryItemClick={onHistoryItemClick}
        onSaveSearch={onSaveSearch}
        onRemoveSavedSearch={onRemoveSavedSearch}
        userLocation={userLocation}
        isRecording={isRecording}
        onMicClick={onMicClick}
        isLocationActive={isLocationActive}
        onLocationClick={onLocationClick}
        loading={loading}
        transportMode={transportMode}
        onTransportModeChange={onTransportModeChange}
        onMenuClick={toggleMenu}
      />
    </div>
  );
};

export default MapSection;
