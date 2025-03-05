
import { useState, useEffect, useRef, useCallback } from 'react';
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
  disableNavControls?: boolean;
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
  mapStyle,
  disableNavControls = false
}: UseMapInitializationOptions): UseMapInitializationResult => {
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const map = useRef<mapboxgl.Map | null>(null);
  const initializingRef = useRef(false);
  const navigationControlRef = useRef<mapboxgl.NavigationControl | null>(null);
  const [initializationAttempted, setInitializationAttempted] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!container.current || initializingRef.current || (map.current && isMapInitialized)) return;

    try {
      // Verify token
      if (!MAPBOX_TOKEN || MAPBOX_TOKEN === '') {
        console.error('Mapbox token is missing or empty');
        toast.error('Token Mapbox manquant. Vérifiez votre fichier .env');
        setInitializationAttempted(true);
        return;
      }
      
      initializingRef.current = true;
      console.log('Setting Mapbox access token...');
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      // Verify container
      if (!container.current) {
        console.error('Map container not available');
        initializingRef.current = false;
        setInitializationAttempted(true);
        return;
      }
      
      console.log('Initializing map with center:', center);
      
      // Initialize map with basic parameters
      try {
        map.current = new mapboxgl.Map({
          container: container.current,
          style: MAP_STYLE_URLS[mapStyle],
          center: center,
          zoom: 13,
          trackResize: true,
          attributionControl: false,
          preserveDrawingBuffer: true
        });
      } catch (error) {
        console.error('Error creating Mapbox map:', error);
        toast.error('Erreur lors de la création de la carte');
        initializingRef.current = false;
        setInitializationAttempted(true);
        return;
      }

      // Wait for style load before considering map initialized
      map.current.on('style.load', () => {
        if (map.current && map.current.getContainer()) {
          console.log('Map style loaded successfully');
          setIsMapInitialized(true);
          initializingRef.current = false;
          setInitializationAttempted(true);
          
          // Only add navigation controls if not disabled
          if (!disableNavControls) {
            // Create NavigationControl instance
            const navControl = new mapboxgl.NavigationControl({
              showCompass: true,
              showZoom: true,
              visualizePitch: true
            });
            
            navigationControlRef.current = navControl;
            
            // Add controls to map
            map.current.addControl(navControl, 'top-right');
          }
          
          // Always add attribution control
          map.current.addControl(
            new mapboxgl.AttributionControl({ compact: true }),
            'bottom-right'
          );

          console.log('Map initialized successfully');
          toast.success('Carte chargée avec succès');
        }
      });
      
      // Handle map load errors
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        toast.error('Erreur de chargement de la carte');
        initializingRef.current = false;
        setInitializationAttempted(true);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      initializingRef.current = false;
      setInitializationAttempted(true);
      toast.error('Erreur lors de l\'initialisation de la carte');
    }

    // Cleanup function
    return () => {
      if (map.current && map.current.getContainer()) {
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
  }, [container, center, mapStyle, disableNavControls]);

  // Function to update map center
  const updateMapCenter = useCallback((newCenter: [number, number]) => {
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
  }, [isMapInitialized]);

  // Function to update map style
  const updateMapStyle = useCallback((newStyle: MapStyle) => {
    if (!map.current || !isMapInitialized) return;
    
    try {
      // Update map style
      map.current.setStyle(MAP_STYLE_URLS[newStyle]);
      
      // Re-attach style.load event handler
      map.current.once('style.load', () => {
        if (map.current && map.current.getContainer()) {
          // Add new controls after style change only if not disabled
          if (!disableNavControls) {
            try {
              // Create new controls
              const navControl = new mapboxgl.NavigationControl({
                showCompass: true,
                showZoom: true,
                visualizePitch: true
              });
              
              // Add to map
              map.current.addControl(navControl, 'top-right');
              navigationControlRef.current = navControl;
            } catch (error) {
              console.error('Error adding controls after style change:', error);
            }
          }
          
          // Always add attribution control after style change
          try {
            map.current.addControl(
              new mapboxgl.AttributionControl({ compact: true }),
              'bottom-right'
            );
          } catch (error) {
            console.error('Error adding attribution control after style change:', error);
          }
        }
      });
    } catch (error) {
      console.error('Error updating map style:', error);
      toast.error('Erreur lors du changement de style de carte');
    }
  }, [isMapInitialized, disableNavControls]);

  return {
    map: map.current,
    isMapInitialized,
    updateMapCenter,
    updateMapStyle
  };
};

export default useMapInitialization;
