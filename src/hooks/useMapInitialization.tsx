
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
  const navigationControlRef = useRef<mapboxgl.NavigationControl | null>(null);

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
      
      console.log('Initializing map with token:', MAPBOX_TOKEN);
      
      // Initialiser la carte avec des paramètres de base
      map.current = new mapboxgl.Map({
        container: container.current,
        style: MAP_STYLE_URLS[mapStyle],
        center: center,
        zoom: 13,
        trackResize: true,
        attributionControl: false, // Désactiver le contrôle d'attribution par défaut
        preserveDrawingBuffer: true // Nécessaire pour des captures d'écran de la carte
      });

      // Attendre que le style soit chargé avant de considérer la carte comme initialisée
      map.current.on('style.load', () => {
        if (map.current) {
          setIsMapInitialized(true);
          initializingRef.current = false;
          
          // Create a NavigationControl instance and store it in ref
          navigationControlRef.current = new mapboxgl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: true
          });
          
          // Add the navigation control to the map
          map.current.addControl(
            navigationControlRef.current,
            'top-right'
          );
          
          // Ajouter le contrôle d'attribution dans un coin plus discret
          map.current.addControl(
            new mapboxgl.AttributionControl({
              compact: true
            }),
            'bottom-right'
          );
        }
      });
      
      // Gérer les erreurs de chargement
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        toast.error('Erreur de chargement de la carte');
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
        try {
          map.current.remove();
        } catch (error) {
          console.error('Error removing map:', error);
        }
        map.current = null;
      }
      navigationControlRef.current = null;
      initializingRef.current = false;
    };
  }, [container, center, isMapInitialized, mapStyle]);

  // Update map center with safety check
  const updateMapCenter = (newCenter: [number, number]) => {
    if (!map.current || !isMapInitialized) return;
    
    try {
      // Update map center with smooth animation
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

  // Update map style with safety check
  const updateMapStyle = (newStyle: MapStyle) => {
    if (!map.current || !isMapInitialized) return;
    
    try {
      map.current.setStyle(MAP_STYLE_URLS[newStyle]);
      
      // Re-attacher l'événement style.load pour gérer les attributions après changement de style
      map.current.once('style.load', () => {
        if (map.current) {
          // Réajouter les contrôles si nécessaire après changement de style
          if (navigationControlRef.current) {
            // First check if we need to remove existing control
            try {
              map.current.removeControl(navigationControlRef.current);
            } catch (e) {
              // It's fine if this fails, it might not be attached yet
              console.log("Navigation control couldn't be removed, may not be attached");
            }
            
            // Add fresh navigation control
            map.current.addControl(
              navigationControlRef.current,
              'top-right'
            );
          } else {
            // Create a new one if needed
            navigationControlRef.current = new mapboxgl.NavigationControl();
            map.current.addControl(
              navigationControlRef.current,
              'top-right'
            );
          }
        }
      });
    } catch (error) {
      console.error('Error updating map style:', error);
      toast.error('Erreur lors du changement de style de carte');
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
