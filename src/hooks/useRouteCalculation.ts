
import { useState, useCallback, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '@/config/environment';

interface RouteInfo {
  distance: number;
  duration: number;
  coordinates: [number, number][];
}

export const useRouteCalculation = (
  map: mapboxgl.Map | null,
  transportMode: string,
  sourceId: string,
  layerId: string,
  routeColor: string
) => {
  const [routeInfo, setRouteInfo] = useState<RouteInfo>({
    distance: 0,
    duration: 0,
    coordinates: []
  });

  const calculateRoute = useCallback(
    async (start: [number, number], end: [number, number]): Promise<[number, number][]> => {
      if (!map || !MAPBOX_TOKEN) {
        console.warn('Map or Mapbox token not available');
        return [];
      }

      try {
        // Format coordinates for Mapbox API
        const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
        
        // Use the appropriate API endpoint based on transport mode
        const url = `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${coordinates}?alternatives=false&geometries=geojson&steps=true&access_token=${MAPBOX_TOKEN}&language=fr`;
        
        console.log(`Calculating route from [${start}] to [${end}] using ${transportMode} mode`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to calculate route: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.routes || data.routes.length === 0) {
          console.warn('No routes found');
          return [];
        }
        
        // Get the first route
        const route = data.routes[0];
        const routeCoordinates = route.geometry.coordinates;
        
        // Update route info state
        setRouteInfo({
          distance: route.distance,
          duration: route.duration,
          coordinates: routeCoordinates
        });
        
        // Add the route source if it doesn't exist
        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates
              }
            }
          });
        } else {
          // Update the existing source
          const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
          source.setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: routeCoordinates
            }
          });
        }
        
        // Add the route layer if it doesn't exist
        if (!map.getLayer(layerId)) {
          map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': routeColor,
              'line-width': 5,
              'line-opacity': 0.8
            }
          });
        }
        
        return routeCoordinates;
      } catch (error) {
        console.error('Error calculating route:', error);
        return [];
      }
    },
    [map, transportMode, sourceId, layerId, routeColor]
  );

  return {
    routeInfo,
    calculateRoute
  };
};

export default useRouteCalculation;
