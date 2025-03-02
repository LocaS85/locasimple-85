
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SearchInput } from '@/components/search/SearchInput';
import { LocationButton } from '@/components/search/LocationButton';
import { CategoriesScroller } from '@/components/search/CategoriesScroller';
import { ResultsCountPopover } from '@/components/search/ResultsCountPopover';
import { TransportModeSelector } from '@/components/menu/TransportModeSelector';
import { DurationFilter } from '@/components/search/DurationFilter';
import { DistanceFilter } from '@/components/search/DistanceFilter';
import { SelectedFilters } from '@/components/search/SelectedFilters';
import { SearchFooter } from '@/components/search/SearchFooter';

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
            onSearchChange={setSearchQuery}
            onMicClick={handleMicClick}
          />
        </div>
        <LocationButton onLocationClick={handleLocationClick} />
      </div>
      
      {/* Categories section */}
      <CategoriesScroller />
      
      {/* Additional filters */}
      <div className="px-4 py-3 flex flex-col gap-3">
        <ResultsCountPopover 
          resultsCount={resultsCount}
          onResultsCountChange={setResultsCount}
        />
        
        <div className="w-full border-2 border-black rounded-full bg-white text-black">
          <TransportModeSelector 
            transportMode={transportMode} 
            onTransportModeChange={setTransportMode} 
          />
        </div>
        
        <div className="flex justify-between gap-4">
          <div className="w-1/2">
            <DurationFilter 
              selectedDuration={selectedDuration}
              onDurationChange={setSelectedDuration}
            />
          </div>
          <div className="w-1/2">
            <DistanceFilter 
              selectedDistance={selectedDistance}
              distanceUnit={distanceUnit}
              onDistanceChange={setSelectedDistance}
              onDistanceUnitChange={setDistanceUnit}
            />
          </div>
        </div>
      </div>
      
      {/* Display selected filters */}
      <SelectedFilters 
        selectedDuration={selectedDuration}
        selectedDistance={selectedDistance}
        distanceUnit={distanceUnit}
        transportMode={transportMode}
        resultsCount={resultsCount}
      />
      
      {/* Map placeholder */}
      <div className="px-4 py-3">
        <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
          <p className="text-gray-600">Carte en chargement...</p>
        </div>
      </div>
      
      {/* Footer navigation */}
      <SearchFooter />
    </div>
  );
};

export default Search;
