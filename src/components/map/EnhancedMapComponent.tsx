
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category?: string;
}

interface EnhancedMapComponentProps {
  selectedLocations: Location[];
  userLocation: [number, number];
  transportMode: string;
  searchRadius?: number;
  onMapInitialized?: (map: mapboxgl.Map) => void;
}

const EnhancedMapComponent: React.FC<EnhancedMapComponentProps> = ({
  selectedLocations,
  userLocation,
  transportMode,
  searchRadius = 5,
  onMapInitialized
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const radiusCircleRef = useRef<mapboxgl.GeoJSONSource | null>(null);
  const routeLayerRef = useRef<string[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    if (!MAPBOX_TOKEN) {
      toast.error('Token Mapbox manquant. Veuillez configurer votre token dans le fichier .env.');
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: userLocation,
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      // Add radius circle source
      map.current?.addSource('radius-circle', {
        type: 'geojson',
        data: createGeoJSONCircle(userLocation, searchRadius)
      });
      
      // Add radius circle layer
      map.current?.addLayer({
        id: 'radius-circle-fill',
        type: 'fill',
        source: 'radius-circle',
        paint: {
          'fill-color': '#4264fb',
          'fill-opacity': 0.2
        }
      });
      
      map.current?.addLayer({
        id: 'radius-circle-outline',
        type: 'line',
        source: 'radius-circle',
        paint: {
          'line-color': '#4264fb',
          'line-width': 2
        }
      });
      
      // Store reference to the source for later updates
      radiusCircleRef.current = map.current?.getSource('radius-circle') as mapboxgl.GeoJSONSource;
      
      // Callback when map is initialized
      if (onMapInitialized && map.current) {
        onMapInitialized(map.current);
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!map.current) return;
    
    // Remove existing user marker if it exists
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }
    
    // Create user marker element
    const el = document.createElement('div');
    el.className = 'user-marker';
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = '#3b82f6';
    el.style.border = '2px solid white';
    el.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
    
    // Add new user marker
    userMarkerRef.current = new mapboxgl.Marker(el)
      .setLngLat(userLocation)
      .addTo(map.current);
      
    // Center map on user location
    map.current.flyTo({
      center: userLocation,
      essential: true
    });
    
    // Update radius circle if it exists
    if (radiusCircleRef.current) {
      radiusCircleRef.current.setData(createGeoJSONCircle(userLocation, searchRadius));
    }
  }, [userLocation]);

  // Update search radius circle
  useEffect(() => {
    if (!map.current || !radiusCircleRef.current) return;
    
    radiusCircleRef.current.setData(createGeoJSONCircle(userLocation, searchRadius));
  }, [searchRadius, userLocation]);

  // Update location markers and routes
  useEffect(() => {
    if (!map.current) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add new markers for selected locations
    selectedLocations.forEach(location => {
      // Create marker element with custom styling based on category
      const el = document.createElement('div');
      el.className = 'location-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundSize = 'contain';
      el.style.backgroundPosition = 'center';
      el.style.backgroundRepeat = 'no-repeat';
      
      // Set icon based on category
      if (location.category === 'travail') {
        el.textContent = '💼';
      } else if (location.category === 'famille') {
        el.textContent = '👨‍👩‍👦';
      } else if (location.category === 'alimentation') {
        el.textContent = '🍽️';
      } else if (location.category === 'sante') {
        el.textContent = '⚕️';
      } else if (location.category === 'divertissement') {
        el.textContent = '🎬';
      } else if (location.category === 'shopping') {
        el.textContent = '🛍️';
      } else if (location.category === 'hotels') {
        el.textContent = '🏨';
      } else {
        el.textContent = '📍';
      }
      
      // Create and add marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(location.name))
        .addTo(map.current as mapboxgl.Map);
        
      markersRef.current.push(marker);
    });
    
    // Calculate and display routes
    if (selectedLocations.length > 0) {
      drawRoutes();
    }
  }, [selectedLocations, transportMode]);
  
  // Function to generate GeoJSON circle for search radius
  const createGeoJSONCircle = (center: [number, number], radiusInKm: number) => {
    const points = 64;
    const km = radiusInKm;
    const ret = [];
    const distanceX = km / (111.32 * Math.cos((center[1] * Math.PI) / 180));
    const distanceY = km / 110.574;

    let theta, x, y;
    for (let i = 0; i < points; i++) {
      theta = (i / points) * (2 * Math.PI);
      x = distanceX * Math.cos(theta);
      y = distanceY * Math.sin(theta);
      ret.push([center[0] + x, center[1] + y]);
    }
    ret.push(ret[0]); // Close the circle
    
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [ret]
      },
      properties: {}
    };
  };

  // Function to draw routes between user location and all selected locations
  const drawRoutes = async () => {
    if (!map.current || !MAPBOX_TOKEN || selectedLocations.length === 0) return;
    
    // Remove existing route layers
    routeLayerRef.current.forEach(id => {
      if (map.current?.getLayer(id)) {
        map.current?.removeLayer(id);
      }
      if (map.current?.getSource(id)) {
        map.current?.removeSource(id);
      }
    });
    
    routeLayerRef.current = [];
    
    // Create routes for each selected location
    for (let i = 0; i < selectedLocations.length; i++) {
      const location = selectedLocations[i];
      const sourceId = `route-source-${location.id}`;
      const layerId = `route-layer-${location.id}`;
      
      try {
        // Get directions from Mapbox API
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${userLocation[0]},${userLocation[1]};${location.longitude},${location.latitude}?geometries=geojson&steps=true&access_token=${MAPBOX_TOKEN}`
        );
        
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          
          // Add route source
          map.current.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            }
          });
          
          // Add route layer
          map.current.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': getRouteColor(i),
              'line-width': 5,
              'line-opacity': 0.75
            }
          });
          
          routeLayerRef.current.push(sourceId);
          routeLayerRef.current.push(layerId);
          
          // Add duration information to marker popup
          if (markersRef.current[i]) {
            const popup = markersRef.current[i].getPopup();
            const duration = Math.round(route.duration / 60);
            const distance = (route.distance / 1000).toFixed(1);
            
            popup.setHTML(`
              <div>
                <strong>${location.name}</strong>
                <div>${getTransportModeIcon(transportMode)} ${duration} min (${distance} km)</div>
              </div>
            `);
          }
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    }
    
    // Fit map to show all routes and markers
    fitMapToShowAll();
  };
  
  // Function to fit map to show all markers and routes
  const fitMapToShowAll = () => {
    if (!map.current || selectedLocations.length === 0) return;
    
    const bounds = new mapboxgl.LngLatBounds();
    
    // Add user location to bounds
    bounds.extend(userLocation);
    
    // Add all selected locations to bounds
    selectedLocations.forEach(location => {
      bounds.extend([location.longitude, location.latitude]);
    });
    
    // Fit map to bounds with padding
    map.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15
    });
  };
  
  // Get route color based on index
  const getRouteColor = (index: number) => {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    return colors[index % colors.length];
  };
  
  // Get transport mode icon
  const getTransportModeIcon = (mode: string) => {
    switch (mode) {
      case 'driving':
        return '🚗';
      case 'walking':
        return '🚶';
      case 'cycling':
        return '🚲';
      case 'driving-traffic':
        return '🚦';
      default:
        return '🚗';
    }
  };

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
};

export default EnhancedMapComponent;
