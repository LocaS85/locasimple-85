
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

// Initialize Mapbox with the token from environment
export const initializeMapbox = () => {
  try {
    if (typeof window !== 'undefined' && window.mapboxgl && MAPBOX_TOKEN) {
      window.mapboxgl.accessToken = MAPBOX_TOKEN;
      console.log('Mapbox initialized successfully with token');
      return true;
    } else {
      console.error('Mapbox initialization failed: Missing token or mapboxgl not available');
      return false;
    }
  } catch (error) {
    console.error('Error initializing Mapbox:', error);
    toast.error('Erreur lors de l\'initialisation de Mapbox');
    return false;
  }
};

// Set a custom token (useful for runtime token updates)
export const setMapboxToken = (token: string): boolean => {
  try {
    if (typeof window !== 'undefined' && window.mapboxgl && token) {
      window.mapboxgl.accessToken = token;
      // Store the token in localStorage for persistence
      localStorage.setItem('mapbox_token', token);
      console.log('Mapbox token set successfully');
      return true;
    } else {
      console.error('Setting Mapbox token failed: Missing token or mapboxgl not available');
      return false;
    }
  } catch (error) {
    console.error('Error setting Mapbox token:', error);
    return false;
  }
};

// Get the current token (from environment or localStorage)
export const getMapboxToken = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('mapbox_token') || MAPBOX_TOKEN;
  }
  return MAPBOX_TOKEN;
};
