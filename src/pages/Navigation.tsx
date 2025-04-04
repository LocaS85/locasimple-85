
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Compass, Map, List, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import EnhancedMapComponent from '@/components/map/EnhancedMapComponent';
import { Slider } from '@/components/ui/slider';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import AddressSearch from '@/components/search/AddressSearch';
import { cn } from '@/lib/utils';

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
  const isMobile = useIsMobile();
  const [transportMode, setTransportMode] = useState('driving');
  const [destination, setDestination] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]); // Default to Paris
  const [searchRadius, setSearchRadius] = useState<number>(5); // Default 5km radius
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(true);
  const [directions, setDirections] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  
  // Get location data from navigation state, if available
  useEffect(() => {
    if (location.state) {
      const { start, end, placeName, transportMode: initialMode } = location.state;
      
      if (start && Array.isArray(start) && start.length === 2) {
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
          toast.error("Impossible d'obtenir votre position actuelle");
        }
      );
    }
  }, []);

  // Fetch route and update estimated time when destination or mode changes
  useEffect(() => {
    if (destination && userLocation) {
      // Calculate estimated time based on transport mode
      const fetchRouteInformation = async () => {
        try {
          // This could be integrated with your actual API service
          const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${userLocation[0]},${userLocation[1]};${destination.longitude},${destination.latitude}?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
          );
          
          if (!response.ok) throw new Error('Failed to fetch route');
          
          const data = await response.json();
          if (data.routes && data.routes.length > 0) {
            // Convert seconds to minutes and round
            const timeInMinutes = Math.round(data.routes[0].duration / 60);
            setEstimatedTime(timeInMinutes);
            setDirections(data.routes[0]);
          }
        } catch (error) {
          console.error('Error fetching route:', error);
        }
      };
      
      fetchRouteInformation();
    }
  }, [destination, transportMode, userLocation]);

  // Handle radius change
  const handleRadiusChange = (value: number[]) => {
    setSearchRadius(value[0]);
  };

  // Handle address selection
  const handleAddressSelect = (location: { name: string; longitude: number; latitude: number }) => {
    setDestination({
      id: 'selected-destination',
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      category: 'destination',
    });
    toast.success(`Destination définie: ${location.name}`);
  };

  // Toggle bottom sheet
  const toggleBottomSheet = () => {
    setShowBottomSheet(!showBottomSheet);
  };

  // Toggle expanded view
  const toggleExpandedView = () => {
    setIsExpanded(!isExpanded);
  };

  // Share current navigation
  const shareNavigation = () => {
    if (!destination) {
      toast.error("Aucune destination à partager");
      return;
    }
    
    // Create shareable Google Maps URL
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[1]},${userLocation[0]}&destination=${destination.latitude},${destination.longitude}&travelmode=${transportMode === 'driving-traffic' ? 'driving' : transportMode}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Itinéraire vers ${destination.name}`,
        text: `Voici l'itinéraire vers ${destination.name}`,
        url: googleMapsUrl
      }).catch(err => {
        console.error('Error sharing:', err);
        // Fallback
        navigator.clipboard.writeText(googleMapsUrl);
        toast.success("Lien copié dans le presse-papier");
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(googleMapsUrl);
      toast.success("Lien copié dans le presse-papier");
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Top navigation bar */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
        <Button 
          variant="outline"
          size="icon"
          className="bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 shadow-md"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 text-app-dark" />
        </Button>
        
        {/* Address search - always visible on desktop, hidden in mobile when expanded view */}
        <div className={cn(
          "mx-2 flex-grow max-w-md transition-all duration-300",
          (isMobile && isExpanded) ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          <AddressSearch 
            onAddressSelect={handleAddressSelect}
            placeholder="Rechercher une destination..." 
            userLocation={userLocation}
          />
        </div>
        
        {/* Transport mode selector */}
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
      
      {/* Map container */}
      <div className="flex-grow relative">
        <EnhancedMapComponent 
          selectedLocations={destination ? [destination] : []}
          userLocation={userLocation}
          transportMode={transportMode}
          searchRadius={searchRadius}
        />
        
        {/* Floating expand/collapse button for mobile */}
        {isMobile && (
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-32 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 shadow-md"
            onClick={toggleExpandedView}
          >
            {isExpanded ? <Compass className="h-5 w-5" /> : <Map className="h-5 w-5" />}
          </Button>
        )}
      </div>
      
      {/* Bottom sheet with navigation instructions and radius slider */}
      <div 
        className={cn(
          "bg-white p-4 shadow-md border-t transition-all duration-300 ease-in-out",
          !showBottomSheet && "translate-y-full",
          isExpanded && !isMobile && "h-1/2",
          isExpanded && isMobile && "h-3/4",
          !isExpanded && "max-h-48"
        )}
      >
        {/* Pull handle for mobile - shows only when not expanded */}
        {isMobile && (
          <div 
            className="w-full flex justify-center mb-2 cursor-pointer" 
            onClick={toggleBottomSheet}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-medium">
              {destination ? `Itinéraire vers ${destination.name}` : 'Navigation'}
            </h2>
            <p className="text-sm text-gray-500">
              {destination 
                ? `${estimatedTime ? `${estimatedTime} min · ` : ''}Suivez les indications` 
                : 'Sélectionnez une destination'}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full" onClick={toggleExpandedView}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" onClick={shareNavigation}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Destination details - only shown when expanded */}
        {isExpanded && destination && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center text-lg">
                {transportMode === 'driving' && '🚗'}
                {transportMode === 'walking' && '🚶'}
                {transportMode === 'cycling' && '🚲'}
                {transportMode === 'driving-traffic' && '🚦'}
              </div>
              <div>
                <div className="font-medium">{destination.name}</div>
                <div className="text-sm text-gray-500">
                  {estimatedTime ? `${estimatedTime} min` : 'Calcul en cours...'}
                </div>
              </div>
            </div>
          </div>
        )}
        
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
