
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface RadiusCircleProps {
  map: mapboxgl.Map | null;
  center: [number, number];
  radius: number; 
  radiusUnit: 'km' | 'miles';
  radiusType: 'distance' | 'duration';
  duration: number;
  timeUnit: 'minutes' | 'hours';
  transportMode: string;
}

const RadiusCircle: React.FC<RadiusCircleProps> = ({
  map,
  center,
  radius,
  radiusUnit,
  radiusType,
  duration,
  timeUnit,
  transportMode
}) => {
  // Convert km/miles to meters for the radius
  const getRadiusInMeters = () => {
    const radiusValue = radius;
    // Convert to meters
    if (radiusUnit === 'km') {
      return radiusValue * 1000;
    } else {
      // Miles to meters (1 mile = 1609.34 meters)
      return radiusValue * 1609.34;
    }
  };

  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;

    // Remove old circle if it exists
    if (map.getSource('radius-circle')) {
      if (map.getLayer('radius-circle-fill')) {
        map.removeLayer('radius-circle-fill');
      }
      if (map.getLayer('radius-circle-outline')) {
        map.removeLayer('radius-circle-outline');
      }
      map.removeSource('radius-circle');
    }

    // If type distance, display a normal circle
    if (radiusType === 'distance') {
      const radiusInMeters = getRadiusInMeters();
      
      // Add the circle as a GeoJSON source
      map.addSource('radius-circle', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center
          },
          properties: {
            radius: radiusInMeters,
            lat: center[1]
          }
        }
      });
      
      // Add the layer for the circle
      map.addLayer({
        id: 'radius-circle-outline',
        type: 'circle',
        source: 'radius-circle',
        paint: {
          'circle-radius': ['/', ['get', 'radius'], ['cos', ['*', ['get', 'lat'], 0.0174532925]]],
          'circle-opacity': 0,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#2563eb',
          'circle-stroke-opacity': 0.8,
          'circle-pitch-scale': 'map',
          'circle-pitch-alignment': 'map'
        }
      });
      
      map.addLayer({
        id: 'radius-circle-fill',
        type: 'circle',
        source: 'radius-circle',
        paint: {
          'circle-radius': ['/', ['get', 'radius'], ['cos', ['*', ['get', 'lat'], 0.0174532925]]],
          'circle-color': '#2563eb',
          'circle-opacity': 0.1,
          'circle-pitch-scale': 'map',
          'circle-pitch-alignment': 'map'
        }
      });
    } else {
      // For duration, ideally would use an isochrone API
      // This part would be implemented with an API like Mapbox's Isochrone API
      // For now, showing a simplified circle with a different color
      
      // Create an approximate circle based on duration
      // This approximation is very simplified, in reality it would depend on the road network
      let estimatedRadius;
      
      if (timeUnit === 'minutes') {
        // Very simplified estimation: 1 minute ~ 1km in urban driving
        estimatedRadius = (transportMode === 'driving' ? 1000 : 
                          transportMode === 'cycling' ? 300 : 
                          transportMode === 'walking' ? 80 : 800) * duration;
      } else {
        // For hours, multiply by 60
        estimatedRadius = (transportMode === 'driving' ? 60000 : 
                          transportMode === 'cycling' ? 18000 : 
                          transportMode === 'walking' ? 4800 : 48000) * duration;
      }
      
      // Add the circle as a GeoJSON source
      map.addSource('radius-circle', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center
          },
          properties: {
            radius: estimatedRadius,
            lat: center[1]
          }
        }
      });
      
      // Add the layer for the circle with a different color for duration
      map.addLayer({
        id: 'radius-circle-outline',
        type: 'circle',
        source: 'radius-circle',
        paint: {
          'circle-radius': ['/', ['get', 'radius'], ['cos', ['*', ['get', 'lat'], 0.0174532925]]],
          'circle-opacity': 0,
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#f97316', // Orange for duration
          'circle-stroke-opacity': 0.8,
          'circle-pitch-scale': 'map',
          'circle-pitch-alignment': 'map'
        }
      });
      
      map.addLayer({
        id: 'radius-circle-fill',
        type: 'circle',
        source: 'radius-circle',
        paint: {
          'circle-radius': ['/', ['get', 'radius'], ['cos', ['*', ['get', 'lat'], 0.0174532925]]],
          'circle-color': '#f97316', // Orange for duration
          'circle-opacity': 0.15,
          'circle-pitch-scale': 'map',
          'circle-pitch-alignment': 'map'
        }
      });
    }
  }, [map, center, radius, radiusUnit, radiusType, duration, timeUnit, transportMode]);

  return null;
};

export default RadiusCircle;
