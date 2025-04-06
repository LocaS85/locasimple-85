
import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Result } from '@/components/ResultsList';
import { 
  createMarkerElement, 
  createPopupContent,
  setupMarkerEventHandlers,
  setupPopupEventHandlers
} from '@/utils/markerUtils';
import { useMarkerSelection } from '@/hooks/useMarkerSelection';

interface UseMapMarkersProps {
  map: mapboxgl.Map | null;
  results: Result[];
  mapReady: boolean;
  selectedResultId?: string;
  onResultClick?: (result: Result) => void;
}

export const useMapMarkers = ({
  map,
  results,
  mapReady,
  selectedResultId,
  onResultClick
}: UseMapMarkersProps) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);
  
  // Create and manage map markers
  useEffect(() => {
    if (!map || !mapReady) {
      console.log("Map not ready for markers yet");
      return;
    }

    console.log(`Adding ${results.length} markers to map`);

    // Clear existing markers and popups
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    popupsRef.current.forEach(popup => popup.remove());
    popupsRef.current = [];

    // Add new markers
    results.forEach((result, index) => {
      try {
        const isSelected = result.id === selectedResultId;
        
        // Create marker element using utility
        const el = createMarkerElement(index, result, isSelected);
        
        // Create popup content with details
        const popupContent = createPopupContent(result);

        // Create popup but don't add it yet
        const popup = new mapboxgl.Popup({ 
          offset: 25, 
          closeButton: true,
          closeOnClick: false,
          maxWidth: '300px',
          className: isSelected ? 'active-popup' : ''
        }).setHTML(popupContent);
        
        // Set up popup event handlers
        setupPopupEventHandlers(popup, result, map, onResultClick);

        // Create and add marker
        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'bottom',
          offset: [0, -5]
        })
        .setLngLat([result.longitude, result.latitude])
        .addTo(map);
          
        // Store popup in marker
        marker.setPopup(popup);
        
        // Set up marker event handlers
        setupMarkerEventHandlers(el, marker, result, isSelected, (selectedResult) => {
          // Hide all other popups
          markerSelection.hideAllPopupsExcept(marker);
          
          if (onResultClick) {
            onResultClick(selectedResult);
          }
        });

        markersRef.current.push(marker);
        popupsRef.current.push(popup);
      } catch (error) {
        console.error("Error adding marker:", error);
      }
    });

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      popupsRef.current.forEach(popup => popup.remove());
    };
  }, [map, mapReady, results, selectedResultId, onResultClick]);

  // Use the marker selection hook
  const markerSelection = useMarkerSelection({
    map,
    markers: markersRef.current,
    results,
    selectedResultId
  });

  return {
    markers: markersRef.current,
    popups: popupsRef.current
  };
};

export default useMapMarkers;
