
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Car, Bike, Bus, Ship, Train } from 'lucide-react';
import { User } from 'lucide-react'; // Using User instead of PersonWalking

interface TransportMode {
  id: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}

interface TransportSelectorProps {
  modes?: TransportMode[];
  defaultMode?: string;
  onChange?: (mode: string) => void;
}

const DEFAULT_TRANSPORT_MODES: TransportMode[] = [
  { id: 'driving', icon: <Car size={20} />, label: 'Voiture' },
  { id: 'walking', icon: <User size={20} />, label: 'Marche' },
  { id: 'cycling', icon: <Bike size={20} />, label: 'Vélo' },
  { id: 'transit', icon: <Bus size={20} />, label: 'Bus' },
  { id: 'train', icon: <Train size={20} />, label: 'Train' },
  { id: 'boat', icon: <Ship size={20} />, label: 'Bateau', disabled: true }
];

const TransportSelector: React.FC<TransportSelectorProps> = ({
  modes = DEFAULT_TRANSPORT_MODES,
  defaultMode = 'driving',
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedMode, setSelectedMode] = useState(defaultMode);

  const handleModeChange = (modeId: string) => {
    const mode = modes.find(m => m.id === modeId);
    if (mode && !mode.disabled) {
      setSelectedMode(modeId);
      if (onChange) {
        onChange(modeId);
      }
    }
  };

  const selectedModeInfo = modes.find(mode => mode.id === selectedMode);

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <button 
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">Mode de transport</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isOpen && (
        <div className="p-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {modes.map(mode => (
              <button
                key={mode.id}
                className={`flex flex-col items-center justify-center p-3 rounded-md transition-colors 
                  ${mode.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${selectedMode === mode.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : mode.disabled ? 'bg-gray-50' : 'hover:bg-gray-100'
                }`}
                onClick={() => !mode.disabled && handleModeChange(mode.id)}
                disabled={mode.disabled}
                title={mode.disabled ? 'Non disponible' : mode.label}
              >
                <div className="mb-1">{mode.icon}</div>
                <span className="text-sm">{mode.label}</span>
                {mode.disabled && (
                  <span className="text-xs text-gray-500 mt-1">Indisponible</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportSelector;
