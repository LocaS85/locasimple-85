
import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseMarkerManagementOptions {
  map: mapboxgl.Map | null;
  center: [number, number];
  isMapInitialized: boolean;
  isLocationActive: boolean;
}

interface UseMarkerManagementResult {
  centerMarker: mapboxgl.Marker | null;
  updateMarkerPosition: (center: [number, number], isLocationActive: boolean) => void;
}

export const useMarkerManagement = ({
  map,
  center,
  isMapInitialized,
  isLocationActive
}: UseMarkerManagementOptions): UseMarkerManagementResult => {
  const centerMarker = useRef<mapboxgl.Marker | null>(null);

  // Initialize or update marker based on location active state
  useEffect(() => {
    if (!map || !isMapInitialized) return;
    
    if (isLocationActive) {
      if (centerMarker.current) {
        centerMarker.current.setLngLat(center);
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
          .setLngLat(center)
          .addTo(map);
      }
    } else if (centerMarker.current) {
      // Remove center marker if location is not active
      centerMarker.current.remove();
      centerMarker.current = null;
    }
    
    return () => {
      if (centerMarker.current) {
        centerMarker.current.remove();
        centerMarker.current = null;
      }
    };
  }, [map, center, isMapInitialized, isLocationActive]);

  // Update marker position
  const updateMarkerPosition = (newCenter: [number, number], isActive: boolean) => {
    if (!map || !isMapInitialized) return;
    
    if (isActive) {
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
          .addTo(map);
      }
    } else if (centerMarker.current) {
      // Remove center marker if location is not active
      centerMarker.current.remove();
      centerMarker.current = null;
    }
  };

  return {
    centerMarker: centerMarker.current,
    updateMarkerPosition
  };
};

export default useMarkerManagement;
