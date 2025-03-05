
import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

export const useRoutePopup = (
  map: mapboxgl.Map | null,
  placeName?: string,
  showDistance?: boolean,
  showDuration?: boolean,
  routeInfo?: { distance?: number; duration?: number }
) => {
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  const cleanupPopup = () => {
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
  };

  const showPopup = (coordinates: [number, number]) => {
    if (!map || !placeName) return;

    cleanupPopup();

    const popupContent = document.createElement('div');
    popupContent.className = 'text-xs p-1';
    
    let popupHtml = `<strong>${placeName}</strong>`;
    if (showDistance && routeInfo?.distance) {
      popupHtml += `<br>${routeInfo.distance.toFixed(1)} km`;
    }
    if (showDuration && routeInfo?.duration) {
      popupHtml += `<br>${routeInfo.duration} min`;
    }
    
    popupContent.innerHTML = popupHtml;
    
    const newPopup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'route-popup',
      offset: 6
    })
    .setLngLat(coordinates)
    .setDOMContent(popupContent);
    
    popupRef.current = newPopup;
    
    if (map.getContainer()) {
      newPopup.addTo(map);
    }
  };

  useEffect(() => {
    return cleanupPopup;
  }, []);

  return {
    showPopup,
    cleanupPopup
  };
};
