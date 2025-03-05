
import { useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

interface RouteInfo {
  distance?: number;
  duration?: number;
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
        `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`
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
        duration: Math.round(data.duration / 60) // Convert to minutes
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
