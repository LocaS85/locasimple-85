
import { useState, useEffect } from 'react';
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
  const [animationFrameId, setAnimationFrameId] = useState<number | null>(null);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [animationFrameId]);

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
      
      // Remove point animation layer and source if they exist
      if (map.getLayer(`${layerId}-moving-point`)) {
        map.removeLayer(`${layerId}-moving-point`);
      }
      if (map.getSource(`${sourceId}-point`)) {
        map.removeSource(`${sourceId}-point`);
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

      // Add source and layer to map with an initially invisible route
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
          'line-opacity': 0,
          'line-dasharray': [0, 4, 3]
        }
      });

      // Animate the line opacity and dash pattern
      let startTime: number;
      const duration = 1500; // Animation duration in ms
      
      const animateLine = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / duration;
        
        if (progress <= 1) {
          // Gradually reveal the line
          map.setPaintProperty(layerId, 'line-opacity', Math.min(progress * 1.5, 0.75));
          
          // Animate the dash pattern
          const dashValue = [
            Math.max(0, 4 - progress * 4), // First value reduces to 0
            Math.max(0, 4 - progress * 4), // Gap reduces to 0
            Math.min(3 + progress * 2, 5)  // Dash value increases
          ];
          
          map.setPaintProperty(layerId, 'line-dasharray', dashValue);
          
          // Continue animation
          const frameId = requestAnimationFrame(animateLine);
          setAnimationFrameId(frameId);
        } else {
          // Animation complete
          map.setPaintProperty(layerId, 'line-opacity', 0.75);
          map.setPaintProperty(layerId, 'line-dasharray', [0, 0, 1]);
          setAnimationFrameId(null);
          
          // Now add the moving point animation
          addMovingPoint(route);
        }
      };
      
      // Start the line animation
      requestAnimationFrame(animateLine);
      
      // Function to add moving point animation after line is drawn
      const addMovingPoint = (routeCoords: [number, number][]) => {
        let step = 0;
        const animationSpeed = 50; // Points per frame
        
        // Create a point that moves along the route
        map.addSource(`${sourceId}-point`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: routeCoords[0]
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
          if (step >= routeCoords.length - 1) {
            return;
          }
          
          step = Math.min(step + animationSpeed, routeCoords.length - 1);
          
          // Fix the TypeScript error by correctly casting the source to GeoJSONSource
          const pointSource = map.getSource(`${sourceId}-point`) as mapboxgl.GeoJSONSource;
          if (pointSource && pointSource.setData) {
            pointSource.setData({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: routeCoords[step]
              }
            });
          }
          
          if (step < routeCoords.length - 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      };

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
