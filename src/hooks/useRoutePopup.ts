
import { useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

interface RouteInfo {
  distance: number;
  duration: number;
  coordinates: any[];
}

export const useRoutePopup = (
  map: mapboxgl.Map | null,
  placeName?: string,
  showDistance = true,
  showDuration = true,
  routeInfo?: RouteInfo
) => {
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  const cleanupPopup = useCallback(() => {
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
  }, []);

  const showPopup = useCallback(
    (coordinates: [number, number]) => {
      if (!map || !placeName) return;

      // Clean up existing popup
      cleanupPopup();

      // Format distance and duration
      const distance = routeInfo?.distance ? (routeInfo.distance / 1000).toFixed(1) : '?';
      const duration = routeInfo?.duration ? Math.round(routeInfo.duration / 60) : '?';

      // Create HTML content
      const html = `
        <div class="route-popup">
          <h4 class="font-medium text-sm">${placeName}</h4>
          ${
            showDistance || showDuration
              ? `<div class="text-xs text-gray-600 mt-1">
                  ${showDistance ? `${distance} km` : ''}
                  ${showDistance && showDuration ? ' • ' : ''}
                  ${showDuration ? `${duration} min` : ''}
                </div>`
              : ''
          }
          <div class="mt-2">
            <button class="start-navigation-btn bg-blue-500 text-white text-xs px-2 py-1 rounded">
              Démarrer la navigation
            </button>
          </div>
        </div>
      `;

      // Create and add the popup
      popupRef.current = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        className: 'route-popup'
      })
        .setLngLat(coordinates)
        .setHTML(html)
        .addTo(map);
    },
    [map, placeName, showDistance, showDuration, routeInfo, cleanupPopup]
  );

  return {
    showPopup,
    cleanupPopup
  };
};

export default useRoutePopup;
