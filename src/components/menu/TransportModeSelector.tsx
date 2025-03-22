
import React from 'react';
import { Car, Walk, Bike, Bus } from 'lucide-react';
import { transportModes } from '@/data/transportModes';

interface TransportModeSelectorProps {
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
}

export const TransportModeSelector: React.FC<TransportModeSelectorProps> = ({
  transportMode,
  onTransportModeChange
}) => {
  // Transport mode icons
  const icons = {
    driving: <Car size={20} />,
    walking: <Walk size={20} />,
    cycling: <Bike size={20} />,
    transit: <Bus size={20} />
  };

  return (
    <div className="flex justify-between rounded-full overflow-hidden border border-gray-200 shadow-sm">
      {Object.keys(transportModes).map((mode) => (
        <button
          key={mode}
          className={`flex items-center justify-center px-3 py-2 transition-colors ${
            transportMode === mode
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => onTransportModeChange(mode)}
          title={transportModes[mode].label}
        >
          {icons[mode as keyof typeof icons] || <Car size={20} />}
        </button>
      ))}
    </div>
  );
};

export default TransportModeSelector;
