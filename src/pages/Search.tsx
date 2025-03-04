
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Result } from '@/components/ResultsList';
import { SearchControls } from '@/components/search/SearchControls';
import { SearchMenu } from '@/components/search/SearchMenu';
import { SearchButton } from '@/components/search/SearchButton';
import { generateFilteredMockResults } from '@/data/mockSearchResults';
import { useSearchLocation } from '@/components/search/SearchLocation';
import { useSearchHandler } from '@/components/search/SearchHandler';
import { useSearchMenuHandler } from '@/components/search/SearchMenuHandler';
import { useVoiceRecorder } from '@/components/search/VoiceRecorder';

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
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Voice recording handler
  const { handleMicClick } = useVoiceRecorder(isRecording, setIsRecording);
  
  // Location handler
  const { handleLocationClick } = useSearchLocation(
    isLocationActive,
    loading,
    setLoading,
    setIsLocationActive,
    setUserLocation
  );
  
  // Search handler
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
    setSearchResults
  });
  
  // Menu touch handler
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
    
    // Use the mock data generator for initial results
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
          onSearchChange={setSearchQuery}
          onMicClick={handleMicClick}
          onLocationClick={handleLocationClick}
          handleSearch={handleSearch}
        />
        
        <SearchButton 
          loading={loading}
          onClick={() => handleSearch()}
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
      />
    </div>
  );
};

export default Search;
