
import { useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

interface RouteInfo {
  distance: number;
  duration: number;
  coordinates: [number, number][];
}

export const useRoutePopup = (
  map: mapboxgl.Map | null,
  placeName?: string,
  showDistance?: boolean,
  showDuration?: boolean,
  routeInfo?: RouteInfo
) => {
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  const formatDuration = (seconds: number): string => {
    if (!seconds) return '';
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}min` : ''}`;
  };

  const formatDistance = (meters: number): string => {
    if (!meters) return '';
    const km = meters / 1000;
    return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
  };

  const showPopup = useCallback(
    (coordinate: [number, number]) => {
      if (!map) return;

      // Remove existing popup
      if (popupRef.current) {
        popupRef.current.remove();
      }

      // Don't show popup if no place name
      if (!placeName) return;

      // Create HTML content for popup
      let popupContent = `<div class="text-sm font-medium">${placeName}</div>`;
      
      // Add distance and duration if available
      if (routeInfo) {
        if (showDistance && routeInfo.distance) {
          popupContent += `<div class="text-xs text-gray-600 mt-1">Distance: ${formatDistance(routeInfo.distance)}</div>`;
        }
        
        if (showDuration && routeInfo.duration) {
          popupContent += `<div class="text-xs text-gray-600">Durée: ${formatDuration(routeInfo.duration)}</div>`;
        }
      }

      // Create popup
      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        className: 'route-popup',
        maxWidth: '220px',
        offset: 15
      })
        .setLngLat(coordinate)
        .setHTML(popupContent)
        .addTo(map);

      popupRef.current = popup;
    },
    [map, placeName, showDistance, showDuration, routeInfo]
  );

  const cleanupPopup = useCallback(() => {
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
  }, []);

  return {
    showPopup,
    cleanupPopup
  };
};

export default useRoutePopup;
