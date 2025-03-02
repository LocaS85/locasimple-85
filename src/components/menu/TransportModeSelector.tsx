
import React from 'react';
import { Car, PersonStanding, Bike, Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransportMode {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const transportModes: TransportMode[] = [
  { id: 'driving', name: 'Voiture', icon: <Car className="h-4 w-4" /> },
  { id: 'walking', name: 'À pied', icon: <PersonStanding className="h-4 w-4" /> },
  { id: 'cycling', name: 'Vélo', icon: <Bike className="h-4 w-4" /> },
  { id: 'transit', name: 'Transport', icon: <Bus className="h-4 w-4" /> },
];

interface TransportModeSelectorProps {
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
}

export const TransportModeSelector: React.FC<TransportModeSelectorProps> = ({
  transportMode,
  onTransportModeChange
}) => {
  return (
    <>
      <h3 className="text-sm font-medium mb-2">Transport</h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {transportModes.map((mode) => (
          <Button 
            key={mode.id} 
            variant={transportMode === mode.id ? 'default' : 'outline'} 
            className="flex-shrink-0"
            onClick={() => onTransportModeChange(mode.id)}
          >
            {mode.icon}
            <span>{mode.name}</span>
          </Button>
        ))}
      </div>
    </>
  );
};
