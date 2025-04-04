
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import AddressSearch from '@/components/search/AddressSearch';
import { Button } from '@/components/ui/button';

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
  const transportModes = [
    { id: 'driving', name: 'Voiture', icon: '🚗' },
    { id: 'walking', name: 'À pied', icon: '🚶' },
    { id: 'cycling', name: 'Vélo', icon: '🚲' },
    { id: 'driving-traffic', name: 'Trafic', icon: '🚦' }
  ];

  return (
    <Card className="w-full shadow-md">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <AddressSearch 
            onAddressSelect={onAddressSelect}
            placeholder="Rechercher une adresse..." 
            userLocation={userLocation}
          />
          
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
                  size="sm"
                  onClick={() => onTransportModeChange(mode.id)}
                >
                  <span>{mode.icon}</span>
                  <span>{mode.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={onSearch}
          >
            Rechercher
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchBox;
