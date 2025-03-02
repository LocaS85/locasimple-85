
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SearchInput } from '@/components/search/SearchInput';
import { LocationButton } from '@/components/search/LocationButton';
import { CategoriesScroller } from '@/components/search/CategoriesScroller';
import { SelectedFilters } from '@/components/search/SelectedFilters';
import { SearchFooter } from '@/components/search/SearchFooter';
import { FiltersSection } from '@/components/search/FiltersSection';
import Map from '@/components/Map';
import type { Result } from '@/components/ResultsList';

const Search = () => {
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const [transportMode, setTransportMode] = useState('driving');
  const [resultsCount, setResultsCount] = useState(5);
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Result[]>([]);
  
  const handleMicClick = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      console.log("Démarrage de l'enregistrement...");
      // Code pour démarrer l'enregistrement
    } else {
      console.log("Arrêt de l'enregistrement...");
      // Code pour arrêter l'enregistrement
    }
  };
  
  const handleSearch = (query: string) => {
    setLoading(true);
    console.log(`Searching for: ${query}`);
    // Simulate search
    setTimeout(() => {
      setLoading(false);
      // Simuler des résultats de recherche
      const mockResults: Result[] = [
        {
          id: '1',
          name: 'Café Paris',
          address: '123 rue de Paris',
          distance: 0.8,
          duration: 12,
          category: 'restaurant',
          color: 'blue',
          latitude: 48.8566 + 0.01,
          longitude: 2.3522 + 0.01,
          rating: 4.5,
          openingHours: 'Ouvert jusqu\'à 22h'
        },
        {
          id: '2',
          name: 'Supermarché Express',
          address: '45 avenue Victor Hugo',
          distance: 1.2,
          duration: 18,
          category: 'shopping',
          color: 'green',
          latitude: 48.8566 - 0.008,
          longitude: 2.3522 + 0.015,
          rating: 3.8,
          openingHours: 'Ouvert 24/7'
        },
        {
          id: '3',
          name: 'Parc Central',
          address: 'Place de la République',
          distance: 2.5,
          duration: 25,
          category: 'loisirs',
          color: 'red',
          latitude: 48.8566 + 0.02,
          longitude: 2.3522 - 0.01,
          rating: 4.2
        }
      ];
      setSearchResults(mockResults);
    }, 1000);
  };

  const handleLocationClick = () => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
          console.log("Location updated:", position.coords);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
    
    // Effectuer une recherche initiale
    handleSearch('');
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with title */}
      <div className="bg-black text-white p-4 flex justify-center items-center">
        <h1 className="text-xl font-bold">{t('search_title')}</h1>
      </div>
      
      {/* Search and location section */}
      <div className="px-4 py-3 flex flex-col gap-2 sm:flex-row sm:justify-between">
        <div className="w-full sm:w-1/2">
          <SearchInput 
            searchQuery={searchQuery}
            isRecording={isRecording}
            onSearchChange={(query) => {
              setSearchQuery(query);
              handleSearch(query);
            }}
            onMicClick={handleMicClick}
          />
        </div>
        <LocationButton onLocationClick={handleLocationClick} />
      </div>
      
      {/* Categories section */}
      <CategoriesScroller />
      
      {/* Map section - now placed above filters */}
      <div className="px-4 py-3">
        <div className="rounded-lg overflow-hidden aspect-video">
          <Map 
            results={searchResults} 
            center={userLocation}
            radius={selectedDistance || 5}
            radiusUnit={distanceUnit}
            radiusType={selectedDuration ? 'duration' : 'distance'}
            duration={selectedDuration || 15}
            timeUnit="minutes"
            transportMode={transportMode}
          />
        </div>
      </div>
      
      {/* Filters section - now extracted to a separate component */}
      <FiltersSection 
        resultsCount={resultsCount}
        onResultsCountChange={setResultsCount}
        transportMode={transportMode}
        onTransportModeChange={setTransportMode}
        selectedDuration={selectedDuration}
        onDurationChange={setSelectedDuration}
        selectedDistance={selectedDistance}
        distanceUnit={distanceUnit}
        onDistanceChange={setSelectedDistance}
        onDistanceUnitChange={setDistanceUnit}
      />
      
      {/* Display selected filters */}
      <SelectedFilters 
        selectedDuration={selectedDuration}
        selectedDistance={selectedDistance}
        distanceUnit={distanceUnit}
        transportMode={transportMode}
        resultsCount={resultsCount}
      />
      
      {/* Footer navigation */}
      <SearchFooter />
    </div>
  );
};

export default Search;
