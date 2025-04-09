
import React, { useState, useEffect } from 'react';
import { MapProvider } from '@/contexts/MapContext';
import { BaseMap } from '@/components/map/BaseMap';
import { GeoIntelligentSearch } from '@/components/search/GeoIntelligentSearch';
import { LayerManager, COMMERCE_LAYER } from '@/components/map/LayerManager';
import { useMapContext } from '@/contexts/MapContext';
import { SearchIntent, LocationSuggestion, MapFeature } from '@/types/search';
import { toast } from 'sonner';
import { useSearchPageStateManager } from '@/hooks/useSearchPageStateManager';
import { MapResultsSection } from '@/components/search-page/MapResultsSection';

// Mock location suggestions function - would be replaced with real API calls
const getMockLocationSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: '1',
      name: `${query} - Paris Center`,
      address: 'Centre de Paris, France',
      coordinates: [2.3522, 48.8566],
      type: 'poi',
      relevance: 0.95
    },
    {
      id: '2',
      name: `${query} - Near Eiffel Tower`,
      address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
      coordinates: [2.2945, 48.8584],
      type: 'address',
      relevance: 0.9
    },
    {
      id: '3',
      name: `${query} - Montmartre Area`,
      address: 'Montmartre, 75018 Paris, France',
      coordinates: [2.3431, 48.8865],
      type: 'region',
      relevance: 0.85
    }
  ];
};

// MapContent component to separate the map-specific logic
const MapContent = () => {
  const { map, setSelectedFeature } = useMapContext();
  const [layers, setLayers] = useState([COMMERCE_LAYER]);
  
  const handleFeatureSelect = (feature: MapFeature) => {
    setSelectedFeature(feature);
    toast.info(`Selected: ${feature.properties.name}`);
  };
  
  return (
    <>
      <BaseMap />
      {map && (
        <LayerManager
          map={map}
          layers={layers}
          onFeatureSelect={handleFeatureSelect}
        />
      )}
    </>
  );
};

// Main SearchPage component
const SearchPage = () => {
  const [searchIntent, setSearchIntent] = useState<SearchIntent | null>(null);
  const searchStateManager = useSearchPageStateManager();
  
  const handleIntentDetected = (intent: SearchIntent) => {
    setSearchIntent(intent);
    console.log('Detected intent:', intent);
  };
  
  const handleLocationSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
    try {
      return await getMockLocationSuggestions(query);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      toast.error('Erreur lors de la recherche de suggestions');
      return [];
    }
  };

  return (
    <MapProvider>
      <div className="flex flex-col h-screen">
        {/* Header with search bar */}
        <div className="p-4 bg-white shadow-md z-10">
          <GeoIntelligentSearch 
            onIntentDetected={handleIntentDetected}
            onLocationSuggest={handleLocationSuggestions}
          />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50">
          {/* Filters section */}
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-3">Filtres</h2>
              {/* Category filter buttons would go here */}
              <div className="space-y-2">
                <button className="w-full py-2 px-4 text-left rounded bg-blue-50 text-blue-600 hover:bg-blue-100">
                  Restaurants
                </button>
                <button className="w-full py-2 px-4 text-left rounded hover:bg-gray-100">
                  Hôtels
                </button>
                <button className="w-full py-2 px-4 text-left rounded hover:bg-gray-100">
                  Attractions
                </button>
                <button className="w-full py-2 px-4 text-left rounded hover:bg-gray-100">
                  Services
                </button>
              </div>
              
              {/* Distance filter would go here */}
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Distance</h3>
                {/* Distance slider would go here */}
                <div className="h-8 bg-gray-100 rounded-full">
                  {/* Placeholder for slider */}
                </div>
              </div>
              
              {/* Additional filters would go here */}
            </div>
          </div>
          
          {/* Map and results section */}
          <div className="md:col-span-8 lg:col-span-9">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-[500px]">
              <MapContent />
            </div>
            
            {/* Results list would go here */}
            <div className="mt-4 bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-3">Résultats</h2>
              <div className="space-y-2">
                {/* Results would be populated dynamically */}
                <p className="text-gray-500">Effectuez une recherche pour voir les résultats</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MapProvider>
  );
};

export default SearchPage;
