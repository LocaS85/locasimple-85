
import React from 'react';
import { Car, PersonStanding, Bike, Bus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TransportModeButton from '../menu/TransportModeButton';

interface TransportModeFilterProps {
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
}

const TransportModeFilter: React.FC<TransportModeFilterProps> = ({
  transportMode,
  onTransportModeChange
}) => {
  const { t } = useTranslation();
  
  const modes = [
    { id: 'driving', icon: <Car size={18} />, label: t('driving') || 'Voiture' },
    { id: 'walking', icon: <PersonStanding size={18} />, label: t('walking') || 'À pied' },
    { id: 'cycling', icon: <Bike size={18} />, label: t('cycling') || 'Vélo' },
    { id: 'transit', icon: <Bus size={18} />, label: t('transit') || 'Transport' }
  ];

  return (
    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 flex bg-white rounded-full shadow-lg p-1">
      {modes.map((mode) => (
        <TransportModeButton
          key={mode.id}
          mode={mode.id}
          isActive={transportMode === mode.id}
          onClick={onTransportModeChange}
          className="mx-1"
        />
      ))}
    </div>
  );
};

export default TransportModeFilter;
