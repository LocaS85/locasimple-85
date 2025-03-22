
import React from 'react';
import { TransportModeSelector } from '@/components/menu/TransportModeSelector';

interface TransportModeFilterProps {
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
}

const TransportModeFilter: React.FC<TransportModeFilterProps> = ({
  transportMode,
  onTransportModeChange
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 max-w-xs w-full px-4 z-10">
      <div className="bg-white rounded-full shadow-lg p-1">
        <TransportModeSelector 
          transportMode={transportMode} 
          onTransportModeChange={onTransportModeChange} 
        />
      </div>
    </div>
  );
};

export default TransportModeFilter;
