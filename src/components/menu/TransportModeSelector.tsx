
import React from 'react';
import { TransportMode, transportModes } from '@/data/transportModes';
import { Car, Bike, MapPin, Bus, Shuffle } from 'lucide-react';

interface TransportModeSelectorProps {
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
}

export const TransportModeSelector: React.FC<TransportModeSelectorProps> = ({
  transportMode,
  onTransportModeChange
}) => {
  // Get the appropriate icon based on transport mode
  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'driving':
      case 'driving-traffic':
        return <Car className="h-4 w-4" />;
      case 'cycling':
        return <Bike className="h-4 w-4" />;
      case 'walking':
        return <MapPin className="h-4 w-4" />; // Changed from Walking to MapPin
      case 'transit':
        return <Bus className="h-4 w-4" />;
      default:
        return <Shuffle className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex justify-between items-center w-full p-1 bg-gray-100 rounded-full">
      {transportModes.map((mode) => {
        const isSelected = transportMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => onTransportModeChange(mode.id)}
            className={`flex items-center justify-center space-x-1 py-1.5 px-3 rounded-full transition-colors ${
              isSelected
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            aria-pressed={isSelected}
          >
            {getTransportIcon(mode.id)}
            <span className="text-xs font-medium">{mode.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TransportModeSelector;
