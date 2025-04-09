
import React from 'react';
import { toast } from 'sonner';
import GeoSearcher from './GeoSearcher';
import FilterStack from './filters/FilterStack';
import SmartMap from './map/SmartMap';
import RouteComparator from './route/RouteComparator';
import GeoErrorBoundary from './GeoErrorBoundary';
import { useSearchState } from '@/hooks/search/useSearchState';
import { MAPBOX_TOKEN } from '@/config/environment';
import MapKeyWarning from './MapKeyWarning';
import CategoryAccordion from './filters/CategoryAccordion';
import TransportSelector from './filters/TransportSelector';
import { DAILY_CATEGORIES } from '@/data/mockCategories';
import RadiusControl from './filters/RadiusControl';
import TimeFilter from './filters/TimeFilter';
import { Car, User } from 'lucide-react'; // Added missing imports

const SearchPage = () => {
  const {
    origin, 
    setOrigin,
    destinations,
    filters,
    updateFilters,
    results,
    viewMode,
    setViewMode,
    resetMapState,
    isLoading
  } = useSearchState();

  const handleSearchResult = (result: any) => {
    setOrigin(result);
    toast.success(`Position mise à jour: ${result.name || 'Nouvelle localisation'}`);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-white shadow-md z-10">
        <GeoSearcher
          modes={['address', 'current_location', 'saved_places']}
          onResult={handleSearchResult}
          placeholder="Adresse, lieu ou coordonnées GPS..."
          enableVoice={true}
        />
      </div>
      
      <div className="flex flex-1 relative overflow-hidden">
        {/* Main content area with map and filters */}
        <div className={`${viewMode === 'list' ? 'w-full' : viewMode === 'split' ? 'w-1/2' : 'hidden md:block md:w-1/4'} 
          h-full overflow-y-auto border-r border-gray-200 transition-all duration-300`}>
          <FilterStack>
            <CategoryAccordion 
              categories={DAILY_CATEGORIES}
              selectionMode="multi-level"
              onCategorySelect={() => {}}
            />
            <RadiusControl
              unitOptions={['km', 'mi']}
              maxRadius={100}
              step={5}
            />
            <TransportSelector
              modes={[
                { id: 'driving', icon: <Car size={20} />, label: 'Voiture' },
                { id: 'walking', icon: <User size={20} />, label: 'Marche' }
              ]}
            />
            <TimeFilter
              type="time-slider"
              ranges={['now', 'today', 'custom']}
            />
          </FilterStack>
        </div>

        {/* Map container */}
        <div className={`${viewMode === 'map' ? 'w-full' : viewMode === 'split' ? 'w-1/2' : 'w-3/4'} 
          h-full relative transition-all duration-300`}>
          
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
              filters={filters}
              isLoading={isLoading}
            />
          </GeoErrorBoundary>
        </div>
      </div>

      {/* Bottom route comparator (conditionally shown) */}
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

      {/* View mode toggle buttons */}
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
