
import React from 'react';
import { Car, Bike, PersonStanding, Bus, Ship, Train } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface TransportMode {
  id: string;
  icon: React.ReactNode;
  label: string;
  profile: string;
}

const TRANSPORT_MODES: TransportMode[] = [
  { id: 'driving', icon: <Car className="h-5 w-5" />, label: 'Voiture', profile: 'mapbox/driving' },
  { id: 'cycling', icon: <Bike className="h-5 w-5" />, label: 'Vélo', profile: 'mapbox/cycling' },
  { id: 'walking', icon: <PersonStanding className="h-5 w-5" />, label: 'À pied', profile: 'mapbox/walking' },
  { id: 'transit', icon: <Bus className="h-5 w-5" />, label: 'Bus', profile: 'mapbox/transit' },
  { id: 'boat', icon: <Ship className="h-5 w-5" />, label: 'Bateau', profile: 'mapbox/driving' },
  { id: 'train', icon: <Train className="h-5 w-5" />, label: 'Transport', profile: 'mapbox/transit' }
];

interface TransportModesProps {
  selectedMode?: string;
  onModeChange: (mode: string) => void;
  multiSelect?: boolean;
}

const TransportModeFilter = ({ 
  selectedMode = 'driving', 
  onModeChange,
  multiSelect = false
}: TransportModesProps) => {
  const [selectedModes, setSelectedModes] = React.useState<string[]>([selectedMode]);

  const handleModeChange = (mode: string) => {
    if (multiSelect) {
      // For multi-select mode
      let newModes;
      if (selectedModes.includes(mode)) {
        // Don't allow deselecting the last mode
        if (selectedModes.length > 1) {
          newModes = selectedModes.filter(m => m !== mode);
        } else {
          return;
        }
      } else {
        newModes = [...selectedModes, mode];
      }
      setSelectedModes(newModes);
      // Pass the first mode as primary if using multi-mode
      onModeChange(newModes[0]);
    } else {
      // For single-select mode
      setSelectedModes([mode]);
      onModeChange(mode);
    }
  };

  return (
    <div className="transport-modes">
      <h3 className="text-sm font-medium mb-3">Mode de transport</h3>
      
      <TooltipProvider>
        <div className="flex flex-wrap justify-between gap-2">
          {TRANSPORT_MODES.map((mode) => (
            <Tooltip key={mode.id}>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => handleModeChange(mode.id)}
                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg w-16 h-16 
                    ${(multiSelect ? selectedModes.includes(mode.id) : selectedMode === mode.id) 
                      ? 'bg-primary/10 border-primary/30 text-primary border' 
                      : 'bg-gray-50 hover:bg-gray-100 border border-transparent'}`}
                >
                  {mode.icon}
                  <span className="text-xs">{mode.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{mode.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default TransportModeFilter;
