
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '@/config/environment';
import type { MapStyle } from '@/components/map/MapStyleSelector';

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

  // Initialize map
  useEffect(() => {
    if (!container.current || isMapInitialized) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: container.current,
        style: MAP_STYLE_URLS[mapStyle],
        center: center,
        zoom: 13,
      });

      map.current.on('load', () => {
        setIsMapInitialized(true);
        
        map.current?.addControl(
          new mapboxgl.NavigationControl(),
          'top-right'
        );
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [container, center, isMapInitialized, mapStyle]);

  // Update map center
  const updateMapCenter = (newCenter: [number, number]) => {
    if (!map.current || !isMapInitialized) return;
    
    // Update map center
    map.current.flyTo({
      center: newCenter,
      zoom: map.current.getZoom(),
      speed: 1.5,
      curve: 1,
      essential: true
    });
  };

  // Update map style
  const updateMapStyle = (newStyle: MapStyle) => {
    if (!map.current || !isMapInitialized) return;
    map.current.setStyle(MAP_STYLE_URLS[newStyle]);
  };

  return {
    map: map.current,
    isMapInitialized,
    updateMapCenter,
    updateMapStyle
  };
};

export default useMapInitialization;
