
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import AddressSearch from '@/components/search/AddressSearch';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Search, MapPin } from 'lucide-react';

interface SearchBoxProps {
  searchRadius: number;
  onRadiusChange: (value: number[]) => void;
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
  onAddressSelect: (location: { name: string; longitude: number; latitude: number }) => void;
  userLocation: [number, number];
  onSearch: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchRadius,
  onRadiusChange,
  transportMode,
  onTransportModeChange,
  onAddressSelect,
  userLocation,
  onSearch
}) => {
  const isMobile = useIsMobile();
  const transportModes = [
    { id: 'driving', name: 'Voiture', icon: '🚗' },
    { id: 'walking', name: 'À pied', icon: '🚶' },
    { id: 'cycling', name: 'Vélo', icon: '🚲' },
    { id: 'driving-traffic', name: 'Trafic', icon: '🚦' }
  ];

  return (
    <Card className="w-full shadow-md">
      <CardContent className={isMobile ? "pt-3 px-3" : "pt-4"}>
        <div className="space-y-4">
          <div className="relative">
            <AddressSearch 
              onAddressSelect={onAddressSelect}
              placeholder="Rechercher une adresse..." 
              userLocation={userLocation}
            />
            <Button 
              size="icon" 
              className="absolute right-1 top-1 h-8 w-8"
              variant="ghost"
              onClick={() => {
                // This would typically use geolocation to set current position
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    onAddressSelect({
                      name: "Ma position actuelle",
                      longitude: position.coords.longitude,
                      latitude: position.coords.latitude
                    });
                  },
                  (error) => {
                    console.error("Error getting location:", error);
                  }
                );
              }}
              title="Utiliser ma position actuelle"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Rayon de recherche</span>
              <span className="text-sm text-blue-600 font-medium">{searchRadius} km</span>
            </div>
            <Slider 
              defaultValue={[5]} 
              max={50} 
              step={1} 
              value={[searchRadius]}
              onValueChange={onRadiusChange}
              className="w-full"
            />
          </div>
          
          <div>
            <span className="text-sm font-medium block mb-2">Mode de transport</span>
            <div className="flex flex-wrap gap-2">
              {transportModes.map(mode => (
                <Button
                  key={mode.id}
                  variant={transportMode === mode.id ? "default" : "outline"}
                  className="flex items-center gap-1"
                  size={isMobile ? "sm" : "sm"}
                  onClick={() => onTransportModeChange(mode.id)}
                >
                  <span>{mode.icon}</span>
                  <span className={isMobile ? "text-xs" : "text-sm"}>{mode.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={onSearch}
          >
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchBox;
