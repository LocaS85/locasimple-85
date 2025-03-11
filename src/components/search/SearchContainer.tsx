
import React, { useState, useEffect } from 'react';
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
import SearchAutocomplete from './SearchAutocomplete';
import SearchHistory from './SearchHistory';
import { useMapboxSearch } from '@/hooks/useMapboxSearch';
import { useMapboxRoutes } from '@/hooks/useMapboxRoutes';
import { toast } from 'sonner';
import MultiRouteDisplay from '../map/MultiRouteDisplay';
import { Button } from '@/components/ui/button';
import { Search, History, ArrowRight } from 'lucide-react';

export const SearchContainer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const searchState = useSearchState();
  const searchMenu = useSearchMenu();
  const resultSelection = useResultSelection();
  
  // Utiliser les hooks mapbox
  const {
    query,
    setQuery,
    results,
    loading: searchLoading,
    search,
    resetSearch,
    searchHistory,
    savedSearches,
    saveSearch,
    removeSavedSearch
  } = useMapboxSearch({
    userLocation: searchState.userLocation,
    limit: searchState.resultsCount
  });

  const {
    from,
    setFrom,
    to,
    setTo,
    routes,
    activeMode,
    setActiveMode,
    calculateRoute,
    calculateAllRoutes,
    loading: routeLoading
  } = useMapboxRoutes();
  
  // Fix: Use the correct parameter structure for useVoiceRecording
  const { handleMicClick } = useVoiceRecording({ 
    isRecording, 
    setIsRecording,
    onTextResult: (text) => {  // Fixed parameter name
      setQuery(text);
      search(text);
    }
  });
  
  const { handleLocationClick, searchAddress } = useSearchLocation(
    searchState.isLocationActive,
    searchLoading || routeLoading,
    searchState.setLoading,
    searchState.setIsLocationActive,
    searchState.setUserLocation
  );
  
  const { handleSearchPress } = useSearchOperations({
    searchState,
    locationOperations: { handleLocationClick, searchAddress },
    resultSelection
  });

  // Update from/to coordinates when userLocation or selected result changes
  useEffect(() => {
    if (searchState.userLocation) {
      setFrom(searchState.userLocation);
    }
  }, [searchState.userLocation]);

  useEffect(() => {
    if (resultSelection.selectedResultId) {
      const selectedResult = searchState.searchResults.find(
        r => r.id === resultSelection.selectedResultId
      );
      if (selectedResult) {
        setTo([selectedResult.longitude, selectedResult.latitude]);
      }
    }
  }, [resultSelection.selectedResultId, searchState.searchResults]);

  // Calcul d'itinéraire quand from et to sont définis
  useEffect(() => {
    if (from && to && resultSelection.selectedResultId) {
      calculateAllRoutes();
    }
  }, [from, to, resultSelection.selectedResultId, searchState.transportMode]);

  // Remplir les résultats de recherche de l'état avec les résultats de mapbox
  useEffect(() => {
    if (results.length > 0) {
      const formattedResults = results.map(result => ({
        id: result.id,
        name: result.place_name.split(',')[0], // Fixed: Use place_name instead of text
        address: result.place_name,
        distance: 0, // À calculer
        duration: 0, // À calculer
        category: result.properties?.category || 'other',
        color: 'blue', // À personnaliser
        latitude: result.center[1],
        longitude: result.center[0],
        description: result.properties?.description || '',
      }));
      
      searchState.setSearchResults(formattedResults);
      searchState.setSearchPerformed(true);
    }
  }, [results]);

  const handleHistoryItemClick = (query: string) => {
    setQuery(query);
    search(query);
    setShowHistory(false);
  };

  const handleSaveSearch = (query: string) => {
    saveSearch(query);
    toast.success(`Recherche "${query}" sauvegardée`);
  };

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
          loading={searchState.loading || searchLoading || routeLoading}
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
      
      {/* Panneau de recherche amélioré */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
        <div className="bg-white rounded-lg shadow-md p-3">
          <div className="flex items-center gap-2">
            <SearchAutocomplete
              value={query}
              onChange={setQuery}
              onSearch={search}
              onResultSelect={(result) => {
                // Trouver l'équivalent dans searchResults
                const formattedResult = {
                  id: result.id,
                  name: result.place_name.split(',')[0], // Fixed: Use place_name instead of text
                  address: result.place_name,
                  distance: 0,
                  duration: 0,
                  category: result.properties?.category || 'other',
                  color: 'blue',
                  latitude: result.center[1],
                  longitude: result.center[0],
                  description: ''
                };
                resultSelection.handleResultClick(formattedResult);
              }}
              onClear={resetSearch}
              placeholder="Rechercher un lieu, une entreprise..."
              userLocation={searchState.userLocation}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowHistory(!showHistory)}
              className="flex-shrink-0"
            >
              <History className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Historique de recherche */}
          {showHistory && (
            <div className="mt-2">
              <SearchHistory
                history={searchHistory}
                savedSearches={savedSearches}
                onHistoryItemClick={handleHistoryItemClick}
                onSaveSearch={handleSaveSearch}
                onRemoveSavedSearch={removeSavedSearch}
                onClearHistory={() => {
                  localStorage.removeItem('search_history');
                  location.reload();
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      <LocationButton 
        loading={searchState.loading}
        isLocationActive={searchState.isLocationActive}
        onClick={handleLocationClick}
      />
      
      <SearchButton 
        loading={searchState.loading}
        onClick={() => search(query)}
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
        onSearch={() => search(query)}
      />
      
      {/* Affichage des itinéraires multiples */}
      {resultSelection.selectedResultId && from && to && (
        <div className="absolute bottom-4 left-0 right-0 mx-auto max-w-md px-4 z-20">
          <MultiRouteDisplay
            routes={routes}
            activeMode={activeMode}
            onModeChange={(mode) => {
              setActiveMode(mode);
              searchState.setTransportMode(mode === 'driving-traffic' ? 'driving' : mode);
            }}
            onRouteSelect={(route, mode) => {
              console.log(`Route sélectionnée en mode ${mode}:`, route);
            }}
            onSaveRoute={(route, mode) => {
              toast.success(`Itinéraire en ${mode} sauvegardé`);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchContainer;
