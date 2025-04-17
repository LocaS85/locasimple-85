
import React, { useState } from 'react';
import MapContainer from '@/components/map/MapContainer';
import type { Result } from '@/components/ResultsList';
import { useSearchMenu } from '@/hooks/useSearchMenu';
import HistoryPanel from '@/components/search/HistoryPanel';
import useRoutes from '@/hooks/useRoutes';
import mapboxgl from 'mapbox-gl';
import { getTransportModeIcon } from '@/data/transportModesWithColors';

interface MapSectionProps {
  results: Result[];
  center: [number, number];
  radius: number;
  radiusUnit: 'km' | 'mi';
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

  // Handle zoom controls
  const handleZoomIn = () => {
    if (map) map.zoomIn();
  };

  const handleZoomOut = () => {
    if (map) map.zoomOut();
  };

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
      
      {/* Custom Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button 
          onClick={handleZoomIn}
          className="map-control w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
          aria-label="Zoom in"
        >
          +
        </button>
        <button 
          onClick={handleZoomOut}
          className="map-control w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
          aria-label="Zoom out"
        >
          −
        </button>
      </div>
      
      <div className="absolute bottom-4 right-4 z-10">
        <button 
          onClick={onLocationClick}
          className={`map-control w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md ${isLocationActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
          aria-label="My location"
        >
          📍
        </button>
      </div>
      
      {/* Transport Mode Indicator */}
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-full shadow-md px-3 py-2 flex items-center gap-2">
        <span className="text-sm font-medium">{getTransportModeIcon(transportMode as any)} Mode</span>
      </div>
      
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
