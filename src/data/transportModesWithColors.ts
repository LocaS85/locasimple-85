
import { TransportMode } from '@/types/categoryTypes';

interface TransportModeWithColor {
  id: TransportMode;
  name: string;
  color: string;
  icon?: string;
}

export const transportModesWithColors: TransportModeWithColor[] = [
  { id: 'driving', name: 'Voiture', color: '#3b82f6' }, // Blue
  { id: 'walking', name: 'À pied', color: '#10b981' },  // Green
  { id: 'cycling', name: 'Vélo', color: '#f59e0b' },    // Amber
  { id: 'transit', name: 'Bus', color: '#8b5cf6' },     // Purple
  { id: 'train', name: 'Train', color: '#ef4444' },     // Red
  { id: 'ship', name: 'Bateau', color: '#0ea5e9' },     // Sky
  { id: 'plane', name: 'Avion', color: '#6366f1' },     // Indigo
  { id: 'carpool', name: 'Co-voiturage', color: '#ec4899' } // Pink
];
