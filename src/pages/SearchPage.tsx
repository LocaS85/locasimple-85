
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { MAPBOX_TOKEN } from '@/config/environment';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ResultsCountPopover } from '@/components/search/ResultsCountPopover';
import { DurationFilter } from '@/components/search/DurationFilter';
import { DistanceFilter } from '@/components/search/DistanceFilter';
import { SearchPanel } from '@/components/search/SearchPanel';
import LocationButton from '@/components/search/LocationButton';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

interface Place {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

const SearchPage = () => {
  const { t } = useLanguage();
  const [places, setPlaces] = useState<Place[]>([]);
  const [resultsCount, setResultsCount] = useState<number>(5);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(15);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(5);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const [viewport, setViewport] = useState({
    latitude: 48.8566, // Paris par défaut
    longitude: 2.3522,
    zoom: 12
  });
  
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLocationActive, setIsLocationActive] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]);
  const [isRecording, setIsRecording] = useState(false);
  const [transportMode, setTransportMode] = useState('driving');
  const [showMenu, setShowMenu] = useState(false);

  // Use geolocation hook
  const { activateGeolocation } = useGeolocation({
    setLoading,
    setIsLocationActive,
    setUserLocation
  });

  // Use voice recording hook
  const { handleMicClick } = useVoiceRecording({
    isRecording,
    setIsRecording,
    onTextResult: (text) => {
      setSearchQuery(text);
      // Trigger search with the transcribed text
      performSearch(text);
    }
  });

  const performSearch = (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    console.log(`Searching for: ${query}`);
    
    // Simulate search delay
    setTimeout(() => {
      // Update places based on search query (simulated)
      const newPlaces = [
        { id: '1', name: `${query} A`, lat: 48.857, lon: 2.353 },
        { id: '2', name: `${query} B`, lat: 48.858, lon: 2.354 },
        { id: '3', name: `${query} C`, lat: 48.856, lon: 2.351 },
        { id: '4', name: `${query} D`, lat: 48.855, lon: 2.356 },
        { id: '5', name: `${query} E`, lat: 48.859, lon: 2.358 },
      ];
      
      setPlaces(newPlaces);
      setLoading(false);
      toast.success(`5 résultats trouvés pour "${query}"`);
    }, 1000);
  };

  const handleLocationClick = () => {
    activateGeolocation();
    
    // If already active, toggle off
    if (isLocationActive) {
      setIsLocationActive(false);
    }
  };

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    // Vérifier le token Mapbox
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === '') {
      toast.error('Token Mapbox manquant. La carte ne fonctionnera pas correctement.');
    } else {
      console.log('SearchPage loaded with Mapbox token available');
      
      // Simuler la récupération des lieux selon une catégorie
      setPlaces([
        { id: '1', name: "Restaurant A", lat: 48.857, lon: 2.353 },
        { id: '2', name: "Restaurant B", lat: 48.858, lon: 2.354 },
        { id: '3', name: "Café C", lat: 48.856, lon: 2.351 },
        { id: '4', name: "Magasin D", lat: 48.855, lon: 2.356 },
        { id: '5', name: "Bar E", lat: 48.859, lon: 2.358 },
      ]);
    }
  }, []);

  // Update viewport when user location changes and is active
  useEffect(() => {
    if (isLocationActive && userLocation) {
      setViewport({
        latitude: userLocation[1],
        longitude: userLocation[0],
        zoom: 14
      });
    }
  }, [isLocationActive, userLocation]);

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="p-4 flex justify-between items-center bg-white shadow-sm z-10">
        <h1 className="text-xl font-bold">{t('search')}</h1>
        <div className="flex gap-2">
          <ResultsCountPopover 
            resultsCount={resultsCount} 
            onResultsCountChange={setResultsCount} 
          />
          <DurationFilter 
            selectedDuration={selectedDuration} 
            onDurationChange={setSelectedDuration} 
          />
          <DistanceFilter 
            selectedDistance={selectedDistance} 
            distanceUnit={distanceUnit} 
            onDistanceChange={setSelectedDistance} 
            onDistanceUnitChange={setDistanceUnit} 
          />
        </div>
      </div>
      
      <div className="flex-grow relative">
        {MAPBOX_TOKEN ? (
          <Map
            initialViewState={viewport}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
            onMove={evt => setViewport(evt.viewState)}
          >
            {places.slice(0, resultsCount).map((place) => (
              <Marker 
                key={place.id} 
                latitude={place.lat} 
                longitude={place.lon} 
                anchor="bottom"
              >
                <div className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm shadow-md">
                  {place.name}
                </div>
              </Marker>
            ))}
            
            {/* User location marker */}
            {isLocationActive && userLocation && (
              <Marker 
                latitude={userLocation[1]} 
                longitude={userLocation[0]} 
                anchor="center"
              >
                <div className="relative">
                  <div className="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping" />
                  <div className="relative bg-blue-500 border-2 border-white w-6 h-6 rounded-full" />
                </div>
              </Marker>
            )}
          </Map>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <p className="text-red-500">{t('mapbox_token_missing')}</p>
          </div>
        )}
        
        {/* Transparent Search Panel overlay */}
        <SearchPanel 
          query={searchQuery}
          setQuery={setSearchQuery}
          search={performSearch}
          isRecording={isRecording}
          onMicClick={handleMicClick}
          isLocationActive={isLocationActive}
          onLocationClick={handleLocationClick}
          loading={loading}
          transportMode={transportMode}
          onTransportModeChange={setTransportMode}
          onMenuClick={handleMenuClick}
        />
        
        {/* Location Button */}
        <LocationButton 
          loading={loading}
          isLocationActive={isLocationActive}
          onClick={handleLocationClick}
        />
      </div>
    </div>
  );
};

export default SearchPage;
