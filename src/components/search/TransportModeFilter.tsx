
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, PersonStanding, Bike, Train } from 'lucide-react';

export interface TransportModeFilterProps {
  selectedMode?: string;
  onModeChange?: (mode: string) => void;
}

export const TransportModeFilter: React.FC<TransportModeFilterProps> = ({
  selectedMode = 'driving',
  onModeChange = () => {}
}) => {
  const transportModes = [
    { id: 'driving', icon: <Car className="h-4 w-4" />, label: 'Voiture' },
    { id: 'walking', icon: <PersonStanding className="h-4 w-4" />, label: 'À pied' },
    { id: 'bicycling', icon: <Bike className="h-4 w-4" />, label: 'Vélo' },
    { id: 'transit', icon: <Train className="h-4 w-4" />, label: 'Transport' }
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 mb-1.5">Mode de transport</h3>
      <div className="grid grid-cols-4 gap-1">
        {transportModes.map((mode) => (
          <Button
            key={mode.id}
            type="button"
            variant={selectedMode === mode.id ? 'default' : 'outline'}
            className="h-8 px-2"
            onClick={() => onModeChange(mode.id)}
            title={mode.label}
          >
            <div className="flex flex-col items-center">
              {mode.icon}
              <span className="text-xs mt-1">{mode.label}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
