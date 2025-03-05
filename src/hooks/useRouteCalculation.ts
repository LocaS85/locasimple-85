
import { useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

interface RouteInfo {
  distance?: number;
  duration?: number;
  steps?: any[];
}

export const useRouteCalculation = (
  map: mapboxgl.Map | null,
  transportMode: string,
  sourceId: string,
  layerId: string,
  color: string
) => {
  const [routeInfo, setRouteInfo] = useState<RouteInfo>({});

  const calculateRoute = async (start: [number, number], end: [number, number]) => {
    if (!map || !MAPBOX_TOKEN) {
      console.log("Map or token not available for route calculation");
      return;
    }

    try {
      // Remove existing route if present
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }

      // Fetch route from Mapbox Directions API
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&overview=full&language=fr&access_token=${MAPBOX_TOKEN}`
      );
      
      if (!query.ok) {
        throw new Error(`API request failed with status ${query.status}`);
      }
      
      const json = await query.json();
      
      if (!json.routes || json.routes.length === 0) {
        console.warn("No routes found in API response");
        return;
      }
      
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      // Store route information
      setRouteInfo({
        distance: data.distance / 1000, // Convert to km
        duration: Math.round(data.duration / 60), // Convert to minutes
        steps: data.legs?.[0]?.steps || []
      });

      // Create GeoJSON for the route
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };

      // Add source and layer to map
      map.addSource(sourceId, {
        type: 'geojson',
        data: geojson as any
      });

      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': color,
          'line-width': 4,
          'line-opacity': 0.75
        }
      });

      // Add route animation
      let step = 0;
      const animationSpeed = 50; // Points per frame
      
      // Create a point that moves along the route
      if (!map.getLayer(`${layerId}-moving-point`)) {
        // Add moving point only if it doesn't exist yet
        map.addSource(`${sourceId}-point`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: route[0]
            }
          }
        });

        map.addLayer({
          id: `${layerId}-moving-point`,
          source: `${sourceId}-point`,
          type: 'circle',
          paint: {
            'circle-radius': 5,
            'circle-color': color,
            'circle-opacity': 0.8,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff'
          }
        });

        // Animate the point
        const animate = () => {
          if (step >= route.length - 1) {
            return;
          }
          
          step = Math.min(step + animationSpeed, route.length - 1);
          
          // Fix the TypeScript error by correctly casting the source to GeoJSONSource
          const pointSource = map.getSource(`${sourceId}-point`) as mapboxgl.GeoJSONSource;
          if (pointSource && pointSource.setData) {
            pointSource.setData({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: route[step]
              }
            });
          }
          
          if (step < route.length - 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      }

      return route;
    } catch (error) {
      console.error('Error calculating route:', error);
      toast.error('Impossible de calculer l\'itinéraire');
      return null;
    }
  };

  return {
    routeInfo,
    calculateRoute
  };
};
