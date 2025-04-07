
import React, { useState } from 'react';
import { useSearchPageStateManager } from '@/hooks/useSearchPageStateManager';
import { motion } from 'framer-motion';
import ResultsList, { Result } from '@/components/ResultsList';
import MapContainer from '@/components/map/MapContainer';
import SearchBox from '@/components/search/SearchBox';
import { CategoriesFilter } from '@/components/search/CategoriesFilter';
import { TransportModeFilter } from '@/components/search/TransportModeFilter';
import { DistanceFilter } from '@/components/search/DistanceFilter';
import { DurationFilter } from '@/components/search/DurationFilter';
import { Button } from '@/components/ui/button';
import FlaskServerStatus from '@/components/search/FlaskServerStatus';
import { Toaster } from '@/components/ui/toaster';
import MapKeyWarning from '@/components/search/MapKeyWarning';
import { ArrowDown, ArrowUp } from 'lucide-react';

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
    unit: 'km' as 'km' | 'mi'
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
    latitude: place.lat,
    longitude: place.lon,
    address: place.address || '',
    category: place.category || '',
    distance: place.distance || 0,
    duration: place.duration || 0,
    color: place.color || ''  // Make sure color property is included and has a default value
  }));

  return (
    <div className="max-w-screen min-h-screen bg-background">
      <Toaster />
      
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Recherche avancée</h1>
          <FlaskServerStatus className="mr-2" />
        </div>
      
        {showNoMapboxTokenWarning && (
          <MapKeyWarning setTemporaryApiKey={setTemporaryApiKey} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            className={`bg-white rounded-lg shadow-md p-4 ${isMenuCollapsed ? 'md:col-span-1' : 'md:col-span-1'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filtres</h2>
              <Button variant="ghost" size="sm" onClick={handleToggleMenu} className="md:hidden">
                {isMenuCollapsed ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
              </Button>
            </div>
            
            {!isMenuCollapsed && (
              <div className="space-y-4">
                <SearchBox
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={performSearch}
                  onReset={resetSearch}
                  onLocationClick={handleLocationClick}
                  isLocationActive={isLocationActive}
                  loading={loading}
                />
                
                <CategoriesFilter 
                  selectedCategory={selectedCategory} 
                  onCategorySelect={handleCategoryToggle}
                />
                
                <TransportModeFilter
                  selectedMode={transportMode}
                  onModeChange={setTransportMode}
                />
                
                <DistanceFilter
                  selectedDistance={distanceFilter.distance}
                  distanceUnit={distanceFilter.unit}
                  onDistanceChange={handleDistanceChange}
                  onDistanceUnitChange={handleUnitChange}
                />
                
                <DurationFilter
                  selectedDuration={durationFilter.duration}
                  onDurationChange={handleDurationChange}
                />
                
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline"
                    onClick={toggleRoutes}
                    disabled={!userLocation || places.length === 0}
                  >
                    Itinéraires
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={generatePDF}
                    disabled={places.length === 0}
                  >
                    Export PDF
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
          
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div className="h-[500px]">
                <MapContainer 
                  results={places}
                  center={userLocation || [2.3488, 48.8534]}
                  onLocationClick={handleLocationClick}
                  isLocationActive={isLocationActive}
                  loading={loading}
                  showRoutes={showRoutes}
                  onSearch={performSearch}
                  onResultClick={handleResultClick}
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategoryToggle}
                  userLocation={userLocation}
                  transportMode={transportMode}
                />
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <ResultsList 
                results={places}
                loading={loading}
                onResultClick={handleResultClick}
                userLocation={userLocation}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
