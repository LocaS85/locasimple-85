
import React, { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import SearchHeader from '@/components/search/SearchHeader';
import MapSection from '@/components/search/MapSection';
import CategoryTabs from '@/components/search/CategoryTabs';
import ResultsPopup from '@/components/search/ResultsPopup';
import NoResultsMessage from '@/components/search/NoResultsMessage';
import MapboxWarning from '@/components/search/MapboxWarning';
import SearchFooter from '@/components/search/SearchFooter';
import { useSearchPageStateManager } from '@/hooks/useSearchPageStateManager';
import { Result } from '@/components/ResultsList';

const SearchPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const {
    searchQuery,
    setSearchQuery,
    resultsCount,
    setResultsCount,
    searchResults,
    loading,
    transportMode,
    setTransportMode,
    userLocation,
    isLocationActive,
    selectedPlaceId,
    showRoutes,
    selectedCategory,
    setSelectedCategory,
    showNoMapboxTokenWarning,
    setShowNoMapboxTokenWarning,
    places,
    handleLocationClick,
    handleCategoryToggle,
    clearFilters,
    performSearch,
    handleResultClick,
    generatePDF,
    toggleRoutes,
    resetSearch
  } = useSearchPageStateManager();

  useEffect(() => {
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
      performSearch(searchQuery || categoryFromUrl);
    }
  }, [categoryFromUrl, performSearch, searchQuery, selectedCategory, setSelectedCategory]);

  const handleSearchFromHeader = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  // Make sure we use a compatible type for result
  const handleResultSelect = (result: Result) => {
    setSearchQuery(result.name);
    performSearch(result.name);
  };

  // Convert places to the Result format expected by MapSection
  const mapResults: Result[] = places.map(place => ({
    id: place.id,
    name: place.name,
    latitude: place.lat,
    longitude: place.lon,
    address: place.address || '',
    category: place.category || '',
    distance: place.distance || 0,
    duration: place.duration || 0
  }));

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <SearchHeader 
        title="Recherche"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearchFromHeader}
        onResultSelect={handleResultSelect}
        userLocation={userLocation}
      />
      
      <CategoryTabs 
        selectedCategory={selectedCategory}
        handleCategoryToggle={handleCategoryToggle}
        clearFilters={clearFilters}
      />
      
      <div className="flex-grow relative">
        <MapboxWarning 
          show={showNoMapboxTokenWarning} 
          onClose={() => setShowNoMapboxTokenWarning(false)} 
        />
        
        <MapSection 
          results={mapResults}
          center={userLocation}
          radius={5}
          radiusUnit="km"
          radiusType="distance"
          duration={15}
          timeUnit="minutes"
          transportMode={transportMode}
          isRecording={false}
          onMicClick={() => {}}
          onLocationClick={handleLocationClick}
          isLocationActive={isLocationActive}
          loading={loading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showRoutes={showRoutes}
          onSearch={() => performSearch(searchQuery)}
          selectedResultId={selectedPlaceId}
          onResultClick={handleResultClick}
          selectedCategory={selectedCategory}
          onCategorySelect={clearFilters}
          searchHistory={[]}
          savedSearches={[]}
          onHistoryItemClick={() => {}}
          onSaveSearch={() => {}}
          onRemoveSavedSearch={() => {}}
          resetSearch={resetSearch}
          onTransportModeChange={setTransportMode}
          userLocation={userLocation}
        />
        
        <ResultsPopup 
          results={searchResults}
          selectedPlaceId={selectedPlaceId}
          handleResultClick={handleResultClick}
        />
        
        <NoResultsMessage 
          searchQuery={searchQuery} 
          loading={loading}
          clearFilters={clearFilters}
        />
        
        <SearchFooter 
          generatePDF={generatePDF}
          toggleRoutes={toggleRoutes}
          showRoutes={showRoutes}
        />
      </div>
    </div>
  );
};

export default SearchPage;
