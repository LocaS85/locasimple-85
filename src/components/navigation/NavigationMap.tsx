
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '@/config/environment';
import { getTransportModeColor } from '@/data/transportModes';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from 'sonner';

// Set the token globally if available
if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

interface NavigationMapProps {
  start: [number, number];
  end: [number, number];
  transportMode: string;
  currentStep: number;
  isFollowing: boolean;
}

const NavigationMap: React.FC<NavigationMapProps> = ({
  start,
  end,
  transportMode,
  currentStep,
  isFollowing
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const routeSource = useRef<string>('navigation-route');
  const currentPositionSource = useRef<string>('current-position');
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get transport mode color
  const routeColor = getTransportModeColor(transportMode);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Check for Mapbox token
    if (!MAPBOX_TOKEN) {
      console.error('Mapbox token is missing');
      setError('Token Mapbox manquant. La carte de navigation ne peut pas être chargée.');
      toast.error('Token Mapbox manquant');
      return;
    }
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/navigation-night-v1',
        center: start,
        zoom: 14,
        pitch: 45,
        bearing: 0,
        accessToken: MAPBOX_TOKEN
      });

      map.current.on('load', () => {
        setMapReady(true);
        
        // Add user position marker (pulsing dot)
        if (map.current) {
          map.current.addSource(currentPositionSource.current, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: start
              },
              properties: {}
            }
          });

          map.current.addLayer({
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

          map.current.addLayer({
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
          let size = 12;
          const pulseAnimation = () => {
            if (!map.current) return;
            
            size = size + (size < 20 ? 0.3 : -10);
            map.current.setPaintProperty('current-position-outer', 'circle-radius', size);
            requestAnimationFrame(pulseAnimation);
          };

          requestAnimationFrame(pulseAnimation);
        }
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true
        }),
        'top-right'
      );
    } catch (error) {
      console.error('Error initializing navigation map:', error);
      setError('Erreur lors de l\'initialisation de la carte de navigation');
      toast.error('Erreur de carte de navigation');
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  // Update route when transportMode changes
  useEffect(() => {
    if (!mapReady || !map.current) return;
    
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
        if (map.current?.getLayer('route-line')) {
          map.current.removeLayer('route-line');
        }
        if (map.current?.getLayer('route-casing')) {
          map.current.removeLayer('route-casing');
        }
        if (map.current?.getSource(routeSource.current)) {
          map.current.removeSource(routeSource.current);
        }

        // Add the route source
        map.current.addSource(routeSource.current, {
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
        map.current.addLayer({
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
        map.current.addLayer({
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
        map.current.fitBounds(bounds, { padding: 80 });

      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchAndDisplayRoute();
  }, [mapReady, start, end, transportMode, routeColor]);

  // Update camera position when following mode is active
  useEffect(() => {
    if (!mapReady || !map.current || !isFollowing) return;

    // Simulate movement along the route
    const moveAlongRoute = () => {
      if (!map.current?.getSource(routeSource.current)) return;
      
      const source = map.current.getSource(routeSource.current) as mapboxgl.GeoJSONSource;
      const data = source._data as any;
      
      if (!data?.geometry?.coordinates || data.geometry.coordinates.length === 0) return;
      
      // Get the current step coordinate
      const stepIndex = Math.min(currentStep, data.geometry.coordinates.length - 1);
      const currentCoord = data.geometry.coordinates[stepIndex];
      
      // Update the position marker
      const positionSource = map.current.getSource(currentPositionSource.current) as mapboxgl.GeoJSONSource;
      if (positionSource) {
        positionSource.setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: currentCoord
          },
          properties: {}
        });
      }
      
      // Zoom to current position
      if (isFollowing) {
        // Calculate bearing for the next point
        let bearing = 0;
        if (stepIndex < data.geometry.coordinates.length - 1) {
          const nextCoord = data.geometry.coordinates[stepIndex + 1];
          bearing = calculateBearing(currentCoord, nextCoord);
        }
        
        map.current.easeTo({
          center: currentCoord,
          bearing: bearing,
          pitch: 60,
          zoom: 16,
          duration: 1000
        });
      }
    };
    
    moveAlongRoute();
    
    // Set up an interval to simulate movement (in a real app, this would use geolocation)
    const interval = setInterval(moveAlongRoute, 2000);
    
    return () => {
      clearInterval(interval);
    };
  }, [mapReady, isFollowing, currentStep]);

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

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationMap;
