
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';
import { MAPBOX_TOKEN } from '@/config/environment';

/**
 * Sets the Mapbox token globally if available
 * @returns boolean indicating if token was set successfully
 */
export const setMapboxToken = (): boolean => {
  if (MAPBOX_TOKEN) {
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      console.log('Mapbox token set globally in mapInitializationUtils');
      return true;
    } catch (error) {
      console.error('Error setting Mapbox token:', error);
      return false;
    }
  }
  return false;
};

/**
 * Verifies if a valid Mapbox token is available
 * @returns boolean indicating if token is valid
 */
export const verifyMapboxToken = (): boolean => {
  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === '') {
    const errorMsg = 'Mapbox token is missing or empty';
    console.error(errorMsg);
    toast.error('Token Mapbox manquant. Vérifiez votre fichier .env');
    return false;
  }
  return true;
};

/**
 * Adds navigation controls to the map if not disabled
 * @param map The Mapbox map instance
 * @param disableNavControls Whether to disable navigation controls
 * @returns The navigation control instance or null
 */
export const addNavigationControls = (
  map: mapboxgl.Map,
  disableNavControls: boolean
): mapboxgl.NavigationControl | null => {
  if (disableNavControls) return null;
  
  // Create NavigationControl instance
  const navControl = new mapboxgl.NavigationControl({
    showCompass: true,
    showZoom: true,
    visualizePitch: true
  });
  
  // Add controls to map
  map.addControl(navControl, 'top-right');
  
  return navControl;
};

/**
 * Adds attribution control to the map
 * @param map The Mapbox map instance
 */
export const addAttributionControl = (map: mapboxgl.Map): void => {
  map.addControl(
    new mapboxgl.AttributionControl({ compact: true }),
    'bottom-right'
  );
};
