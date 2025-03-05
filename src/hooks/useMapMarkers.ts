
import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Result } from '@/components/ResultsList';

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
        
        // Create marker element
        const el = document.createElement('div');
        el.className = 'marker cursor-pointer';
        el.innerHTML = `<div class="bg-white rounded-full p-1.5 shadow-lg border-2 ${isSelected ? `border-${result.color}-500` : 'border-white'} transition-all hover:scale-110">
          <div class="rounded-full w-6 h-6 flex items-center justify-center bg-${result.color}-500 text-white font-bold">
            ${index + 1}
          </div>
        </div>`;
        el.style.width = '36px';
        el.style.height = '36px';
        el.style.transform = isSelected ? 'scale(1.2)' : 'scale(1)';
        
        // Create popup content
        const popupContent = `
          <div class="p-2 max-w-64">
            <h3 class="font-bold text-sm">${result.name}</h3>
            <p class="text-xs text-gray-500">${result.address}</p>
            <div class="flex items-center gap-2 mt-1 text-xs">
              <span>${result.distance.toFixed(1)} km</span>
              <span>·</span>
              <span>${result.duration} min</span>
            </div>
            ${result.openingHours ? `<div class="text-xs mt-1 text-gray-500">${result.openingHours}</div>` : ''}
            ${result.rating ? `<div class="flex items-center gap-1 mt-1">
              <span class="text-amber-400">★</span>
              <span class="text-xs">${result.rating}</span>
            </div>` : ''}
          </div>
        `;

        // Create popup but don't add it yet
        const popup = new mapboxgl.Popup({ 
          offset: 25, 
          closeButton: false,
          className: isSelected ? 'active-popup' : ''
        })
        .setHTML(popupContent);

        // Create and add marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([result.longitude, result.latitude])
          .addTo(map);
          
        // Store popup in marker so we can access it later
        marker.setPopup(popup);
        
        // Add click event to marker to show popup
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          
          try {
            // Hide all other popups
            markersRef.current.forEach(m => {
              if (m !== marker && m.getPopup().isOpen()) {
                m.getPopup().remove();
              }
            });
            
            // Toggle this popup
            if (!marker.getPopup().isOpen()) {
              marker.togglePopup();
            }
            
            // Call the result click handler
            if (onResultClick) {
              onResultClick(result);
            }
          } catch (error) {
            console.error("Error handling marker click:", error);
          }
        });

        markersRef.current.push(marker);
        popupsRef.current.push(popup);
      } catch (error) {
        console.error("Error adding marker:", error);
      }
    });

    // Show popup for the selected result
    if (selectedResultId) {
      const selectedMarker = markersRef.current.find((_, i) => 
        results[i].id === selectedResultId
      );
      
      if (selectedMarker && !selectedMarker.getPopup().isOpen()) {
        try {
          setTimeout(() => {
            selectedMarker.togglePopup();
          }, 300);
        } catch (error) {
          console.error("Error showing popup for selected result:", error);
        }
      }
    }
  }, [map, mapReady, results, selectedResultId, onResultClick]);

  return {
    markers: markersRef.current,
    popups: popupsRef.current
  };
};

export default useMapMarkers;
