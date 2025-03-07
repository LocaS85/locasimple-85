
import React from 'react';
import { Car, PersonStanding, Bike, Bus } from 'lucide-react';

export interface TransportMode {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
}

export const transportModes: TransportMode[] = [
  { 
    id: 'driving', 
    name: 'Voiture', 
    icon: <Car className="h-4 w-4" />, 
    color: '#0EA5E9', 
    hoverColor: '#0284C7' 
  },
  { 
    id: 'walking', 
    name: 'À pied', 
    icon: <PersonStanding className="h-4 w-4" />, 
    color: '#EF4444', 
    hoverColor: '#DC2626' 
  },
  { 
    id: 'cycling', 
    name: 'Vélo', 
    icon: <Bike className="h-4 w-4" />, 
    color: '#10B981', 
    hoverColor: '#059669' 
  },
  { 
    id: 'transit', 
    name: 'Transport+', 
    icon: <Bus className="h-4 w-4" />, 
    color: '#8B5CF6', 
    hoverColor: '#7C3AED' 
  },
];

// Function to get color by transport mode id
export const getTransportModeColor = (modeId: string): string => {
  const mode = transportModes.find(m => m.id === modeId);
  return mode?.color || '#3B82F6'; // Default to blue if not found
};
