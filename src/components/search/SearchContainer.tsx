
import React, { useState } from 'react';
import { RouteDisplayContainer } from './RouteDisplayContainer';
import SearchMenu from './SearchMenu';
import MapSection from './MapSection';
import { DistanceUnit } from '@/types/categoryTypes';
import { toast } from 'sonner';

interface SearchContainerProps {
  searchPanel?: any;
  routeDisplay?: any;
  searchApiCore?: any;
  searchState?: any;
}

export const SearchContainer: React.FC<SearchContainerProps> = (props) => {
  // Destructure props with default empty objects to prevent errors
  const {
    searchPanel = {},
    routeDisplay = {},
    searchApiCore = {},
    searchState = {}
  } = props;

  // Extract values from nested objects
  const query = searchPanel.query || '';
  const setQuery = searchPanel.setQuery || (() => {});
  const searchLoading = searchPanel.searchLoading || false;
  const isRecording = searchPanel.isRecording || false;
  const handleMicClick = searchPanel.handleMicClick || (() => {});
  const handleLocationClick = searchPanel.handleLocationClick || (() => {});
  const isLocationActive = searchPanel.isLocationActive || false;
  const transportMode = searchPanel.transportMode || 'driving';
  const onTransportModeChange = searchPanel.onTransportModeChange || (() => {});
  const searchMenu = searchPanel.searchMenu || { menuOpen: false, setMenuOpen: () => {} };
  
  // Use a safer way to check for userLocation
  const userLocation = searchState.userLocation || [0, 0];
  const selectedResultId = searchState.selectedResultId || '';
  const searchResults = searchState.searchResults || [];
  const loading = searchState.loading || false;
  const selectedCategory = searchState.selectedCategory || null;
  const showRoutes = searchState.showRoutes || false;
  
  // Default empty state for distanceUnit and settings
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>("km");
  const [selectedDistance, setSelectedDistance] = useState(5);
  const [selectedDuration, setSelectedDuration] = useState(15);
  
  // Default handlers for common actions
  const onCategorySelect = (categoryId: string | null) => {
    console.log(`Selected category: ${categoryId}`);
    // Add your category selection logic here
  };
  
  const handleSearch = () => {
    console.log('Performing search');
    // Add your search logic here
    toast.info('Recherche lancée');
  };

  return (
    <div className="relative w-full h-full">
      <MapSection
        userLocation={userLocation}
        selectedPlaceId={selectedResultId}
        places={searchResults}
        loading={loading}
        showRoutes={showRoutes}
        transportMode={transportMode}
        selectedCategory={selectedCategory}
        radiusType="distance"
        radius={5}
        distanceUnit={distanceUnit}
        onPlaceSelect={(id) => console.log('Selected place:', id)}
        onClosePopup={() => console.log('Closed popup')}
        showNoMapboxTokenWarning={false}
        onSetMapboxToken={(token) => {
          console.log('Set token:', token);
          return true;
        }}
      />

      {searchMenu.menuOpen && (
        <SearchMenu
          transportMode={transportMode}
          onTransportModeChange={onTransportModeChange}
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
          selectedDistance={selectedDistance}
          onDistanceChange={setSelectedDistance}
          selectedDuration={selectedDuration}
          onDurationChange={setSelectedDuration}
          distanceUnit={distanceUnit}
          onDistanceUnitChange={setDistanceUnit}
          resultsCount={searchResults.length}
          show={searchMenu.menuOpen}
          onClose={() => searchMenu.setMenuOpen(false)}
          filterMode="distance"
          onFilterModeChange={() => {}}
        />
      )}

      {showRoutes && selectedResultId && userLocation && (
        <RouteDisplayContainer
          origin={userLocation}
          destinations={[0, 0]} // Placeholder
          transportMode={transportMode}
        />
      )}
    </div>
  );
};

export default SearchContainer;
