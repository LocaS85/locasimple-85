
// Update import with correct path to transportModes.tsx
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
    <>
      <h3 className="text-sm font-medium mb-2">Transport</h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {transportModes.map((mode) => (
          <TransportModeButton 
            key={mode.id}
            mode={mode}
            isSelected={transportMode === mode.id}
            onClick={() => onTransportModeChange(mode.id)}
          />
        ))}
      </div>
    </>
  );
};
