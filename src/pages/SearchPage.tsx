
import React from 'react';
import { useSearchPageState } from '@/hooks/useSearchPageState';
import SearchHeader from '@/components/search/SearchHeader';
import { SearchPanel } from '@/components/search/SearchPanel';
import MapDisplay from '@/components/search/MapDisplay';

const SearchPage = () => {
  const {
    places,
    resultsCount,
    setResultsCount,
    selectedDuration,
    setSelectedDuration,
    selectedDistance,
    setSelectedDistance,
    distanceUnit,
    setDistanceUnit,
    viewport,
    setViewport,
    searchQuery,
    setSearchQuery,
    loading,
    isLocationActive,
    userLocation,
    isRecording,
    transportMode,
    setTransportMode,
    showMenu,
    selectedPlaceId,
    popupInfo,
    setPopupInfo,
    searchResults,
    showHistory,
    setShowHistory,
    searchHistory,
    savedSearches,
    performSearch,
    handleLocationClick,
    handleMenuClick,
    handleResultClick,
    resetSearch,
    handleHistoryItemClick,
    handleSaveSearch,
    handleRemoveSavedSearch,
    handleMicClick,
    generatePDF
  } = useSearchPageState();

  return (
    <div className="flex flex-col h-screen bg-white">
      <SearchHeader 
        resultsCount={resultsCount}
        setResultsCount={setResultsCount}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
        selectedDistance={selectedDistance}
        setSelectedDistance={setSelectedDistance}
        distanceUnit={distanceUnit}
        setDistanceUnit={setDistanceUnit}
      />
      
      <div className="flex-grow relative">
        <MapDisplay 
          viewport={viewport}
          setViewport={setViewport}
          places={places}
          resultsCount={resultsCount}
          selectedPlaceId={selectedPlaceId}
          popupInfo={popupInfo}
          setPopupInfo={setPopupInfo}
          handleResultClick={handleResultClick}
          isLocationActive={isLocationActive}
          userLocation={userLocation}
          loading={loading}
          handleLocationClick={handleLocationClick}
          transportMode={transportMode}
        />
        
        {/* Search Panel overlay */}
        <SearchPanel 
          query={searchQuery}
          setQuery={setSearchQuery}
          search={performSearch}
          isRecording={isRecording}
          onMicClick={handleMicClick}
          isLocationActive={isLocationActive}
          onLocationClick={handleLocationClick}
          loading={loading}
          transportMode={transportMode}
          onTransportModeChange={setTransportMode}
          onMenuClick={handleMenuClick}
          resetSearch={resetSearch}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          searchHistory={searchHistory}
          savedSearches={savedSearches}
          onHistoryItemClick={handleHistoryItemClick}
          onSaveSearch={handleSaveSearch}
          onRemoveSavedSearch={handleRemoveSavedSearch}
          userLocation={userLocation}
          generatePDF={generatePDF}
          onResultSelect={(result) => {
            // Handle result selection from search panel
            const place = {
              id: result.id,
              name: result.name || '',
              lat: result.latitude,
              lon: result.longitude,
              address: result.address
            };
            handleResultClick(place);
          }}
        />
      </div>
    </div>
  );
};

export default SearchPage;
