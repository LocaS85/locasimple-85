
import { Car, Walking, Bicycle, Bus, Clock } from 'lucide-react';
import React from 'react';

export type TransportMode = 'driving' | 'walking' | 'cycling' | 'driving-traffic';

export interface TransportModeOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

export const transportModes: TransportModeOption[] = [
  {
    id: 'driving',
    name: 'Voiture',
    icon: React.createElement(Car, { size: 16 }),
    color: '#3b82f6' // blue-500
  },
  {
    id: 'walking',
    name: 'À pied',
    icon: React.createElement(Walking, { size: 16 }),
    color: '#10b981' // emerald-500
  },
  {
    id: 'cycling',
    name: 'Vélo',
    icon: React.createElement(Bicycle, { size: 16 }),
    color: '#f59e0b' // amber-500
  },
  {
    id: 'driving-traffic',
    name: 'Trafic',
    icon: React.createElement(Clock, { size: 16 }),
    color: '#ef4444' // red-500
  },
  {
    id: 'transit',
    name: 'Transit',
    icon: React.createElement(Bus, { size: 16 }),
    color: '#8b5cf6' // violet-500
  }
];

export function getTransportModeColor(transportMode: string): string {
  const mode = transportModes.find(m => m.id === transportMode);
  return mode ? mode.color : '#3b82f6'; // Default to blue if mode not found
}
