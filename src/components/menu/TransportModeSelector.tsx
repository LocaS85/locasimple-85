
import React from 'react';
import { TransportMode, transportModes } from '@/data/transportModes';
import { TransportModeButton } from './TransportModeButton';

interface TransportModeSelectorProps {
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
}

export const TransportModeSelector: React.FC<TransportModeSelectorProps> = ({
  transportMode,
  onTransportModeChange
}) => {
  return (
    <div className="flex gap-1 overflow-x-auto p-1 scrollbar-hide">
      {transportModes.map((mode) => (
        <TransportModeButton 
          key={mode.id}
          mode={mode}
          isSelected={transportMode === mode.id}
          onClick={() => onTransportModeChange(mode.id)}
        />
      ))}
    </div>
  );
};
