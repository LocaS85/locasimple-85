import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import FilterStack from './filters/FilterStack';
import CategoryAccordion from './filters/CategoryAccordion';
import TransportSelector from './filters/TransportSelector';
import RadiusControl from './filters/RadiusControl';
import TimeFilter from './filters/TimeFilter';
import PrintExportControl from './filters/PrintExportControl';
import GeoSearcher from './GeoSearcher';
import SmartMap from './map/SmartMap';
import RouteComparator from './route/RouteComparator';
import GeoErrorBoundary from './GeoErrorBoundary';
import MapKeyWarning from './MapKeyWarning';
import { MAPBOX_TOKEN } from '@/config/environment';
import { useSearchState } from '@/hooks/useSearchState';
import { DAILY_CATEGORIES } from '@/types/dailyCategories';
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';

const SearchPage = () => {
  const {
    origin, 
    setOrigin,
    destinations,
    filters,
    updateFilters,
    searchResults,
    viewMode,
    setViewMode,
    resetMapState,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedDistance,
    setSelectedDistance,
    selectedDuration,
    setSelectedDuration,
    distanceUnit,
    setDistanceUnit,
    transportMode,
    setTransportMode,
    resultsCount,
    setResultsCount,
    userLocation,
    setUserLocation,
    isLocationActive,
    selectedCategory,
    setSelectedCategory
  } = useSearchState();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(undefined);
  const [filterMode, setFilterMode] = useState<'distance' | 'duration'>('distance');

  const handleSearchResult = (result: any) => {
    setOrigin(result);
    toast.success(`Position mise à jour: ${result.name || 'Nouvelle localisation'}`);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCategorySelect = (categoryId: string, subcategoryId?: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
    
    toast.success(`Catégorie sélectionnée: ${
      subcategoryId 
        ? `${categoryId} > ${subcategoryId}` 
        : categoryId
    }`);
  };

  const handleExport = (format: string, options: any) => {
    toast.success(`Exporting ${format} with options: ${JSON.stringify(options)}`);
    // Implementation would connect to map instance and capture the view
  };

  const handleRadiusChange = (radius: number, unit: string) => {
    setSelectedDistance(radius);
    setDistanceUnit(unit as any);
    setFilterMode('distance');
    updateFilters({ radius });
  };

  const handleDurationChange = (duration: number, timeUnit: string) => {
    setSelectedDuration(duration);
    setFilterMode('duration');
  };

  const handleTimeRangeChange = (timeRange: { start: string; end: string }) => {
    console.log('Time range changed:', timeRange);
    // Implement time range filter logic here
  };

  const handleTransportModeChange = (mode: string) => {
    setTransportMode(mode);
    updateFilters({ transport: mode });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="p-4 bg-white shadow-md z-10">
        <GeoSearcher
          modes={['address', 'current_location', 'saved_places']}
          onResult={handleSearchResult}
          placeholder="Adresse, lieu ou coordonnées GPS..."
          enableVoice={true}
        />
      </div>
      
      <div className="flex flex-1 relative overflow-hidden">
        <button 
          className="absolute top-4 left-4 z-20 bg-white p-2 rounded-full shadow-md"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <ChevronLeftCircle size={20} /> : <ChevronRightCircle size={20} />}
        </button>

        {sidebarOpen && (
          <div className="w-full md:w-80 lg:w-96 h-full overflow-y-auto border-r border-gray-200 transition-all duration-300 bg-white z-10">
            <FilterStack>
              <CategoryAccordion 
                categories={DAILY_CATEGORIES}
                selectionMode="hierarchical"
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
              />
              
              <RadiusControl
                unitOptions={['km', 'mi']}
                maxRadius={100}
                step={5}
                defaultRadius={selectedDistance || 5}
                defaultUnit={distanceUnit}
                onChange={handleRadiusChange}
                onDurationChange={handleDurationChange}
              />
              
              <TransportSelector
                defaultMode={transportMode}
                onChange={handleTransportModeChange}
              />
              
              <TimeFilter
                type="time-range"
                ranges={['now', 'today', 'custom']}
                onChange={handleTimeRangeChange}
              />
              
              <PrintExportControl
                onExport={handleExport}
              />
            </FilterStack>
          </div>
        )}

        <div className={`flex-1 h-full relative transition-all duration-300`}>
          {!MAPBOX_TOKEN && <MapKeyWarning />}
          
          <GeoErrorBoundary
            fallback={(error) => (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
                  <h3 className="text-lg font-semibold text-red-500">
                    Problème de chargement cartographique
                  </h3>
                  <p className="my-2 text-gray-600">
                    Code d'erreur: {error.code || 'Inconnu'}
                  </p>
                  <button 
                    onClick={resetMapState}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            )}
          >
            <SmartMap
              layers={[
                'base-map',
                'poi-clusters',
                'isochrones',
                'multi-routes'
              ]}
              controls={[
                '3d-toggle',
                'layer-switcher',
                'compass',
                'geolocate'
              ]}
              origin={origin}
              destinations={destinations}
              filters={{
                radius: selectedDistance || 5,
                transport: transportMode,
                categories: selectedCategory ? [selectedCategory] : [],
                subcategories: selectedSubcategory ? [selectedSubcategory] : [],
                distanceUnit: distanceUnit,
                duration: selectedDuration,
              }}
              isLoading={isLoading}
            />
          </GeoErrorBoundary>
        </div>
      </div>

      {destinations.length > 0 && (
        <div className="h-48 border-t border-gray-200 bg-white">
          <RouteComparator
            mode="split-view"
            metrics={['distance', 'time', 'elevation', 'cost']}
            displayModes={['2d-map', '3d-view', 'elevation-profile']}
            origin={origin}
            destinations={destinations}
            transportMode={filters.transport}
          />
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-10 bg-white rounded-full shadow-lg flex">
        <button 
          className={`p-3 ${viewMode === 'map' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} rounded-l-full`}
          onClick={() => setViewMode('map')}
          title="Vue carte"
        >
          <span className="sr-only">Vue carte</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </button>
        <button 
          className={`p-3 ${viewMode === 'split' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          onClick={() => setViewMode('split')}
          title="Vue partagée"
        >
          <span className="sr-only">Vue partagée</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6v12m6-12v12M3 6h18v12H3z" />
          </svg>
        </button>
        <button 
          className={`p-3 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} rounded-r-full`}
          onClick={() => setViewMode('list')}
          title="Vue liste"
        >
          <span className="sr-only">Vue liste</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
