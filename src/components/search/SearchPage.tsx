import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import { useSearchState } from '@/hooks/useSearchState';
import { MAPBOX_TOKEN } from '@/config/environment';
import { DAILY_CATEGORIES } from '@/types/dailyCategories';
import AddressSearch from '@/components/search/AddressSearch';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import mapboxSearchService from '@/services/mapboxSearchService';
import { Result } from '@/components/ResultsList';

interface SearchPageProps {
  mapboxTokenSet?: boolean;
  onSetMapboxToken?: (token: string) => boolean;
  isExpanded?: boolean;
  toggleExpandedView?: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ 
  mapboxTokenSet = false, 
  onSetMapboxToken = () => false,
  isExpanded = false,
  toggleExpandedView = () => {}
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
  const [searchResults, setSearchResults] = useState<Result[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const isMobile = useIsMobile();

  const handleSearchResult = (result: any) => {
    setOrigin(result);
    toast.success(`Position mise à jour: ${result.name || 'Nouvelle localisation'}`);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(undefined);
    
    performSearch(categoryId);
  };

  const performSearch = async (categoryId?: string) => {
    if (isSearching) return;
    
    setIsSearching(true);
    
    try {
      if (!userLocation) {
        toast.error('Veuillez activer la localisation pour effectuer une recherche');
        return;
      }
      
      const results = await mapboxSearchService.search({
        query: searchQuery,
        userLocation,
        limit: resultsCount,
        radius: selectedDistance * (distanceUnit === 'km' ? 1000 : 1609.34),
        category: categoryId || selectedCategory,
        transportMode
      });
      
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.info('Aucun résultat trouvé');
      } else {
        toast.success(`${results.length} résultats trouvés`);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast.error('Erreur lors de la recherche');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if ((!searchQuery || searchQuery.trim().length === 0) && !selectedCategory) return;
    
    const timer = setTimeout(() => {
      performSearch();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [selectedDistance, transportMode, resultsCount, distanceUnit]);

  const handlePlaceSelect = (place: Result) => {
    toast.info(`Sélection: ${place.name}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <motion.div 
        className="p-4 bg-white shadow-md z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={cn(
          "transition-all duration-300",
          (isMobile && isExpanded) ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          <GeoSearcher
            modes={['address', 'current_location', 'saved_places']}
            onResult={handleSearchResult}
            placeholder="Adresse, lieu ou coordonnées GPS..."
            enableVoice={true}
            onSearch={handleSearchInputChange}
          />
        </div>
      </motion.div>
      
      <motion.div 
        className="w-full bg-white border-b border-gray-200 shadow-sm z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <CategoriesScroller 
          selectedCategory={selectedCategory} 
          onCategorySelect={handleCategorySelect} 
        />
      </motion.div>
      
      <div className="flex flex-1 relative overflow-hidden">
        <motion.button 
          className="absolute top-4 left-4 z-20 bg-white p-2 rounded-full shadow-md"
          onClick={toggleSidebar}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {sidebarOpen ? <ChevronLeftCircle size={20} /> : <ChevronRightCircle size={20} />}
        </motion.button>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 500 }}
              className="z-10"
            >
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
                onSearch={performSearch}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className={`flex-1 h-full relative transition-all duration-300`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {!mapboxTokenSet && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-lg max-w-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
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
              </motion.div>
            </div>
          )}
          
          <MapSection
            userLocation={userLocation}
            loading={loading || isSearching}
            showRoutes={showRoutes}
            transportMode={transportMode}
            selectedCategory={selectedCategory}
            radiusType={filterMode}
            radius={selectedDistance || 5}
            distanceUnit={distanceUnit}
            places={searchResults}
            onPlaceSelect={handlePlaceSelect}
            showNoMapboxTokenWarning={!mapboxTokenSet}
            onSetMapboxToken={onSetMapboxToken}
            onSearch={performSearch}
          />
          
          <motion.div 
            className="absolute bottom-4 left-4 z-10 bg-white p-2 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <ResultsCountSlider
              value={resultsCount}
              onChange={setResultsCount}
              min={1}
              max={10}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchPage;
