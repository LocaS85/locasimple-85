
import { MAPBOX_TOKEN } from '@/config/environment';

export const initializeMapbox = () => {
  const token = MAPBOX_TOKEN || (window as any).TEMPORARY_MAPBOX_TOKEN;
  
  if (!token) {
    console.warn('Mapbox token not found. Maps will not work correctly.');
    return false;
  }
  
  try {
    // Set token to global window object for access by mapbox
    if (window && typeof window !== 'undefined') {
      (window as any).mapboxgl = (window as any).mapboxgl || {};
      (window as any).mapboxgl.accessToken = token;
    }
    
    console.log('Mapbox initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Mapbox:', error);
    return false;
  }
};

export const setMapboxToken = (token: string): boolean => {
  if (!token) return false;
  
  try {
    (window as any).TEMPORARY_MAPBOX_TOKEN = token;
    initializeMapbox();
    return true;
  } catch (error) {
    console.error('Error setting temporary Mapbox token:', error);
    return false;
  }
};

export const getMapboxToken = (): string => {
  return MAPBOX_TOKEN || (window as any).TEMPORARY_MAPBOX_TOKEN || '';
};
