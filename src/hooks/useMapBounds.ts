
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Result } from '@/components/ResultsList';

interface UseMapBoundsProps {
  map: mapboxgl.Map | null;
  results: Result[];
  center: [number, number];
  mapReady: boolean;
  onMarkersReady?: () => void;
}

export const useMapBounds = ({
  map,
  results,
  center,
  mapReady,
  onMarkersReady
}: UseMapBoundsProps) => {
  // Update map bounds when results or center changes
  useEffect(() => {
    if (!map || !mapReady) {
      console.log("Map not ready for bounds calculation");
      return;
    }

    // If we have results, fit bounds to include all markers
    if (results.length > 0) {
      try {
        const bounds = new mapboxgl.LngLatBounds();
        
        // Add user location to bounds
        bounds.extend(center);
        
        // Add all result locations to bounds
        results.forEach(result => {
          bounds.extend([result.longitude, result.latitude]);
        });
        
        // Check if bounds are valid
        if (bounds.isEmpty()) {
          console.log("Empty bounds, defaulting to center");
          map.flyTo({
            center: center,
            zoom: 13,
            essential: true
          });
        } else {
          // Fit map to bounds with padding
          map.fitBounds(bounds, {
            padding: { top: 100, bottom: 150, left: 100, right: 100 },
            maxZoom: 15,
            duration: 1000
          });
        }
        
        // Signal that markers are ready
        if (onMarkersReady) {
          onMarkersReady();
        }
      } catch (error) {
        console.error("Error calculating map bounds:", error);
        // Fallback to center
        map.flyTo({
          center: center,
          zoom: 12
        });
      }
    } else {
      // If no results, center on user location
      map.flyTo({
        center: center,
        zoom: 13,
        essential: true
      });
    }
  }, [map, results, center, mapReady, onMarkersReady]);
};

export default useMapBounds;
