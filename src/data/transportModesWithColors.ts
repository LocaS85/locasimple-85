
import { TransportModeWithColor, TransportMode } from '@/types/categoryTypes';

export const transportModesWithColors: TransportModeWithColor[] = [
  { id: 'car', name: 'Voiture', color: '#3b82f6', defaultColor: '#3b82f6' }, // Bleu
  { id: 'train', name: 'Train', color: '#000000', defaultColor: '#000000' }, // Noir
  { id: 'bus', name: 'Bus', color: '#eab308', defaultColor: '#eab308' }, // Jaune
  { id: 'public', name: 'Transports en commun', color: '#6b7280', defaultColor: '#6b7280' }, // Gris
  { id: 'bike', name: 'Vélo', color: '#ef4444', defaultColor: '#ef4444' }, // Rouge
  { id: 'walk', name: 'À pied', color: '#22c55e', defaultColor: '#22c55e' }, // Vert
  { id: 'plane', name: 'Avion', color: '#06b6d4', defaultColor: '#06b6d4' }, // Cyan
  { id: 'metro', name: 'Métro', color: '#8b5cf6', defaultColor: '#8b5cf6' }, // Violet
  { id: 'tram', name: 'Tramway', color: '#f97316', defaultColor: '#f97316' }, // Orange
  { id: 'coach', name: 'Cars', color: '#92400e', defaultColor: '#92400e' }, // Marron
  { id: 'airport', name: 'Aéroport', color: '#9333ea', defaultColor: '#9333ea' }, // Violet foncé
  { id: 'airstrip', name: 'Aérodrome', color: '#ec4899', defaultColor: '#ec4899' }, // Rose
  { id: 'driving', name: 'Voiture', color: '#3b82f6', defaultColor: '#3b82f6' }, // Bleu (alias for car)
  { id: 'walking', name: 'À pied', color: '#22c55e', defaultColor: '#22c55e' }, // Vert (alias for walk)
  { id: 'bicycling', name: 'Vélo', color: '#ef4444', defaultColor: '#ef4444' }, // Rouge (alias for bike)
  { id: 'transit', name: 'Transport en commun', color: '#6b7280', defaultColor: '#6b7280' }, // Gris (alias for public)
];

export const getTransportModeColor = (transportMode: string): string => {
  const mode = transportModesWithColors.find(m => m.id === transportMode);
  return mode ? mode.color : '#3b82f6'; // Default to blue if mode not found
};

export const getTransportModeByName = (name: string): TransportModeWithColor | undefined => {
  return transportModesWithColors.find(m => m.name === name);
};
