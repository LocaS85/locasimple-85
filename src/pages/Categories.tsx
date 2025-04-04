
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import CategoryGrid from '@/components/category/CategoryGrid';
import SubcategoryGrid from '@/components/category/SubcategoryGrid';
import EnhancedMapComponent from '@/components/map/EnhancedMapComponent';
import LocationSelector from '@/components/LocationSelector';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

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

// Transport mode options
const transportModes = [
  { id: 'driving', name: 'Voiture', icon: '🚗' },
  { id: 'walking', name: 'À pied', icon: '🚶' },
  { id: 'cycling', name: 'Vélo', icon: '🚲' },
  { id: 'driving-traffic', name: 'Trafic', icon: '🚦' }
];

const Categories = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState('grid');
  const [selectedLocations, setSelectedLocations] = useState<any[]>([]);
  const [transportMode, setTransportMode] = useState('driving');
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]); // Default to Paris

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
              <div className="lg:col-span-2">
                <EnhancedMapComponent 
                  selectedLocations={selectedLocations}
                  userLocation={userLocation}
                  transportMode={transportMode}
                />
                
                <div className="mt-4 bg-white p-4 rounded-lg shadow flex flex-wrap gap-3">
                  <p className="w-full font-medium mb-2">Mode de transport:</p>
                  {transportModes.map(mode => (
                    <Button
                      key={mode.id}
                      variant={transportMode === mode.id ? "default" : "outline"}
                      onClick={() => setTransportMode(mode.id)}
                      className="flex items-center gap-2"
                    >
                      <span>{mode.icon}</span>
                      <span>{mode.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <LocationSelector 
                  locations={mockLocations}
                  selectedLocations={selectedLocations}
                  onSelectionChange={setSelectedLocations}
                />
                
                <div className="mt-4 bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-3">Itinéraires ({selectedLocations.length})</h3>
                  {selectedLocations.length === 0 ? (
                    <p className="text-gray-500">Sélectionnez des lieux pour voir les itinéraires</p>
                  ) : (
                    <ul className="space-y-2">
                      {selectedLocations.map((location, index) => (
                        <li key={location.id} className="flex items-center gap-2">
                          <span className="bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span>{location.name}</span>
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
