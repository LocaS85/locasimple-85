
import { useRef, useEffect, useState } from 'react';
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
  const [isMarkerReady, setIsMarkerReady] = useState(false);

  // Initialize or update marker based on location active state
  useEffect(() => {
    if (!map || !isMapInitialized) {
      console.log("Map not initialized for marker management");
      return;
    }
    
    // Make sure map has valid container
    if (!map.getContainer()) {
      console.warn("Map container not accessible for marker initialization");
      return;
    }
    
    let isMounted = true;
    
    const setupMarker = () => {
      try {
        if (!isMounted || !map.getContainer()) return;
        
        if (isLocationActive) {
          if (centerMarker.current) {
            console.log("Updating existing center marker position to", center);
            centerMarker.current.setLngLat(center);
          } else {
            console.log("Creating new center marker at", center);
            // Create a custom marker element
            const markerEl = document.createElement('div');
            markerEl.className = 'center-marker';
            markerEl.innerHTML = `
              <div class="relative">
                <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                <div class="absolute -inset-2 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
              </div>
            `;
            
            // Create and add marker
            const newMarker = new mapboxgl.Marker(markerEl)
              .setLngLat(center);
              
            // Only add to map if it's still valid
            if (map.getContainer()) {
              newMarker.addTo(map);
              centerMarker.current = newMarker;
              setIsMarkerReady(true);
            }
          }
        } else if (centerMarker.current) {
          console.log("Removing center marker as location is not active");
          // Remove center marker if location is not active
          centerMarker.current.remove();
          centerMarker.current = null;
          setIsMarkerReady(false);
        }
      } catch (error) {
        console.error("Error setting up map marker:", error);
        if (centerMarker.current) {
          centerMarker.current.remove();
        }
        centerMarker.current = null;
        setIsMarkerReady(false);
      }
    };
    
    // Initial setup
    setupMarker();
    
    return () => {
      isMounted = false;
      if (centerMarker.current) {
        try {
          centerMarker.current.remove();
        } catch (error) {
          console.error("Error removing marker during cleanup:", error);
        }
        centerMarker.current = null;
        setIsMarkerReady(false);
      }
    };
  }, [map, center, isMapInitialized, isLocationActive]);

  // Function to update marker position with safety checks
  const updateMarkerPosition = (newCenter: [number, number], isActive: boolean) => {
    if (!map || !isMapInitialized) {
      console.log("Map not ready for marker position update");
      return;
    }
    
    if (!map.getContainer()) {
      console.log("Map container not available for marker update");
      return;
    }
    
    try {
      if (isActive) {
        if (centerMarker.current) {
          console.log("Updating marker position to", newCenter);
          centerMarker.current.setLngLat(newCenter);
        } else {
          console.log("Creating new marker at", newCenter);
          // Create a custom marker element
          const markerEl = document.createElement('div');
          markerEl.className = 'center-marker';
          markerEl.innerHTML = `
            <div class="relative">
              <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
              <div class="absolute -inset-2 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
            </div>
          `;
          
          // Create and add marker if map is still valid
          if (map.getContainer()) {
            const newMarker = new mapboxgl.Marker(markerEl)
              .setLngLat(newCenter)
              .addTo(map);
              
            centerMarker.current = newMarker;
            setIsMarkerReady(true);
          }
        }
      } else if (centerMarker.current) {
        console.log("Removing marker as location is not active");
        // Remove center marker if location is not active
        centerMarker.current.remove();
        centerMarker.current = null;
        setIsMarkerReady(false);
      }
    } catch (error) {
      console.error("Error updating marker position:", error);
    }
  };

  return {
    centerMarker: centerMarker.current,
    updateMarkerPosition
  };
};

export default useMarkerManagement;
