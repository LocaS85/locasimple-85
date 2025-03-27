
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, Bus, Bike } from 'lucide-react';

interface TransportModeFilterProps {
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
}

export const TransportModeFilter: React.FC<TransportModeFilterProps> = ({
  transportMode,
  onTransportModeChange
}) => {
  return (
    <div className="absolute bottom-16 right-4 z-10">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-2 flex flex-col gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-10 w-10 rounded-full ${transportMode === 'driving' ? 'text-blue-500 bg-blue-50' : 'text-gray-500'}`}
          onClick={() => onTransportModeChange('driving')}
          aria-label="Driving"
        >
          <Car className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-10 w-10 rounded-full ${transportMode === 'transit' ? 'text-green-500 bg-green-50' : 'text-gray-500'}`}
          onClick={() => onTransportModeChange('transit')}
          aria-label="Transit"
        >
          <Bus className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-10 w-10 rounded-full ${transportMode === 'cycling' ? 'text-purple-500 bg-purple-50' : 'text-gray-500'}`}
          onClick={() => onTransportModeChange('cycling')}
          aria-label="Cycling"
        >
          <Bike className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default TransportModeFilter;
