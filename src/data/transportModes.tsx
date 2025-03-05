
import React from 'react';
import { Car, PersonStanding, Bike, Bus } from 'lucide-react';

export interface TransportMode {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const transportModes: TransportMode[] = [
  { id: 'driving', name: 'Voiture', icon: <Car className="h-4 w-4" /> },
  { id: 'walking', name: 'À pied', icon: <PersonStanding className="h-4 w-4" /> },
  { id: 'cycling', name: 'Vélo', icon: <Bike className="h-4 w-4" /> },
  { id: 'transit', name: 'Transport+', icon: <Bus className="h-4 w-4" /> },
];
