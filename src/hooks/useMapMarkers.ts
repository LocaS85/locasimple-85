
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
        
        // Create rich popup content with more details
        const popupContent = `
          <div class="p-2 max-w-64">
            <h3 class="font-bold text-sm">${result.name}</h3>
            <p class="text-xs text-gray-500">${result.address}</p>
            <div class="flex items-center gap-2 mt-1 text-xs">
              <span class="font-medium">${result.distance.toFixed(1)} km</span>
              <span>·</span>
              <span class="font-medium">${result.duration} min</span>
            </div>
            ${result.openingHours ? `<div class="text-xs mt-1 text-gray-500">${result.openingHours}</div>` : ''}
            ${result.rating ? `<div class="flex items-center gap-1 mt-1">
              <span class="text-amber-400">★</span>
              <span class="text-xs">${result.rating}</span>
            </div>` : ''}
            ${result.description ? `<div class="text-xs mt-1 text-gray-600">${result.description}</div>` : ''}
            <div class="mt-2 flex items-center gap-2">
              <button class="text-xs text-blue-500 hover:text-blue-700 route-btn" data-id="${result.id}">
                Voir l'itinéraire
              </button>
              <span>·</span>
              <button class="text-xs text-green-500 hover:text-green-700 details-btn" data-id="${result.id}">
                Plus d'infos
              </button>
              <span>·</span>
              <button class="text-xs text-purple-500 hover:text-purple-700 start-navigation-btn" data-id="${result.id}">
                Naviguer
              </button>
            </div>
          </div>
        `;

        // Create popup but don't add it yet
        const popup = new mapboxgl.Popup({ 
          offset: 25, 
          closeButton: true,
          closeOnClick: false,
          maxWidth: '300px',
          className: isSelected ? 'active-popup' : ''
        })
        .setHTML(popupContent);
        
        // Add event listener to popup content
        popup.on('open', () => {
          // Add event listeners to buttons inside popup
          setTimeout(() => {
            const routeBtn = document.querySelector(`.route-btn[data-id="${result.id}"]`);
            if (routeBtn) {
              routeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (onResultClick) {
                  onResultClick(result);
                }
              });
            }
            
            const detailsBtn = document.querySelector(`.details-btn[data-id="${result.id}"]`);
            if (detailsBtn) {
              detailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Show details dialog or expand info
                if (onResultClick) {
                  onResultClick(result);
                }
                
                // Example: zoom to location with animation
                map.flyTo({
                  center: [result.longitude, result.latitude],
                  zoom: 15,
                  speed: 1.5,
                  curve: 1.42
                });
              });
            }
          }, 100);
        });

        // Create and add marker
        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'bottom',
          offset: [0, -5]
        })
        .setLngLat([result.longitude, result.latitude])
        .addTo(map);
          
        // Store popup in marker so we can access it later
        marker.setPopup(popup);
        
        // Make marker bounce on hover
        el.addEventListener('mouseenter', () => {
          el.style.transition = 'transform 0.3s';
          el.style.transform = 'scale(1.2) translateY(-5px)';
        });
        
        el.addEventListener('mouseleave', () => {
          el.style.transform = isSelected ? 'scale(1.2)' : 'scale(1)';
        });
        
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
    }
    
    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      popupsRef.current.forEach(popup => popup.remove());
    };
  }, [map, mapReady, results, selectedResultId, onResultClick]);

  return {
    markers: markersRef.current,
    popups: popupsRef.current
  };
};

export default useMapMarkers;
