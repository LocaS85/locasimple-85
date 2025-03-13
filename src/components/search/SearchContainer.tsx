
import React from 'react';
import { SearchControls } from './SearchControls';
import { SearchMenu } from './SearchMenu';
import { LocationButton } from './LocationButton';
import { SearchButton } from './SearchButton';
import { useSearchPanel } from '@/hooks/useSearchPanel';
import { useRouteDisplay } from '@/hooks/useRouteDisplay';
import SearchPanel from './SearchPanel';
import RouteDisplayContainer from './RouteDisplayContainer';
import { TransportMode } from '@/hooks/useMapboxRoutes';

export const SearchContainer = () => {
  // Use our custom hooks to manage search and routes
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
    handleSearchPress
  } = useSearchPanel();

  // Use route display hook
  const {
    from,
    to,
    routes,
    activeMode,
    setActiveMode
  } = useRouteDisplay({
    userLocation: searchState.userLocation,
    searchResults: searchState.searchResults,
    selectedResultId: resultSelection.selectedResultId,
    transportMode: searchState.transportMode
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
          searchQuery={query}
          isRecording={isRecording}
          isLocationActive={searchState.isLocationActive}
          loading={searchState.loading || searchLoading}
          onSearchChange={setQuery}
          onMicClick={handleMicClick}
          onLocationClick={handleLocationClick}
          handleSearch={() => search(query)}
          showRoutes={searchState.showRoutes}
          selectedResultId={resultSelection.selectedResultId}
          onResultClick={resultSelection.handleResultClick}
          selectedCategory={searchState.selectedCategory}
          onCategorySelect={searchState.setSelectedCategory}
        />
      </div>
      
      {/* Search panel */}
      <SearchPanel
        query={query}
        setQuery={setQuery}
        search={search}
        onResultSelect={resultSelection.handleResultClick}
        resetSearch={resetSearch}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        searchHistory={searchHistory}
        savedSearches={savedSearches}
        onHistoryItemClick={handleHistoryItemClick}
        onSaveSearch={handleSaveSearch}
        onRemoveSavedSearch={removeSavedSearch}
        userLocation={searchState.userLocation}
      />
      
      {/* Location button */}
      <LocationButton 
        loading={searchState.loading}
        isLocationActive={searchState.isLocationActive}
        onClick={handleLocationClick}
      />
      
      {/* Search button */}
      <SearchButton 
        loading={searchState.loading || searchLoading}
        onClick={() => search(query)}
      />
      
      {/* Search menu */}
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
        onSearch={() => search(query)}
      />
      
      {/* Route display */}
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
