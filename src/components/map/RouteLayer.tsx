
import React, { useEffect } from 'react';
import { useRouteCalculation } from '@/hooks/useRouteCalculation';
import { useRoutePopup } from '@/hooks/useRoutePopup';
import { getTransportModeColor } from '@/data/transportModes';

interface RouteLayerProps {
  map: mapboxgl.Map | null;
  start: [number, number];
  end: [number, number];
  color: string;
  transportMode: string;
  placeName?: string;
  showDistance?: boolean;
  showDuration?: boolean;
}

const RouteLayer: React.FC<RouteLayerProps> = ({ 
  map, 
  start, 
  end, 
  color, 
  transportMode,
  placeName,
  showDistance = true,
  showDuration = true
}) => {
  // Use the transportMode to determine the color
  const modeColor = getTransportModeColor(transportMode);
  const routeColor = modeColor || color;
  
  const sourceId = `route-${routeColor.replace('#', '')}-${transportMode}`;
  const layerId = `route-${routeColor.replace('#', '')}-${transportMode}`;

  const { routeInfo, calculateRoute } = useRouteCalculation(
    map,
    transportMode,
    sourceId,
    layerId,
    routeColor
  );

  const { showPopup, cleanupPopup } = useRoutePopup(
    map,
    placeName,
    showDistance,
    showDuration,
    routeInfo
  );

  useEffect(() => {
    let isMounted = true;

    const initializeRoute = async () => {
      if (!map || !map.getContainer()) return;

      try {
        const route = await calculateRoute(start, end);
        
        if (route && route.length > 0 && isMounted && placeName) {
          const midIndex = Math.floor(route.length / 2);
          const midpoint = route[midIndex];
          setTimeout(() => {
            if (isMounted && map.getContainer()) {
              showPopup(midpoint);
            }
          }, 300);
        }
      } catch (error) {
        console.error("Error initializing route:", error);
      }
    };

    if (map?.isStyleLoaded()) {
      initializeRoute();
    } else {
      map?.once('load', initializeRoute);
    }

    return () => {
      isMounted = false;
      cleanupPopup();
      
      if (map) {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      }
    };
  }, [map, start, end, transportMode, placeName]);

  return null;
};

export default RouteLayer;
