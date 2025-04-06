
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
// Use the same Result type consistently
import type { Result } from '@/components/ResultsList';

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

  // Récupérer la catégorie depuis l'URL si elle existe
  useEffect(() => {
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
      // Effectuer une recherche automatique avec la catégorie sélectionnée
      performSearch(searchQuery || categoryFromUrl);
    }
  }, [categoryFromUrl, performSearch, searchQuery, selectedCategory, setSelectedCategory]);

  const handleSearchFromHeader = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const handleResultSelect = (result: any) => {
    setSearchQuery(result.place_name);
    performSearch(result.place_name);
  };
  
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
          results={places}
          center={userLocation}
          transportMode={transportMode}
          isLocationActive={isLocationActive}
          loading={loading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isRecording={false}
          onMicClick={() => {}}
          onLocationClick={handleLocationClick}
          showRoutes={showRoutes}
          onSearch={() => performSearch(searchQuery)}
          selectedResultId={selectedPlaceId}
          onResultClick={(result: Result) => handleResultClick(result as Result)}
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
          radius={5}
          radiusUnit="km"
          radiusType="distance"
          duration={15}
          timeUnit="minutes"
        />
        
        <ResultsPopup 
          results={searchResults}
          selectedPlaceId={selectedPlaceId}
          handleResultClick={(result: Result) => handleResultClick(result)}
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
