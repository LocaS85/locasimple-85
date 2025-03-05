
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '@/config/environment';
import type { MapStyle } from '@/components/map/MapStyleSelector';
import { toast } from 'sonner';

// Map style URLs for Mapbox
const MAP_STYLE_URLS = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  terrain: 'mapbox://styles/mapbox/outdoors-v12'
};

interface UseMapInitializationOptions {
  container: React.RefObject<HTMLDivElement>;
  center: [number, number];
  mapStyle: MapStyle;
}

interface UseMapInitializationResult {
  map: mapboxgl.Map | null;
  isMapInitialized: boolean;
  updateMapCenter: (center: [number, number]) => void;
  updateMapStyle: (newStyle: MapStyle) => void;
}

export const useMapInitialization = ({
  container,
  center,
  mapStyle
}: UseMapInitializationOptions): UseMapInitializationResult => {
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const map = useRef<mapboxgl.Map | null>(null);
  const initializingRef = useRef(false);

  // Initialize map
  useEffect(() => {
    if (!container.current || isMapInitialized || initializingRef.current) return;

    try {
      // Vérifier que le token est bien défini
      if (!MAPBOX_TOKEN) {
        console.warn('Mapbox token is missing');
        toast.error('Configuration de la carte manquante, contactez l\'administrateur');
        return;
      }
      
      initializingRef.current = true;
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      // Vérifier que le conteneur est disponible
      if (!container.current) {
        console.error('Map container not available');
        initializingRef.current = false;
        return;
      }
      
      map.current = new mapboxgl.Map({
        container: container.current,
        style: MAP_STYLE_URLS[mapStyle],
        center: center,
        zoom: 13,
      });

      // Attendre que la carte soit chargée avant d'ajouter des contrôles
      map.current.on('load', () => {
        if (map.current) {
          setIsMapInitialized(true);
          initializingRef.current = false;
          
          map.current.addControl(
            new mapboxgl.NavigationControl(),
            'top-right'
          );
        }
      });
      
      // Gérer les erreurs de chargement
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        initializingRef.current = false;
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      initializingRef.current = false;
      toast.error('Erreur lors de l\'initialisation de la carte');
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      initializingRef.current = false;
    };
  }, [container, center, isMapInitialized, mapStyle]);

  // Update map center
  const updateMapCenter = (newCenter: [number, number]) => {
    if (!map.current || !isMapInitialized) return;
    
    try {
      // Update map center
      map.current.flyTo({
        center: newCenter,
        zoom: map.current.getZoom(),
        speed: 1.5,
        curve: 1,
        essential: true
      });
    } catch (error) {
      console.error('Error updating map center:', error);
    }
  };

  // Update map style
  const updateMapStyle = (newStyle: MapStyle) => {
    if (!map.current || !isMapInitialized) return;
    
    try {
      map.current.setStyle(MAP_STYLE_URLS[newStyle]);
    } catch (error) {
      console.error('Error updating map style:', error);
    }
  };

  return {
    map: map.current,
    isMapInitialized,
    updateMapCenter,
    updateMapStyle
  };
};

export default useMapInitialization;
