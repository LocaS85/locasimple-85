
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '@/config/environment';

export interface UseMapInitializationOptions {
  container: React.RefObject<HTMLDivElement>;
  center: [number, number];
  mapStyle?: 'streets' | 'satellite' | 'light' | 'dark' | 'outdoors' | 'navigation-day' | 'navigation-night';
  zoom?: number;
  pitch?: number;
  bearing?: number;
}

export const useMapInitialization = ({
  container,
  center,
  mapStyle = 'streets',
  zoom = 13,
  pitch = 0,
  bearing = 0
}: UseMapInitializationOptions) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Map style based on the provided option
  const getMapboxStyle = (style: string): string => {
    switch (style) {
      case 'satellite': return 'mapbox://styles/mapbox/satellite-streets-v12';
      case 'light': return 'mapbox://styles/mapbox/light-v11';
      case 'dark': return 'mapbox://styles/mapbox/dark-v11';
      case 'outdoors': return 'mapbox://styles/mapbox/outdoors-v12';
      case 'navigation-day': return 'mapbox://styles/mapbox/navigation-day-v1';
      case 'navigation-night': return 'mapbox://styles/mapbox/navigation-night-v1';
      case 'streets':
      default: return 'mapbox://styles/mapbox/streets-v12';
    }
  };

  // Initialize map
  useEffect(() => {
    if (!container.current || mapRef.current) return;
    
    if (!MAPBOX_TOKEN) {
      console.error('Mapbox token is missing');
      return;
    }
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    try {
      const newMap = new mapboxgl.Map({
        container: container.current,
        style: getMapboxStyle(mapStyle),
        center,
        zoom,
        pitch,
        bearing,
        attributionControl: false
      });
      
      newMap.addControl(new mapboxgl.AttributionControl({
        compact: true
      }));
      
      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      newMap.on('load', () => {
        console.log('Map loaded');
        setIsMapInitialized(true);
      });
      
      mapRef.current = newMap;
      setMap(newMap);
      
      return () => {
        newMap.remove();
        mapRef.current = null;
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [container, center, mapStyle, zoom, pitch, bearing]);

  // Update map center when center prop changes
  useEffect(() => {
    if (mapRef.current && isMapInitialized) {
      mapRef.current.setCenter(center);
    }
  }, [center, isMapInitialized]);

  return { map, isMapInitialized };
};

export default useMapInitialization;
