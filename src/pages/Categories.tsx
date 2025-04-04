
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import CategoryGrid from '@/components/category/CategoryGrid';
import SubcategoryGrid from '@/components/category/SubcategoryGrid';
import EnhancedMapComponent from '@/components/map/EnhancedMapComponent';
import LocationSelector from '@/components/LocationSelector';
import SearchBox from '@/components/search/SearchBox';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import AddressSearch from '@/components/search/AddressSearch';

// Mock data for demo purposes
const mockLocations = [
  {
    id: '1',
    name: 'Bureau Principal',
    latitude: 48.8566,
    longitude: 2.3522,
    category: 'travail',
    address: '12 Rue du Travail, Paris'
  },
  {
    id: '2',
    name: 'Maison des parents',
    latitude: 48.85,
    longitude: 2.34,
    category: 'famille',
    address: '45 Rue de la Famille, Paris'
  },
  {
    id: '3',
    name: 'Restaurant favori',
    latitude: 48.86,
    longitude: 2.33,
    category: 'alimentation',
    address: '78 Avenue de la Gastronomie, Paris'
  },
  {
    id: '4',
    name: 'Pharmacie',
    latitude: 48.87,
    longitude: 2.35,
    category: 'sante',
    address: '23 Boulevard Santé, Paris'
  },
  {
    id: '5',
    name: 'Cinéma',
    latitude: 48.88,
    longitude: 2.36,
    category: 'divertissement',
    address: '56 Rue du Cinéma, Paris'
  },
  {
    id: '6',
    name: 'Centre commercial',
    latitude: 48.855,
    longitude: 2.345,
    category: 'shopping',
    address: '101 Avenue du Shopping, Paris'
  },
  {
    id: '7',
    name: 'Hôtel de voyage',
    latitude: 48.865,
    longitude: 2.355,
    category: 'hotels',
    address: '87 Rue de l\'Hôtel, Paris'
  }
];

const Categories = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState('grid');
  const [selectedLocations, setSelectedLocations] = useState<any[]>([]);
  const [transportMode, setTransportMode] = useState('driving');
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]); // Default to Paris
  const [searchRadius, setSearchRadius] = useState<number>(5);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  // Check if we're on the map view route
  useEffect(() => {
    if (location.pathname.includes('map')) {
      setActiveView('map');
    } else {
      setActiveView('grid');
    }
  }, [location.pathname]);

  const handleRadiusChange = (value: number[]) => {
    setSearchRadius(value[0]);
  };

  const handleAddressSelect = (location: { name: string; longitude: number; latitude: number }) => {
    setUserLocation([location.longitude, location.latitude]);
  };

  const handleSearch = () => {
    // This would typically filter locations based on radius, but for demo we'll just log
    console.log(`Searching within ${searchRadius}km of [${userLocation}] using ${transportMode} mode`);
  };

  return (
    <motion.div 
      className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto py-6 px-4 space-y-6">
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="grid">Catégories</TabsTrigger>
              <TabsTrigger value="map">Carte Interactive</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="grid" className="mt-6">
            <Routes>
              <Route path="/" element={<CategoryGrid />} />
              <Route path="/:categoryId" element={<SubcategoryGrid />} />
            </Routes>
          </TabsContent>
          
          <TabsContent value="map" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-6">
                <SearchBox 
                  searchRadius={searchRadius}
                  onRadiusChange={handleRadiusChange}
                  transportMode={transportMode}
                  onTransportModeChange={setTransportMode}
                  onAddressSelect={handleAddressSelect}
                  userLocation={userLocation}
                  onSearch={handleSearch}
                />
                
                <LocationSelector 
                  locations={mockLocations}
                  selectedLocations={selectedLocations}
                  onSelectionChange={setSelectedLocations}
                />
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px]">
                  <EnhancedMapComponent 
                    selectedLocations={selectedLocations}
                    userLocation={userLocation}
                    transportMode={transportMode}
                    searchRadius={searchRadius}
                  />
                </div>
                
                <div className="mt-4 bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium mb-0">Itinéraires ({selectedLocations.length})</h3>
                    {selectedLocations.length > 0 && (
                      <Button variant="outline" size="sm">
                        Exporter les itinéraires
                      </Button>
                    )}
                  </div>
                  
                  {selectedLocations.length === 0 ? (
                    <p className="text-gray-500 my-2">Sélectionnez des lieux pour voir les itinéraires</p>
                  ) : (
                    <ul className="space-y-2 mt-3">
                      {selectedLocations.map((location, index) => (
                        <li key={location.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <div className="flex-grow">
                            <span className="font-medium">{location.name}</span>
                            <div className="text-xs text-gray-500">{location.address}</div>
                          </div>
                          <div className="text-xs text-gray-600 whitespace-nowrap">
                            {transportMode === 'driving' && '🚗'}
                            {transportMode === 'walking' && '🚶'}
                            {transportMode === 'cycling' && '🚲'}
                            {/* For demo purposes only. Real durations would come from routing API */}
                            {Math.round(Math.random() * 30 + 5)} min
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Categories;
