
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Compass, Map, List, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import EnhancedMapComponent from '@/components/map/EnhancedMapComponent';
import { Slider } from '@/components/ui/slider';

const transportModes = [
  { id: 'driving', name: 'Voiture', icon: '🚗' },
  { id: 'walking', name: 'À pied', icon: '🚶' },
  { id: 'cycling', name: 'Vélo', icon: '🚲' },
  { id: 'driving-traffic', name: 'Trafic', icon: '🚦' }
];

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [transportMode, setTransportMode] = useState('driving');
  const [destination, setDestination] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]); // Default to Paris
  const [searchRadius, setSearchRadius] = useState<number>(5); // Default 5km radius
  
  // Get location data from navigation state, if available
  useEffect(() => {
    if (location.state) {
      const { start, end, placeName, transportMode: initialMode } = location.state;
      
      if (start && Array.isArray(start) && start.length === 2) {
        // Fix the type issue by explicitly setting as [number, number]
        setUserLocation([start[0], start[1]]);
      }
      
      if (end && Array.isArray(end) && end.length === 2 && placeName) {
        setDestination({
          id: 'destination',
          name: placeName,
          latitude: end[1],
          longitude: end[0],
          category: 'destination',
        });
      }
      
      if (initialMode) {
        setTransportMode(initialMode);
      }
    }
  }, [location.state]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation && !location.state?.start) {
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

  // Handle radius change
  const handleRadiusChange = (value: number[]) => {
    setSearchRadius(value[0]);
  };
  
  return (
    <div className="flex flex-col h-screen">
      <div className="absolute top-0 left-0 z-10 p-4">
        <Button 
          variant="outline"
          size="icon"
          className="bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 shadow-md"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 text-app-dark" />
        </Button>
      </div>
      
      {/* Transport mode selector */}
      <div className="absolute top-0 right-0 z-10 p-4">
        <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md flex">
          {transportModes.map(mode => (
            <Button
              key={mode.id}
              variant={transportMode === mode.id ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={() => setTransportMode(mode.id)}
              title={mode.name}
            >
              <span>{mode.icon}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex-grow">
        <EnhancedMapComponent 
          selectedLocations={destination ? [destination] : []}
          userLocation={userLocation}
          transportMode={transportMode}
          searchRadius={searchRadius}
        />
      </div>
      
      {/* Bottom sheet with navigation instructions and radius slider */}
      <div className="bg-white p-4 shadow-md border-t">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-medium">
              {destination ? `Itinéraire vers ${destination.name}` : 'Navigation'}
            </h2>
            <p className="text-sm text-gray-500">
              {destination ? 'Suivez les indications pour arriver à destination' : 'Sélectionnez une destination'}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Radius slider */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Rayon de recherche</span>
            <span className="text-sm text-blue-600 font-medium">{searchRadius} km</span>
          </div>
          <Slider 
            defaultValue={[5]} 
            max={50} 
            step={1} 
            value={[searchRadius]}
            onValueChange={handleRadiusChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
