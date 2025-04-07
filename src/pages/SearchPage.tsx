import React, { useState } from 'react';
import { useSearchPageStateManager } from '@/hooks/useSearchPageStateManager';
import { Toaster } from '@/components/ui/toaster';
import SearchPageHeader from '@/components/search-page/SearchPageHeader';
import FiltersPanel from '@/components/search-page/FiltersPanel';
import MapResultsSection from '@/components/search-page/MapResultsSection';
import MapKeyWarningSection from '@/components/search-page/MapKeyWarningSection';
import type { Result } from '@/components/ResultsList';
import { DistanceUnit } from '@/types/categoryTypes';

const SearchPage: React.FC = () => {
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
    showRoutes,
    selectedCategory,
    showNoMapboxTokenWarning,
    places: rawPlaces,
    handleLocationClick,
    handleCategoryToggle,
    performSearch,
    handleResultClick,
    generatePDF,
    toggleRoutes,
    resetSearch,
    setTemporaryApiKey
  } = useSearchPageStateManager();

  const [isMenuCollapsed, setIsMenuCollapsed] = React.useState(false);
  
  const [distanceFilter, setDistanceFilter] = useState({
    distance: 5,
    unit: 'km' as DistanceUnit
  });
  
  const [durationFilter, setDurationFilter] = useState({
    duration: 15,
    timeUnit: 'minutes' as 'minutes' | 'hours'
  });
  
  const handleToggleMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  const handleDistanceChange = (value: number) => {
    setDistanceFilter(prev => ({ ...prev, distance: value }));
  };

  const handleUnitChange = (value: 'km' | 'mi') => {
    setDistanceFilter(prev => ({ ...prev, unit: value }));
  };

  const handleDurationChange = (value: number) => {
    setDurationFilter(prev => ({ ...prev, duration: value }));
  };

  const places: Result[] = rawPlaces.map(place => ({
    id: place.id,
    name: place.name,
    latitude: place.latitude,
    longitude: place.longitude,
    address: place.address || '',
    category: place.category || '',
    distance: place.distance || 0,
    duration: place.duration || 0,
    color: place.color || ''
  }));

  return (
    <div className="max-w-screen min-h-screen bg-background">
      <Toaster />
      
      <div className="container mx-auto px-4 py-4">
        <SearchPageHeader 
          title="Recherche avancée" 
          isMenuCollapsed={isMenuCollapsed}
          handleToggleMenu={handleToggleMenu}
        />
      
        <MapKeyWarningSection 
          showNoMapboxTokenWarning={showNoMapboxTokenWarning}
          setTemporaryApiKey={setTemporaryApiKey}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <FiltersPanel
            isMenuCollapsed={isMenuCollapsed}
            handleToggleMenu={handleToggleMenu}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            performSearch={performSearch}
            resetSearch={resetSearch}
            handleLocationClick={handleLocationClick}
            isLocationActive={isLocationActive}
            loading={loading}
            selectedCategory={selectedCategory}
            handleCategoryToggle={handleCategoryToggle}
            transportMode={transportMode}
            setTransportMode={setTransportMode}
            distanceFilter={distanceFilter}
            handleDistanceChange={handleDistanceChange}
            handleUnitChange={handleUnitChange}
            durationFilter={durationFilter}
            handleDurationChange={handleDurationChange}
            toggleRoutes={toggleRoutes}
            generatePDF={generatePDF}
            userLocation={userLocation}
            places={places}
          />
          
          <MapResultsSection 
            places={places}
            userLocation={userLocation}
            handleLocationClick={handleLocationClick}
            isLocationActive={isLocationActive}
            loading={loading}
            showRoutes={showRoutes}
            performSearch={performSearch}
            handleResultClick={handleResultClick}
            selectedCategory={selectedCategory}
            handleCategoryToggle={handleCategoryToggle}
            transportMode={transportMode}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
