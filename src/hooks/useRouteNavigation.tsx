
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '@/config/environment';

interface UseRouteDisplayProps {
  map: mapboxgl.Map | null;
  mapReady: boolean;
  start: [number, number];
  end: [number, number];
  transportMode: string;
  routeColor: string;
}

export const useRouteDisplay = ({
  map,
  mapReady,
  start,
  end,
  transportMode,
  routeColor
}: UseRouteDisplayProps) => {
  const routeSource = useRef<string>('navigation-route');

  // Update route when transportMode changes
  useEffect(() => {
    if (!mapReady || !map) return;
    
    const fetchAndDisplayRoute = async () => {
      try {
        // Fetch route from Mapbox Directions API
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&overview=full&language=fr&access_token=${MAPBOX_TOKEN}`
        );
        
        if (!query.ok) {
          throw new Error(`Route API request failed with status ${query.status}`);
        }
        
        const json = await query.json();
        
        if (!json.routes || json.routes.length === 0) {
          console.warn("No routes found in API response");
          return;
        }
        
        const data = json.routes[0];
        const route = data.geometry.coordinates;

        // Remove existing route if present
        if (map.getLayer('route-line')) {
          map.removeLayer('route-line');
        }
        if (map.getLayer('route-casing')) {
          map.removeLayer('route-casing');
        }
        if (map.getSource(routeSource.current)) {
          map.removeSource(routeSource.current);
        }

        // Add the route source
        map.addSource(routeSource.current, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route
            }
          }
        });

        // Add route casing (outline)
        map.addLayer({
          id: 'route-casing',
          type: 'line',
          source: routeSource.current,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#ffffff',
            'line-width': 8,
            'line-opacity': 0.75
          }
        });

        // Add route line
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: routeSource.current,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': routeColor,
            'line-width': 5,
            'line-opacity': 1
          }
        });

        // Fit bounds to show the entire route
        const bounds = new mapboxgl.LngLatBounds();
        route.forEach(point => bounds.extend(point as mapboxgl.LngLatLike));
        map.fitBounds(bounds, { padding: 80 });

      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchAndDisplayRoute();
  }, [mapReady, start, end, transportMode, routeColor, map]);
};
