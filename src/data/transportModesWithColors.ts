
import React from 'react';
import { TransportModeWithColor, TransportMode } from '@/types/categoryTypes';
import { 
  Car, 
  Train, 
  Bus, 
  CircuitBoard, 
  Bike, 
  PersonStanding, 
  Plane, 
  TrainTrack
} from 'lucide-react';

export const transportModesWithColors: TransportModeWithColor[] = [
  { id: 'car', name: 'Voiture', color: '#3b82f6', defaultColor: '#3b82f6', icon: 'Car' }, 
  { id: 'train', name: 'Train', color: '#000000', defaultColor: '#000000', icon: 'Train' }, 
  { id: 'bus', name: 'Bus', color: '#eab308', defaultColor: '#eab308', icon: 'Bus' }, 
  { id: 'public', name: 'Transports en commun', color: '#6b7280', defaultColor: '#6b7280', icon: 'CircuitBoard' }, 
  { id: 'bike', name: 'Vélo', color: '#ef4444', defaultColor: '#ef4444', icon: 'Bike' }, 
  { id: 'walk', name: 'À pied', color: '#22c55e', defaultColor: '#22c55e', icon: 'PersonStanding' }, 
  { id: 'plane', name: 'Avion', color: '#06b6d4', defaultColor: '#06b6d4', icon: 'Plane' }, 
  { id: 'metro', name: 'Métro', color: '#8b5cf6', defaultColor: '#8b5cf6', icon: 'TrainTrack' }, 
  { id: 'tram', name: 'Tramway', color: '#f97316', defaultColor: '#f97316', icon: 'Train' }, 
  { id: 'coach', name: 'Cars', color: '#92400e', defaultColor: '#92400e', icon: 'Bus' }, 
  { id: 'airport', name: 'Aéroport', color: '#9333ea', defaultColor: '#9333ea', icon: 'Plane' }, 
  { id: 'airstrip', name: 'Aérodrome', color: '#ec4899', defaultColor: '#ec4899', icon: 'Plane' }, 
  { id: 'driving', name: 'Voiture', color: '#3b82f6', defaultColor: '#3b82f6', icon: 'Car' }, 
  { id: 'walking', name: 'À pied', color: '#22c55e', defaultColor: '#22c55e', icon: 'PersonStanding' }, 
  { id: 'bicycling', name: 'Vélo', color: '#ef4444', defaultColor: '#ef4444', icon: 'Bike' }, 
  { id: 'transit', name: 'Transport en commun', color: '#6b7280', defaultColor: '#6b7280', icon: 'Bus' }, 
];

export const getTransportModeColor = (transportMode: string): string => {
  const mode = transportModesWithColors.find(m => m.id === transportMode);
  return mode ? mode.color : '#3b82f6'; // Default to blue if mode not found
};

export const getTransportModeByName = (name: string): TransportModeWithColor | undefined => {
  return transportModesWithColors.find(m => m.name === name);
};
