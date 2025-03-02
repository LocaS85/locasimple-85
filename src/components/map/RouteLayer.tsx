import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface RouteLayerProps {
  map: mapboxgl.Map | null;
  start: [number, number];
  end: [number, number];
  color: string;
  transportMode: string;
  mapboxToken: string;
}

const RouteLayer: React.FC<RouteLayerProps> = ({ 
  map, 
  start, 
  end, 
  color, 
  transportMode,
  mapboxToken
}) => {
  useEffect(() => {
    const addRoute = async () => {
      if (!map || !mapboxToken) return;

      try {
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxToken}`
        );
        const json = await query.json();
        const data = json.routes[0];
        const route = data.geometry.coordinates;

        const geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        };

        const sourceId = `route-${color}`;
        const layerId = `route-${color}`;

        // If the source already exists, update the data
        if (map.getSource(sourceId)) {
          const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
          source.setData(geojson as any);
        } else {
          // Otherwise, add a new source and layer
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
        }
      } catch (error) {
        console.error('Error adding route:', error);
      }
    };

    addRoute();
  }, [map, start, end, color, transportMode, mapboxToken]);

  return null;
};

export default RouteLayer;
