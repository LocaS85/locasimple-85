
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Result } from '@/components/ResultsList';
import { SearchControls } from '@/components/search/SearchControls';
import { SearchMenu } from '@/components/search/SearchMenu';

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
  const [isLocationActive, setIsLocationActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Result[]>([]);
  const [menuOpen, setMenuOpen] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  
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
    setIsLocationActive(prevState => !prevState);
    
    if (!isLocationActive) {
      if (navigator.geolocation) {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation([position.coords.longitude, position.coords.latitude]);
            console.log("Location updated:", position.coords);
            setLoading(false);
          },
          (error) => {
            console.error('Error getting location:', error);
            setLoading(false);
            setIsLocationActive(false);
          }
        );
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (menuRef.current) {
      setDragging(true);
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || !menuRef.current) return;
    
    const currentY = e.touches[0].clientY;
    const diff = startY - currentY;
    
    if (Math.abs(diff) > 30) {
      if (diff > 0 && !menuOpen) {
        setMenuOpen(true);
      } else if (diff < 0 && menuOpen) {
        setMenuOpen(false);
      }
      setDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  const handleMapInteraction = () => {
    if (menuOpen) {
      setMenuOpen(false);
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
    
    handleSearch('');
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="bg-black text-white p-4 flex justify-center items-center z-10">
        <h1 className="text-xl font-bold">{t('search_title')}</h1>
      </div>
      
      <div className="flex-grow relative" onClick={handleMapInteraction}>
        <SearchControls
          searchResults={searchResults}
          userLocation={userLocation}
          selectedDistance={selectedDistance}
          selectedDuration={selectedDuration}
          distanceUnit={distanceUnit}
          transportMode={transportMode}
          searchQuery={searchQuery}
          isRecording={isRecording}
          isLocationActive={isLocationActive}
          onSearchChange={setSearchQuery}
          onMicClick={handleMicClick}
          onLocationClick={handleLocationClick}
          handleSearch={handleSearch}
        />
      </div>
      
      <SearchMenu 
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        menuRef={menuRef}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
        selectedDuration={selectedDuration}
        selectedDistance={selectedDistance}
        distanceUnit={distanceUnit}
        transportMode={transportMode}
        resultsCount={resultsCount}
        onResultsCountChange={setResultsCount}
        onTransportModeChange={setTransportMode}
        onDurationChange={setSelectedDuration}
        onDistanceChange={setSelectedDistance}
        onDistanceUnitChange={setDistanceUnit}
      />
    </div>
  );
};

export default Search;
