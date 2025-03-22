
import React from 'react';
import { SearchPanel } from '@/components/search/SearchPanel';
import MapSection from '@/components/search/MapSection';
import { toast } from 'sonner';
import { useSearchPageState } from '@/hooks/useSearchPageState';
import Layout from '@/components/Layout';
import { Result } from '@/components/ResultsList';

const SearchPage = () => {
  const {
    searchQuery,
    setSearchQuery: handleSearchChange,
    isRecording,
    handleMicClick,
    isLocationActive,
    handleLocationClick,
    loading,
    transportMode,
    setTransportMode,
    resultsCount,
    setResultsCount,
    searchResults,
    userLocation,
    viewport,
    setViewport,
    selectedPlaceId,
    popupInfo,
    setPopupInfo,
    handleResultClick,
    performSearch,
    generatePDF,
    selectedDistance,
    selectedDuration,
    distanceUnit,
    selectedCategory,
    setSelectedCategory,
    searchHistory,
    savedSearches,
    handleHistoryItemClick,
    handleSaveSearch,
    handleRemoveSavedSearch,
    resetSearch
  } = useSearchPageState();

  // Transform searchResults into places format expected by MapDisplay
  const places: Result[] = searchResults.map((result: any) => ({
    id: result.id || `place-${Math.random().toString(36).substr(2, 9)}`,
    name: result.name,
    latitude: result.lat,
    longitude: result.lon,
    distance: result.distance,
    duration: result.duration,
    address: result.place_name,
    category: result.category
  }));

  return (
    <Layout className="h-screen p-0 overflow-hidden">
      <div className="relative flex-grow">
        <MapSection 
          results={places}
          center={userLocation}
          radius={selectedDistance || 5}
          radiusUnit={distanceUnit}
          radiusType="distance"
          duration={selectedDuration || 15}
          timeUnit="minutes"
          transportMode={transportMode}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          isRecording={isRecording}
          onMicClick={handleMicClick}
          onLocationClick={handleLocationClick}
          isLocationActive={isLocationActive}
          loading={loading}
          showRoutes={places.length > 0}
          onSearch={() => performSearch(searchQuery)}
          selectedResultId={selectedPlaceId}
          onResultClick={handleResultClick}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          searchHistory={searchHistory}
          savedSearches={savedSearches}
          onHistoryItemClick={handleHistoryItemClick}
          onSaveSearch={handleSaveSearch}
          onRemoveSavedSearch={handleRemoveSavedSearch}
          resetSearch={resetSearch}
          onTransportModeChange={setTransportMode}
          userLocation={userLocation}
        />
        
        {/* Search Panel */}
        <SearchPanel
          query={searchQuery}
          setQuery={handleSearchChange}
          search={performSearch}
          isLocationActive={isLocationActive}
          onLocationClick={handleLocationClick}
          loading={loading}
          transportMode={transportMode}
          onTransportModeChange={setTransportMode}
          userLocation={userLocation}
          generatePDF={generatePDF}
          limit={resultsCount}
          setLimit={setResultsCount}
        />
      </div>
    </Layout>
  );
};

export default SearchPage;
