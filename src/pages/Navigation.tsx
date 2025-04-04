
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Compass, Map, List, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import EnhancedMapComponent from '@/components/map/EnhancedMapComponent';

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
  
  // Get location data from navigation state, if available
  useEffect(() => {
    if (location.state) {
      const { start, end, placeName, transportMode: initialMode } = location.state;
      
      if (start && Array.isArray(start) && start.length === 2) {
        setUserLocation(start);
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
        />
      </div>
      
      {/* Bottom sheet with navigation instructions */}
      <div className="bg-white p-4 shadow-md border-t">
        <div className="flex items-center justify-between">
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
      </div>
    </div>
  );
};

export default Navigation;
