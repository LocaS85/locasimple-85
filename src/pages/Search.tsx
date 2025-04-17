
import React, { useState, useEffect } from 'react';
import { useSearchState } from '@/hooks/useSearchState';
import { useSearchPanel } from '@/hooks/useSearchPanel';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Car, Bus, Train, Ship, Plane, Users, Bike, 
  Map as MapIcon, List, Filter, X, ArrowLeft 
} from 'lucide-react';
import SearchBox from '@/components/search/SearchBox';
import FilterSidebar from '@/components/search/FilterSidebar';
import Map from '@/components/Map';
import ResultsList from '@/components/ResultsList';
import CategoryFilters from '@/components/search/CategoryFilters';
import SubcategoryScroller from '@/components/search/SubcategoryScroller';
import DistanceUnitToggle from '@/components/search/DistanceUnitToggle';
import { CATEGORIES } from '@/types/categories';
import { DistanceUnit } from '@/types/categoryTypes';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import '../styles/mapbox.css';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const searchState = useSearchState();
  const searchPanel = useSearchPanel();
  
  const [view, setView] = useState<'map' | 'list'>('map');
  const [filterMode, setFilterMode] = useState<'distance' | 'duration'>('distance');
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('km');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<string[]>([]);

  const {
    searchQuery,
    setSearchQuery,
    transportMode,
    setTransportMode,
    resultsCount,
    setResultsCount,
    selectedDistance,
    setSelectedDistance,
    selectedDuration,
    setSelectedDuration,
    userLocation,
    isLocationActive,
    loading,
    searchResults
  } = searchState;

  const {
    isRecording,
    handleMicClick,
    handleLocationClick,
    handleSearchPress
  } = searchPanel;

  // Update subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      // This would be replaced with actual subcategory data from your API
      const subcategoryMap: Record<string, string[]> = {
        'alimentation': ['Restaurants', 'Bars', 'Cafés', 'Boulangeries', 'Supermarchés'],
        'shopping': ['Vêtements', 'Électronique', 'Pharmacies', 'Bijouteries', 'Opticiens'],
        'services': ['Banques', 'Postes', 'Coiffeurs', 'Pressings', 'Laveries'],
        'sante': ['Hôpitaux', 'Cliniques', 'Dentistes', 'Pharmacies', 'Opticiens'],
        'divertissement': ['Cinémas', 'Théâtres', 'Musées', 'Parcs', 'Clubs'],
        'hebergement': ['Hôtels', 'Auberges', 'Chambres d\'hôtes', 'Camping'],
        'quotidien': ['Adresse principale', 'Famille', 'Amis', 'Travail', 'École']
      };
      
      setSubcategories(subcategoryMap[selectedCategory] || []);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(prevCategory => prevCategory === categoryId ? null : categoryId);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(prevSubcategory => prevSubcategory === subcategory ? null : subcategory);
    
    // Perform search with selected subcategory
    if (subcategory && selectedCategory) {
      setSearchQuery(`${subcategory} ${selectedCategory}`);
      handleSearchPress();
    }
  };

  const handleTransportModeChange = (mode: string) => {
    setTransportMode(mode);
    if (searchResults.length > 0) {
      handleSearchPress(); // Refresh results with new transport mode
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 bg-white shadow-sm z-10 border-b">
        <div className="flex items-center gap-2 mb-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">Recherche géolocalisée</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearchPress}
            onLocationClick={handleLocationClick}
            isLocationActive={isLocationActive}
            loading={loading}
            isRecording={isRecording}
            onMicClick={handleMicClick}
            placeholder="Rechercher un lieu, une adresse..."
          />
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="h-9 w-9"
          >
            {showFilters ? <X size={18} /> : <Filter size={18} />}
          </Button>
        </div>
        
        {/* Category filters */}
        <div className="mt-3">
          <CategoryFilters
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>
        
        {/* Subcategory scroller */}
        {selectedCategory && subcategories.length > 0 && (
          <div className="mt-3">
            <SubcategoryScroller
              subcategories={subcategories}
              selectedSubcategory={selectedSubcategory}
              onSubcategorySelect={handleSubcategorySelect}
            />
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Filters panel (visible on mobile when toggled) */}
        <div className={`
          ${showFilters ? 'block' : 'hidden'} 
          md:block w-full md:w-64 lg:w-80 bg-white border-r p-4 
          overflow-y-auto z-10
        `}>
          <h2 className="font-semibold mb-4">Filtres</h2>
          
          <div className="space-y-6">
            {/* Filter tabs */}
            <Tabs value={filterMode} onValueChange={(v) => setFilterMode(v as 'distance' | 'duration')}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="distance">Distance</TabsTrigger>
                <TabsTrigger value="duration">Durée</TabsTrigger>
              </TabsList>
              
              <TabsContent value="distance" className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Rayon de recherche</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-blue-600">{selectedDistance || 5}</span>
                      <DistanceUnitToggle
                        value={distanceUnit}
                        onChange={setDistanceUnit}
                      />
                    </div>
                  </div>
                  
                  <Slider
                    value={[selectedDistance || 5]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={(values) => setSelectedDistance(values[0])}
                  />
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 {distanceUnit}</span>
                    <span>50 {distanceUnit}</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="duration" className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Temps de trajet max</span>
                    <span className="text-sm font-medium text-blue-600">{selectedDuration || 15} min</span>
                  </div>
                  
                  <Slider
                    value={[selectedDuration || 15]}
                    min={5}
                    max={60}
                    step={5}
                    onValueChange={(values) => setSelectedDuration(values[0])}
                  />
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5 min</span>
                    <span>60 min</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Transport modes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Mode de transport</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button
                  variant={transportMode === 'driving' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleTransportModeChange('driving')}
                >
                  <Car size={16} />
                  <span className="hidden sm:inline">Voiture</span>
                </Button>
                
                <Button
                  variant={transportMode === 'walking' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleTransportModeChange('walking')}
                >
                  <Users size={16} />
                  <span className="hidden sm:inline">À pied</span>
                </Button>
                
                <Button
                  variant={transportMode === 'cycling' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleTransportModeChange('cycling')}
                >
                  <Bike size={16} />
                  <span className="hidden sm:inline">Vélo</span>
                </Button>
                
                <Button
                  variant={transportMode === 'transit' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleTransportModeChange('transit')}
                >
                  <Bus size={16} />
                  <span className="hidden sm:inline">Bus</span>
                </Button>
                
                <Button
                  variant={transportMode === 'train' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleTransportModeChange('train')}
                >
                  <Train size={16} />
                  <span className="hidden sm:inline">Train</span>
                </Button>
                
                <Button
                  variant={transportMode === 'ship' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleTransportModeChange('ship')}
                >
                  <Ship size={16} />
                  <span className="hidden sm:inline">Bateau</span>
                </Button>
                
                <Button
                  variant={transportMode === 'plane' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleTransportModeChange('plane')}
                >
                  <Plane size={16} />
                  <span className="hidden sm:inline">Avion</span>
                </Button>
                
                <Button
                  variant={transportMode === 'carpool' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleTransportModeChange('carpool')}
                >
                  <Users size={16} />
                  <span className="hidden sm:inline">Co-voiturage</span>
                </Button>
              </div>
            </div>
            
            {/* Results count slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Nombre de résultats</label>
                <span className="text-sm font-medium text-blue-600">{resultsCount}</span>
              </div>
              
              <Slider
                value={[resultsCount]}
                min={1}
                max={10}
                step={1}
                onValueChange={(values) => setResultsCount(values[0])}
              />
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>1</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map & Results */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* View toggle */}
          <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-md">
            <div className="p-1 flex">
              <Button
                variant={view === 'map' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-3"
                onClick={() => setView('map')}
              >
                <MapIcon size={16} className="mr-1" />
                Carte
              </Button>
              
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-3"
                onClick={() => setView('list')}
              >
                <List size={16} className="mr-1" />
                Liste
              </Button>
            </div>
          </div>
          
          {/* Map view */}
          <div className={view === 'map' ? 'block h-full' : 'hidden'}>
            <Map
              results={searchResults}
              center={userLocation}
              radius={selectedDistance || 5}
              radiusUnit={distanceUnit}
              radiusType={filterMode}
              duration={selectedDuration || 15}
              transportMode={transportMode}
              isRecording={isRecording}
              onMicClick={handleMicClick}
              onLocationClick={handleLocationClick}
              isLocationActive={isLocationActive}
              loading={loading}
              showRoutes={true}
              onSearch={handleSearchPress}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              userLocation={userLocation}
            />
            
            {/* Results count indicator */}
            {searchResults.length > 0 && (
              <div className="absolute bottom-4 left-4 z-10">
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
                </Badge>
              </div>
            )}
          </div>
          
          {/* List view */}
          <div className={view === 'list' ? 'block h-full overflow-y-auto p-4' : 'hidden'}>
            <ResultsList
              results={searchResults}
              loading={loading}
              onResultClick={(result) => {
                // Handle result click
                toast.info(`Sélection: ${result.name}`);
                setView('map'); // Switch to map view to show the selected result
              }}
              userLocation={userLocation}
            />
          </div>
        </div>
      </div>
      
      {/* Flask server status indicator */}
      <div className="flask-server-status">
        <div className="status-indicator status-connected"></div>
        <span>Serveur connecté</span>
      </div>
    </div>
  );
};

export default SearchPage;
