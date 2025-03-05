
import React from 'react';
import { SearchControls } from './SearchControls';
import { SearchMenu } from './SearchMenu';
import { SearchButton } from './SearchButton';
import { LocationButton } from './LocationButton';
import { useSearchLocation } from './SearchLocation';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useSearchState } from '@/hooks/useSearchState';
import { useSearchMenu } from '@/hooks/useSearchMenu';
import { useResultSelection } from '@/hooks/useResultSelection';
import { useSearchOperations } from '@/hooks/useSearchOperations';

export const SearchContainer = () => {
  const [isRecording, setIsRecording] = React.useState(false);
  
  const searchState = useSearchState();
  const searchMenu = useSearchMenu();
  const resultSelection = useResultSelection();
  
  const { handleMicClick } = useVoiceRecording({ 
    isRecording, 
    setIsRecording 
  });
  
  const { handleLocationClick, searchAddress } = useSearchLocation(
    searchState.isLocationActive,
    searchState.loading,
    searchState.setLoading,
    searchState.setIsLocationActive,
    searchState.setUserLocation
  );
  
  const { handleSearchPress } = useSearchOperations({
    searchState,
    locationOperations: { handleLocationClick, searchAddress },
    resultSelection
  });

  return (
    <div className="relative h-full">
      <div className="absolute inset-0" onClick={searchMenu.handleMapInteraction}>
        <SearchControls
          searchResults={searchState.searchResults}
          userLocation={searchState.userLocation}
          selectedDistance={searchState.selectedDistance}
          selectedDuration={searchState.selectedDuration}
          distanceUnit={searchState.distanceUnit}
          transportMode={searchState.transportMode}
          searchQuery={searchState.searchQuery}
          isRecording={isRecording}
          isLocationActive={searchState.isLocationActive}
          loading={searchState.loading}
          onSearchChange={searchState.handleSearchChange}
          onMicClick={handleMicClick}
          onLocationClick={handleLocationClick}
          handleSearch={handleSearchPress}
          showRoutes={searchState.showRoutes}
          selectedResultId={resultSelection.selectedResultId}
          onResultClick={resultSelection.handleResultClick}
          selectedCategory={searchState.selectedCategory}
          onCategorySelect={searchState.setSelectedCategory}
        />
      </div>
      
      <LocationButton 
        loading={searchState.loading}
        isLocationActive={searchState.isLocationActive}
        onClick={handleLocationClick}
      />
      
      <SearchButton 
        loading={searchState.loading}
        onClick={handleSearchPress}
      />
      
      <SearchMenu 
        menuOpen={searchMenu.menuOpen}
        setMenuOpen={searchMenu.setMenuOpen}
        menuRef={searchMenu.menuRef}
        handleTouchStart={searchMenu.handleTouchStart}
        handleTouchMove={searchMenu.handleTouchMove}
        handleTouchEnd={searchMenu.handleTouchEnd}
        selectedDuration={searchState.selectedDuration}
        selectedDistance={searchState.selectedDistance}
        distanceUnit={searchState.distanceUnit}
        transportMode={searchState.transportMode}
        resultsCount={searchState.resultsCount}
        onResultsCountChange={searchState.setResultsCount}
        onTransportModeChange={searchState.setTransportMode}
        onDurationChange={searchState.setSelectedDuration}
        onDistanceChange={searchState.setSelectedDistance}
        onDistanceUnitChange={searchState.setDistanceUnit}
        selectedCategory={searchState.selectedCategory}
        onCategorySelect={searchState.setSelectedCategory}
        searchResults={searchState.searchResults}
        selectedResultId={resultSelection.selectedResultId}
        onResultClick={resultSelection.handleResultClick}
        onSearch={handleSearchPress}
      />
    </div>
  );
};

export default SearchContainer;
