
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
  // Fit bounds to show all markers
  useEffect(() => {
    if (!map || !mapReady || results.length === 0) return;
    
    try {
      console.log("Fitting bounds to show all markers");
      const bounds = new mapboxgl.LngLatBounds();
      
      // Add center point to bounds
      bounds.extend(center);
      
      // Add all result locations to bounds
      results.forEach(result => {
        bounds.extend([result.longitude, result.latitude]);
      });
      
      // Fit the map to these bounds with padding
      map.fitBounds(bounds, { padding: 50 });
      
      // Callback when markers are ready
      if (onMarkersReady) {
        onMarkersReady();
      }
    } catch (error) {
      console.error("Error fitting bounds:", error);
    }
  }, [map, mapReady, results, center, onMarkersReady]);
};

export default useMapBounds;
