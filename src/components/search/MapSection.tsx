
import React, { useState } from 'react';
import MapContainer from '@/components/map/MapContainer';
import type { Result } from '@/components/ResultsList';
import { useSearchMenu } from '@/hooks/useSearchMenu';
import HistoryPanel from '@/components/search/HistoryPanel';
import useRoutes from '@/hooks/useRoutes';
import mapboxgl from 'mapbox-gl';

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
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  // Initialize map reference when MapContainer sets it
  const handleMapInitialized = (mapInstance: mapboxgl.Map) => {
    setMap(mapInstance);
  };

  // Use the routes hook to manage route display
  useRoutes({
    map,
    showRoutes,
    results,
    center,
    transportMode,
    selectedResultId
  });

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
        onMapInitialized={handleMapInitialized}
      />
      
      {/* History Panel */}
      <HistoryPanel
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        searchHistory={searchHistory}
        savedSearches={savedSearches}
        onHistoryItemClick={onHistoryItemClick}
        onSaveSearch={onSaveSearch}
        onRemoveSavedSearch={onRemoveSavedSearch}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default MapSection;
