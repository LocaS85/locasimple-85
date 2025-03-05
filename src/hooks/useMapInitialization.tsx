
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
  centerMarker: mapboxgl.Marker | null;
  updateMapCenter: (center: [number, number], isLocationActive: boolean) => void;
  updateMapStyle: (newStyle: MapStyle) => void;
}

export const useMapInitialization = ({
  container,
  center,
  mapStyle
}: UseMapInitializationOptions): UseMapInitializationResult => {
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const map = useRef<mapboxgl.Map | null>(null);
  const centerMarker = useRef<mapboxgl.Marker | null>(null);

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
      centerMarker.current?.remove();
    };
  }, [container, center, isMapInitialized, mapStyle]);

  // Update map style
  const updateMapStyle = (newStyle: MapStyle) => {
    if (!map.current || !isMapInitialized) return;
    map.current.setStyle(MAP_STYLE_URLS[newStyle]);
  };

  // Update map center and marker
  const updateMapCenter = (newCenter: [number, number], isLocationActive: boolean) => {
    if (!map.current || !isMapInitialized) return;
    
    // Update map center
    map.current.flyTo({
      center: newCenter,
      zoom: map.current.getZoom(),
      speed: 1.5,
      curve: 1,
      essential: true
    });
    
    // Add or update center marker if location is active
    if (isLocationActive) {
      if (centerMarker.current) {
        centerMarker.current.setLngLat(newCenter);
      } else {
        // Create a custom marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'center-marker';
        markerEl.innerHTML = `
          <div class="relative">
            <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            <div class="absolute -inset-2 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
          </div>
        `;
        
        centerMarker.current = new mapboxgl.Marker(markerEl)
          .setLngLat(newCenter)
          .addTo(map.current);
      }
    } else if (centerMarker.current) {
      // Remove center marker if location is not active
      centerMarker.current.remove();
      centerMarker.current = null;
    }
  };

  return {
    map: map.current,
    isMapInitialized,
    centerMarker: centerMarker.current,
    updateMapCenter,
    updateMapStyle
  };
};

export default useMapInitialization;
