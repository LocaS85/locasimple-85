
import React, { useEffect, useState } from 'react';
import { RouteDisplayContainer } from './RouteDisplayContainer';
import { useSearchPanel } from '@/hooks/useSearchPanel';
import { useRouteDisplay } from '@/hooks/useRouteDisplay';
import MapSection from './MapSection';
import SearchMenu from './SearchMenu';
import { toast } from 'sonner';
import useSearchApiCore from '@/hooks/search/useSearchApiCore';
import { DistanceUnit } from '@/types/categoryTypes';

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

  const { from, to, routes, activeMode, setActiveMode } = useRouteDisplay({
    userLocation: searchState.userLocation,
    searchResults: searchState.searchResults,
    selectedResultId: resultSelection.selectedResultId,
    transportMode: searchState.transportMode
  });

  const searchApiCore = useSearchApiCore({
    userLocation: searchState.userLocation,
    setLoading: (loading: boolean) => {
      // We don't need to set loading state here
    }
  });

  useEffect(() => {
    const checkServer = async () => {
      const isConnected = await searchApiCore.checkFlaskServer();
      if (isConnected) {
        console.log('Flask server is connected');
      } else {
        console.warn('Flask server is not connected');
        toast.warning('Le serveur Flask n\'est pas accessible. Certaines fonctionnalités peuvent être limitées.', {
          duration: 5000,
        });
      }
    };
    
    checkServer();
  }, []);

  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>("km");

  return (
    <div className="relative w-full h-full">
      <MapSection
        results={searchState.searchResults}
        center={searchState.userLocation}
        radius={searchState.selectedDistance || 5}
        radiusUnit={distanceUnit}
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

      <SearchMenu
        show={searchMenu.menuOpen}
        onClose={() => searchMenu.setMenuOpen(false)}
        selectedDuration={searchState.selectedDuration}
        selectedDistance={searchState.selectedDistance}
        distanceUnit={distanceUnit}
        transportMode={searchState.transportMode}
        resultsCount={searchState.resultsCount}
        selectedCategory={searchState.selectedCategory}
        onCategorySelect={searchState.setSelectedCategory}
        onResultsCountChange={searchState.setResultsCount}
        onTransportModeChange={searchState.setTransportMode}
        onDurationChange={searchState.setSelectedDuration}
        onDistanceChange={searchState.setSelectedDistance}
        onDistanceUnitChange={setDistanceUnit}
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
