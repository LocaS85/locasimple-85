
import mapboxgl from 'mapbox-gl';
import type { Result } from '@/components/ResultsList';

/**
 * Creates a marker element with the appropriate styling
 * @param index Index for numbering the marker
 * @param result The result data
 * @param isSelected Whether this marker is currently selected
 * @returns HTMLDivElement for the marker
 */
export const createMarkerElement = (
  index: number,
  result: Result,
  isSelected: boolean
): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'marker cursor-pointer';
  el.innerHTML = `<div class="bg-white rounded-full p-1.5 shadow-lg border-2 ${
    isSelected ? `border-${result.color}-500` : 'border-white'
  } transition-all hover:scale-110">
    <div class="rounded-full w-6 h-6 flex items-center justify-center bg-${
      result.color
    }-500 text-white font-bold">
      ${index + 1}
    </div>
  </div>`;
  el.style.width = '36px';
  el.style.height = '36px';
  el.style.transform = isSelected ? 'scale(1.2)' : 'scale(1)';
  
  return el;
};

/**
 * Creates popup content HTML for a result
 * @param result The result data
 * @returns HTML string for popup content
 */
export const createPopupContent = (result: Result): string => {
  return `
    <div class="p-2 max-w-64">
      <h3 class="font-bold text-sm">${result.name}</h3>
      <p class="text-xs text-gray-500">${result.address}</p>
      <div class="flex items-center gap-2 mt-1 text-xs">
        <span class="font-medium">${result.distance.toFixed(1)} km</span>
        <span>·</span>
        <span class="font-medium">${result.duration} min</span>
      </div>
      ${result.openingHours ? `<div class="text-xs mt-1 text-gray-500">${result.openingHours}</div>` : ''}
      ${
        result.rating
          ? `<div class="flex items-center gap-1 mt-1">
              <span class="text-amber-400">★</span>
              <span class="text-xs">${result.rating}</span>
            </div>`
          : ''
      }
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
};

/**
 * Configures event handlers for a marker element
 * @param el The marker HTML element
 * @param marker The mapboxgl marker instance
 * @param result The associated result data
 * @param isSelected Whether the marker is selected
 * @param onResultClick Callback for when the marker is clicked
 */
export const setupMarkerEventHandlers = (
  el: HTMLDivElement,
  marker: mapboxgl.Marker,
  result: Result,
  isSelected: boolean,
  onResultClick?: (result: Result) => void
): void => {
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
};

/**
 * Configures popup event handlers
 * @param popup The mapboxgl popup instance
 * @param result The associated result data
 * @param map The mapboxgl map instance
 * @param onResultClick Callback for when a result is clicked
 */
export const setupPopupEventHandlers = (
  popup: mapboxgl.Popup,
  result: Result,
  map: mapboxgl.Map,
  onResultClick?: (result: Result) => void
): void => {
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
};
