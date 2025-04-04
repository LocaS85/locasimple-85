
import React from 'react';
import SearchHeader from '@/components/search/SearchHeader';
import MapSection from '@/components/search/MapSection';
import CategoryTabs from '@/components/search/CategoryTabs';
import ResultsPopup from '@/components/search/ResultsPopup';
import NoResultsMessage from '@/components/search/NoResultsMessage';
import MapboxWarning from '@/components/search/MapboxWarning';
import SearchFooter from '@/components/search/SearchFooter';
import { useSearchPageStateManager } from '@/hooks/useSearchPageStateManager';

const SearchPage = () => {
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

  return (
    <div className="flex flex-col h-screen bg-white">
      <SearchHeader />
      
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
          radius={5}
          radiusUnit="km"
          radiusType="distance"
          duration={15}
          timeUnit="minutes"
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
