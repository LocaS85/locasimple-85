
import React from 'react';
import { RouteDisplayContainer } from './RouteDisplayContainer';
import { useSearchPanel } from '@/hooks/useSearchPanel';
import { useRouteDisplay } from '@/hooks/useRouteDisplay';
import MapSection from './MapSection';
import SearchMenu from './SearchMenu';

export const SearchContainer: React.FC = () => {
  const {
    query,
    setQuery,
    searchLoading,
    isRecording,
    handleMicClick,
    handleLocationClick,
    showHistory,
    setShowHistory,
    searchHistory,
    savedSearches,
    handleHistoryItemClick,
    handleSaveSearch,
    removeSavedSearch,
    search,
    resetSearch,
    searchMenu,
    searchState,
    resultSelection,
    handleSearchPress,
    isLocationActive,
    transportMode,
    onTransportModeChange
  } = useSearchPanel();

  // Use route display hook
  const { from, to, routes, activeMode, setActiveMode } = useRouteDisplay({
    userLocation: searchState.userLocation,
    searchResults: searchState.searchResults,
    selectedResultId: resultSelection.selectedResultId,
    transportMode: searchState.transportMode
  });

  return (
    <div className="relative w-full h-full">
      {/* Map and Search Components */}
      <MapSection
        results={searchState.searchResults}
        center={searchState.userLocation}
        radius={searchState.selectedDistance || 5}
        radiusUnit={searchState.distanceUnit}
        radiusType="distance"
        duration={searchState.selectedDuration || 15}
        timeUnit="minutes"
        transportMode={searchState.transportMode}
        searchQuery={query}
        onSearchChange={setQuery}
        isRecording={isRecording}
        onMicClick={handleMicClick}
        onLocationClick={handleLocationClick}
        isLocationActive={isLocationActive}
        loading={searchState.loading || searchLoading}
        showRoutes={searchState.showRoutes}
        onSearch={handleSearchPress}
        selectedResultId={resultSelection.selectedResultId}
        onResultClick={(result) => resultSelection.setSelectedResultId(result.id)}
        selectedCategory={searchState.selectedCategory}
        onCategorySelect={searchState.setSelectedCategory}
        searchHistory={searchHistory}
        savedSearches={savedSearches}
        onHistoryItemClick={handleHistoryItemClick}
        onSaveSearch={handleSaveSearch}
        onRemoveSavedSearch={removeSavedSearch}
        resetSearch={resetSearch}
        onTransportModeChange={onTransportModeChange}
        userLocation={searchState.userLocation}
      />

      {/* Bottom slide-up menu */}
      <SearchMenu
        show={searchMenu.menuOpen}
        onClose={() => searchMenu.setMenuOpen(false)}
        selectedDuration={searchState.selectedDuration}
        selectedDistance={searchState.selectedDistance}
        distanceUnit={searchState.distanceUnit}
        transportMode={searchState.transportMode}
        resultsCount={searchState.resultsCount}
        selectedCategory={searchState.selectedCategory}
        onCategorySelect={searchState.setSelectedCategory}
        onResultsCountChange={searchState.setResultsCount}
        onTransportModeChange={searchState.setTransportMode}
        onDurationChange={searchState.setSelectedDuration}
        onDistanceChange={searchState.setSelectedDistance}
        onDistanceUnitChange={searchState.setDistanceUnit}
        results={searchState.searchResults}
        onResultClick={(result) => resultSelection.setSelectedResultId(result.id)}
        selectedResultId={resultSelection.selectedResultId}
        searchHistory={searchHistory}
        savedSearches={savedSearches}
        onHistoryItemClick={handleHistoryItemClick}
        onSaveSearch={handleSaveSearch}
        onRemoveSavedSearch={removeSavedSearch}
        searchQuery={query}
        onReset={resetSearch}
      />

      {/* Route display when a result is selected */}
      <RouteDisplayContainer
        selectedResultId={resultSelection.selectedResultId}
        from={from}
        to={to}
        routes={routes}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        setTransportMode={searchState.setTransportMode}
      />
    </div>
  );
};

export default SearchContainer;
