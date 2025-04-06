
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Result } from '@/components/ResultsList';

interface UseMarkerSelectionProps {
  map: mapboxgl.Map | null;
  markers: mapboxgl.Marker[];
  results: Result[];
  selectedResultId?: string;
}

/**
 * Hook to manage marker selection and visibility
 */
export const useMarkerSelection = ({
  map,
  markers,
  results,
  selectedResultId
}: UseMarkerSelectionProps) => {

  // Show popup for the selected result
  useEffect(() => {
    if (!map || !selectedResultId) return;
    
    const selectedMarker = markers.find((_, i) => 
      results[i]?.id === selectedResultId
    );
    
    if (selectedMarker && !selectedMarker.getPopup().isOpen()) {
      try {
        setTimeout(() => {
          selectedMarker.togglePopup();
          
          // Center and zoom to the selected marker
          const selectedResult = results.find(r => r.id === selectedResultId);
          if (selectedResult && map) {
            map.flyTo({
              center: [selectedResult.longitude, selectedResult.latitude],
              zoom: 14,
              padding: { top: 50, bottom: 50, left: 50, right: 50 }
            });
          }
        }, 300);
      } catch (error) {
        console.error("Error showing popup for selected result:", error);
      }
    }
  }, [map, markers, results, selectedResultId]);

  return {
    hideAllPopupsExcept: (markerToKeepOpen: mapboxgl.Marker | null) => {
      markers.forEach(m => {
        if (m !== markerToKeepOpen && m.getPopup().isOpen()) {
          m.getPopup().remove();
        }
      });
    }
  };
};

export default useMarkerSelection;
