
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import { useSearchState } from '@/hooks/useSearchState';
import { MAPBOX_TOKEN } from '@/config/environment';
import { DAILY_CATEGORIES } from '@/types/dailyCategories';

// Components
import FilterSidebar from './filters/FilterSidebar';
import GeoSearcher from './GeoSearcher';
import MapSection from './MapSection';
import CategoriesScroller from './CategoriesScroller';
import ResultsCountSlider from './filters/ResultsCountSlider';

interface SearchPageProps {
  mapboxTokenSet?: boolean;
  onSetMapboxToken?: (token: string) => boolean;
}

const SearchPage: React.FC<SearchPageProps> = ({ 
  mapboxTokenSet = false, 
  onSetMapboxToken = () => false 
}) => {
  const {
    origin, 
    setOrigin,
    searchQuery,
    setSearchQuery,
    selectedDistance,
    distanceUnit,
    transportMode,
    setTransportMode,
    resultsCount,
    setResultsCount,
    userLocation,
    isLocationActive,
    selectedCategory,
    setSelectedCategory,
    loading,
    showRoutes,
    resetMapState,
  } = useSearchState();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(undefined);
  const [filterMode, setFilterMode] = useState<'distance' | 'duration'>('distance');

  // Handle search result
  const handleSearchResult = (result: any) => {
    setOrigin(result);
    toast.success(`Position mise à jour: ${result.name || 'Nouvelle localisation'}`);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(undefined);
    toast.success(`Catégorie sélectionnée: ${categoryId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="p-4 bg-white shadow-md z-10">
        <GeoSearcher
          modes={['address', 'current_location', 'saved_places']}
          onResult={handleSearchResult}
          placeholder="Adresse, lieu ou coordonnées GPS..."
          enableVoice={true}
        />
      </div>
      
      {/* Categories Scroller */}
      <div className="w-full bg-white border-b border-gray-200 shadow-sm z-10">
        <CategoriesScroller 
          selectedCategory={selectedCategory} 
          onCategorySelect={setSelectedCategory} 
        />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar Toggle Button */}
        <button 
          className="absolute top-4 left-4 z-20 bg-white p-2 rounded-full shadow-md"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <ChevronLeftCircle size={20} /> : <ChevronRightCircle size={20} />}
        </button>

        {/* Sidebar */}
        {sidebarOpen && (
          <FilterSidebar 
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            selectedDistance={selectedDistance}
            distanceUnit={distanceUnit}
            transportMode={transportMode}
            onTransportModeChange={setTransportMode}
            resultsCount={resultsCount}
            onResultsCountChange={setResultsCount}
            filterMode={filterMode}
            onFilterModeChange={setFilterMode}
          />
        )}

        {/* Map Area */}
        <div className={`flex-1 h-full relative transition-all duration-300`}>
          {!mapboxTokenSet && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                <h3 className="text-lg font-semibold mb-2">Token Mapbox manquant</h3>
                <p className="mb-4 text-gray-600">
                  Pour afficher la carte, veuillez entrer votre token d'accès Mapbox.
                </p>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="pk.eyJ1Ijoi..."
                    className="w-full border rounded p-2"
                    id="mapbox-token-input"
                  />
                  
                  <button
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    onClick={() => {
                      const input = document.getElementById('mapbox-token-input') as HTMLInputElement;
                      if (input && input.value) {
                        onSetMapboxToken(input.value);
                      } else {
                        toast.error('Veuillez entrer un token valide');
                      }
                    }}
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <MapSection
            userLocation={userLocation}
            loading={loading}
            showRoutes={showRoutes}
            transportMode={transportMode}
            selectedCategory={selectedCategory}
            radiusType={filterMode}
            radius={selectedDistance || 5}
            distanceUnit={distanceUnit}
            showNoMapboxTokenWarning={!mapboxTokenSet}
            onSetMapboxToken={onSetMapboxToken}
          />
          
          {/* Results count controller (floating) */}
          <div className="absolute bottom-4 left-4 z-10 bg-white p-2 rounded-lg shadow-md">
            <ResultsCountSlider
              value={resultsCount}
              onChange={setResultsCount}
              min={1}
              max={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
