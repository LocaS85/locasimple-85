
import { TransportMode } from '@/types/categoryTypes';

interface TransportModeWithColor {
  id: TransportMode;
  name: string;
  color: string;
  icon?: string;
}

export const transportModesWithColors: TransportModeWithColor[] = [
  { id: 'driving', name: 'Voiture', color: '#3b82f6', icon: '🚘' }, // Blue
  { id: 'walking', name: 'À pied', color: '#10b981', icon: '🚶' },  // Green
  { id: 'cycling', name: 'Vélo', color: '#f59e0b', icon: '🚲' },    // Amber
  { id: 'transit', name: 'Bus', color: '#8b5cf6', icon: '🚌' },     // Purple
  { id: 'train', name: 'Train', color: '#ef4444', icon: '🚆' },     // Red
  { id: 'ship', name: 'Bateau', color: '#0ea5e9', icon: '⛴️' },     // Sky
  { id: 'plane', name: 'Avion', color: '#6366f1', icon: '✈️' },     // Indigo
  { id: 'carpool', name: 'Co-voiturage', color: '#ec4899', icon: '👥' } // Pink
];

// Utility function to get the color for a specific transport mode
export const getTransportModeColor = (mode: TransportMode): string => {
  const transportMode = transportModesWithColors.find(m => m.id === mode);
  return transportMode?.color || '#6b7280'; // Gray as fallback
};

// Utility function to get the icon for a specific transport mode
export const getTransportModeIcon = (mode: TransportMode): string => {
  const transportMode = transportModesWithColors.find(m => m.id === mode);
  return transportMode?.icon || '🚗'; // Default icon as fallback
};
