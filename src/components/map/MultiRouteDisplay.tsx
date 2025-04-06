import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

export interface MultiRouteDisplayProps {
  map?: mapboxgl.Map | null;
  userLocation: [number, number];
  destinations: any[];
  transportMode: string;
}

const MultiRouteDisplay: React.FC<MultiRouteDisplayProps> = ({
  map,
  userLocation,
  destinations,
  transportMode
}) => {
  const [routeLayers, setRouteLayers] = useState<mapboxgl.Layer[]>([]);
  
  useEffect(() => {
    if (!map || !map.loaded() || !userLocation || destinations.length === 0) return;
    
    // Clear previous routes
    routeLayers.forEach(layer => {
      if (map.getLayer(layer.id)) {
        map.removeLayer(layer.id);
      }
      if (map.getSource(layer.id)) {
        map.removeSource(layer.id);
      }
    });
    
    // Add routes for each destination
    const drawRoutes = async () => {
      const newLayers: mapboxgl.Layer[] = [];
      
      for (const destination of destinations) {
        try {
          const routeId = `route-${destination.id}`;
          const start = userLocation;
          const end = [destination.longitude || destination.lon, destination.latitude || destination.lat];
          
          // Get route data from Mapbox Directions API
          const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
          );
          
          const json = await query.json();
          const data = json.routes[0];
          
          if (!data) {
            console.warn(`No route found for destination ${destination.name}`);
            continue;
          }
          
          const route = data.geometry.coordinates;
          
          // Add the route source
          if (map.getSource(routeId)) {
            map.removeSource(routeId);
          }
          
          map.addSource(routeId, {
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
          
          // Add the route layer
          const layerId = `route-layer-${destination.id}`;
          
          if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
          
          map.addLayer({
            id: layerId,
            type: 'line',
            source: routeId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': destination.color || '#3887be',
              'line-width': 5,
              'line-opacity': 0.75
            }
          });
          
          // Add the layer to our tracking array
          newLayers.push({
            id: layerId,
            type: 'line',
            source: routeId
          } as mapboxgl.Layer);
          
          // Add a point for the destination
          const pointId = `point-${destination.id}`;
          
          if (map.getSource(pointId)) {
            map.removeSource(pointId);
          }
          
          map.addSource(pointId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: end
              }
            }
          });
          
          const pointLayerId = `point-layer-${destination.id}`;
          
          if (map.getLayer(pointLayerId)) {
            map.removeLayer(pointLayerId);
          }
          
          map.addLayer({
            id: pointLayerId,
            type: 'circle',
            source: pointId,
            paint: {
              'circle-radius': 8,
              'circle-color': destination.color || '#3887be',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff'
            }
          });
          
          newLayers.push({
            id: pointLayerId,
            type: 'circle',
            source: pointId
          } as mapboxgl.Layer);
          
        } catch (error) {
          console.error('Error drawing route:', error);
        }
      }
      
      setRouteLayers(newLayers);
    };
    
    drawRoutes();
    
    return () => {
      // Cleanup routes on unmount
      if (map && map.loaded()) {
        routeLayers.forEach(layer => {
          if (map.getLayer(layer.id)) {
            map.removeLayer(layer.id);
          }
          if (map.getSource(layer.id)) {
            map.removeSource(layer.id);
          }
        });
      }
    };
  }, [map, userLocation, destinations, transportMode]);
  
  return null; // This is a utility component that doesn't render UI
};

export default MultiRouteDisplay;
