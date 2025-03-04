
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Result } from '@/components/ResultsList';
import { SearchControls } from '@/components/search/SearchControls';
import { SearchMenu } from '@/components/search/SearchMenu';
import { SearchButton } from '@/components/search/SearchButton';
import { LocationButton } from '@/components/search/LocationButton';
import { generateFilteredMockResults } from '@/data/mockSearchResults';
import { useSearchLocation } from '@/components/search/SearchLocation';
import { useSearchHandler } from '@/components/search/SearchHandler';
import { useSearchMenuHandler } from '@/components/search/SearchMenuHandler';
import { useVoiceRecorder } from '@/components/search/VoiceRecorder';
import { toast } from 'sonner';

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState<string | undefined>();
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { handleMicClick } = useVoiceRecorder(isRecording, setIsRecording);
  
  const { handleLocationClick, searchAddress } = useSearchLocation(
    isLocationActive,
    loading,
    setLoading,
    setIsLocationActive,
    setUserLocation
  );
  
  const { handleSearch } = useSearchHandler({
    searchQuery,
    selectedCategory,
    selectedDistance,
    selectedDuration,
    distanceUnit,
    transportMode,
    userLocation,
    resultsCount,
    setLoading,
    setSearchResults,
    showRoutes,
    setShowRoutes,
    setSearchPerformed
  });
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  
  const { 
    handleTouchStart, 
    handleTouchMove, 
    handleTouchEnd, 
    handleMapInteraction 
  } = useSearchMenuHandler({
    menuRef,
    menuOpen,
    setMenuOpen,
    setDragging,
    setStartY,
    dragging,
    startY
  });

  const handleSearchPress = async () => {
    if (searchQuery.trim() && !searchPerformed) {
      setLoading(true);
      await searchAddress(searchQuery);
      setLoading(false);
    }
    
    setSelectedResultId(undefined);
    
    handleSearch();
  };
  
  const handleResultClick = (result: Result) => {
    setSelectedResultId(prev => prev === result.id ? undefined : result.id);
    
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions && navigator.permissions.query({name: 'geolocation'})
        .then(permission => {
          if (permission.state === 'granted') {
            toast.info('Accès à la géolocalisation accordé');
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setUserLocation([position.coords.longitude, position.coords.latitude]);
                setIsLocationActive(true);
              },
              (error) => {
                console.error('Error getting location:', error);
              }
            );
          } else if (permission.state === 'prompt') {
            toast.info('Cliquez sur "Ma position" pour activer la géolocalisation');
          } else if (permission.state === 'denied') {
            toast.error('Accès à la géolocalisation refusé. Veuillez l\'activer dans vos paramètres');
          }
          
          permission.addEventListener('change', () => {
            if (permission.state === 'granted') {
              toast.success('Accès à la géolocalisation accordé');
            } else if (permission.state === 'denied') {
              toast.error('Accès à la géolocalisation refusé');
              setIsLocationActive(false);
            }
          });
        })
        .catch(error => {
          console.error('Error checking geolocation permission:', error);
        });
    }
    
    const initialResults = generateFilteredMockResults('', userLocation, {}, resultsCount);
    setSearchResults(initialResults);
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
          loading={loading}
          onSearchChange={handleSearchChange}
          onMicClick={handleMicClick}
          onLocationClick={handleLocationClick}
          handleSearch={handleSearchPress}
          showRoutes={showRoutes}
          selectedResultId={selectedResultId}
          onResultClick={handleResultClick}
        />
        
        <LocationButton 
          loading={loading}
          isLocationActive={isLocationActive}
          onClick={handleLocationClick}
        />
        
        <SearchButton 
          loading={loading}
          onClick={handleSearchPress}
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
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        searchResults={searchResults}
        selectedResultId={selectedResultId}
        onResultClick={handleResultClick}
        onSearch={handleSearchPress}
      />
    </div>
  );
};

export default Search;
