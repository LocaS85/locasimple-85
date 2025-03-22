
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface UsePositionTrackerProps {
  map: mapboxgl.Map | null;
  mapReady: boolean;
  currentPosition: [number, number];
  currentStep: number;
  isFollowing: boolean;
  routeColor: string;
}

export const usePositionTracker = ({
  map,
  mapReady,
  currentPosition,
  currentStep,
  isFollowing,
  routeColor
}: UsePositionTrackerProps) => {
  const currentPositionSource = useRef<string>('current-position');
  const animationFrameRef = useRef<number | null>(null);
  const markerSizeRef = useRef<number>(12);

  // Add position marker
  useEffect(() => {
    if (!mapReady || !map) return;
    
    // Add user position marker (pulsing dot)
    if (!map.getSource(currentPositionSource.current)) {
      map.addSource(currentPositionSource.current, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: currentPosition
          },
          properties: {}
        }
      });

      map.addLayer({
        id: 'current-position-outer',
        type: 'circle',
        source: currentPositionSource.current,
        paint: {
          'circle-radius': 12,
          'circle-color': routeColor,
          'circle-opacity': 0.4,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF'
        }
      });

      map.addLayer({
        id: 'current-position-inner',
        type: 'circle',
        source: currentPositionSource.current,
        paint: {
          'circle-radius': 6,
          'circle-color': routeColor,
          'circle-opacity': 0.8
        }
      });

      // Add animated pulse effect
      const pulseAnimation = () => {
        if (!map) {
          animationFrameRef.current = null;
          return;
        }
        
        markerSizeRef.current = markerSizeRef.current + (markerSizeRef.current < 20 ? 0.3 : -10);
        map.setPaintProperty('current-position-outer', 'circle-radius', markerSizeRef.current);
        animationFrameRef.current = requestAnimationFrame(pulseAnimation);
      };

      animationFrameRef.current = requestAnimationFrame(pulseAnimation);
    } else {
      // Update existing source with new position
      const source = map.getSource(currentPositionSource.current) as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: currentPosition
          },
          properties: {}
        });
      }
    }

    // Clean up animation frame
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [mapReady, map, currentPosition, routeColor]);

  // Update camera position when following mode is active
  useEffect(() => {
    if (!mapReady || !map || !isFollowing) return;

    const moveToCurrentStep = () => {
      if (!map) return;
      
      // Get the source data for the route if available
      const routeSource = map.getSource('navigation-route') as mapboxgl.GeoJSONSource | undefined;
      if (!routeSource) return;
      
      // Get route data from source (this is a bit hacky but works with Mapbox)
      const data = (routeSource as any)._data;
      if (!data?.geometry?.coordinates || data.geometry.coordinates.length === 0) return;
      
      // Get the current step coordinate
      const stepIndex = Math.min(currentStep, data.geometry.coordinates.length - 1);
      const currentCoord = data.geometry.coordinates[stepIndex];
      
      // Calculate bearing for the next point
      let bearing = 0;
      if (stepIndex < data.geometry.coordinates.length - 1) {
        const nextCoord = data.geometry.coordinates[stepIndex + 1];
        bearing = calculateBearing(currentCoord, nextCoord);
      }
      
      // Animate camera movement
      map.easeTo({
        center: currentCoord,
        bearing: bearing,
        pitch: 60,
        zoom: 16,
        duration: 1000
      });
    };
    
    // Call once immediately
    moveToCurrentStep();
    
    // Set up interval for continuous updates (simulating movement)
    const interval = setInterval(moveToCurrentStep, 2000);
    
    return () => {
      clearInterval(interval);
    };
  }, [mapReady, map, isFollowing, currentStep]);
};

// Helper function to calculate bearing between two points
const calculateBearing = (start: [number, number], end: [number, number]): number => {
  const startLat = start[1] * Math.PI / 180;
  const startLng = start[0] * Math.PI / 180;
  const endLat = end[1] * Math.PI / 180;
  const endLng = end[0] * Math.PI / 180;
  
  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) -
            Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  bearing = (bearing + 360) % 360;
  
  return bearing;
};
