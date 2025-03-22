
import React from 'react';
import { Car, Footprints, Bike, Bus } from 'lucide-react';

export type TransportMode = 'driving' | 'walking' | 'cycling' | 'transit';

interface TransportModeInfo {
  color: string;
  icon: string;
  label: string;
}

export const transportModes: Record<string, TransportModeInfo> = {
  driving: {
    color: '#3b82f6',
    icon: 'car',
    label: 'Voiture'
  },
  walking: {
    color: '#10b981',
    icon: 'footprints',
    label: 'À pied'
  },
  cycling: {
    color: '#f59e0b',
    icon: 'bike',
    label: 'Vélo'
  },
  transit: {
    color: '#8b5cf6',
    icon: 'bus',
    label: 'Transport'
  }
};

export const getTransportModeColor = (mode: string): string => {
  return transportModes[mode]?.color || '#3b82f6';
};

export const getTransportModeIcon = (mode: string): React.ReactNode => {
  const iconName = transportModes[mode]?.icon || 'car';
  
  switch (iconName) {
    case 'car':
      return <Car size={20} />;
    case 'footprints':
      return <Footprints size={20} />;
    case 'bike':
      return <Bike size={20} />;
    case 'bus':
      return <Bus size={20} />;
    default:
      return <Car size={20} />;
  }
};

export const getTransportModeLabel = (mode: string): string => {
  return transportModes[mode]?.label || 'Voiture';
};

export default transportModes;
