
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';
import { useMapboxRoutes } from '@/hooks/useMapboxRoutes';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { getCategoryColorClass } from '@/utils/categoryColors';
import '@/styles/markers.css';

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
}

interface EnhancedMapComponentProps {
  selectedLocations: Location[];
  userLocation?: [number, number];
  onLocationSelected?: (location: Location) => void;
  transportMode?: string;
}

const EnhancedMapComponent: React.FC<EnhancedMapComponentProps> = ({
  selectedLocations,
  userLocation = [2.3522, 48.8566], // Default to Paris
  onLocationSelected,
  transportMode = 'driving'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const routes = useRef<any[]>([]);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    if (!MAPBOX_TOKEN) {
      toast.error("Mapbox token manquant. Veuillez configurer votre token dans le fichier .env.");
      return;
    }
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: userLocation,
      zoom: 12
    });
    
    newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    newMap.on('load', () => {
      setMapLoaded(true);
      map.current = newMap;
    });
    
    return () => {
      if (map.current) {
        // Clean up routes
        routes.current.forEach(routeId => {
          if (map.current?.getSource(routeId)) {
            map.current.removeLayer(`${routeId}-layer`);
            map.current.removeSource(routeId);
          }
        });
        
        // Clean up markers
        markers.current.forEach(marker => marker.remove());
        
        map.current.remove();
      }
    };
  }, []);

  // Add user location marker
  useEffect(() => {
    if (!map.current || !mapLoaded || !userLocation) return;
    
    // Create a custom marker element for user location
    const userMarkerEl = document.createElement('div');
    userMarkerEl.className = 'user-location-marker';
    userMarkerEl.innerHTML = `
      <div class="relative">
        <div class="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-ping"></div>
        <div class="relative bg-blue-500 border-2 border-white w-4 h-4 rounded-full"></div>
      </div>
    `;
    
    const userMarker = new mapboxgl.Marker(userMarkerEl)
      .setLngLat(userLocation)
      .addTo(map.current);
    
    markers.current.push(userMarker);
    
    return () => {
      userMarker.remove();
    };
  }, [mapLoaded, userLocation]);

  // Add location markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    // Clear previous markers except user location marker
    markers.current.slice(1).forEach(marker => marker.remove());
    markers.current = markers.current.slice(0, 1);
    
    // Add markers for selected locations
    selectedLocations.forEach((location, index) => {
      const el = document.createElement('div');
      el.className = 'location-marker';
      
      // Get the icon based on category
      const icon = getCategoryIcon(location.category);
      const colorClass = getCategoryColorClass(location.category);
      
      el.innerHTML = `
        <div class="relative p-2 rounded-full bg-white shadow-md ${colorClass} flex items-center justify-center">
          <span>${index + 1}</span>
          ${typeof icon === 'string' ? icon : '📍'}
        </div>
      `;
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold">${location.name}</h3>
            <p class="text-sm text-gray-600">${location.category}</p>
          </div>
        `);
      
      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .setPopup(popup)
        .addTo(map.current!);
      
      // Add click event
      el.addEventListener('click', () => {
        if (onLocationSelected) {
          onLocationSelected(location);
        }
      });
      
      markers.current.push(marker);
    });
    
    // Fit map to include all markers
    if (selectedLocations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      
      // Add user location to bounds
      bounds.extend(userLocation);
      
      // Add all locations to bounds
      selectedLocations.forEach((location) => {
        bounds.extend([location.longitude, location.latitude]);
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [selectedLocations, mapLoaded, onLocationSelected]);

  // Fetch and draw routes
  useEffect(() => {
    if (!map.current || !mapLoaded || selectedLocations.length === 0 || !userLocation) return;
    
    // Clean up existing routes
    routes.current.forEach(routeId => {
      if (map.current?.getSource(routeId)) {
        map.current.removeLayer(`${routeId}-layer`);
        map.current.removeSource(routeId);
      }
    });
    
    routes.current = [];
    
    // Draw routes from user location to each selected location
    const fetchRoutes = async () => {
      for (let i = 0; i < selectedLocations.length; i++) {
        const location = selectedLocations[i];
        const routeId = `route-${location.id}`;
        
        try {
          // Fetch route from Mapbox Directions API
          const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${userLocation[0]},${userLocation[1]};${location.longitude},${location.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
          );
          
          if (!response.ok) {
            console.error(`Error fetching route: ${response.statusText}`);
            continue;
          }
          
          const data = await response.json();
          
          if (!data.routes || data.routes.length === 0) {
            console.warn(`No route found for location ${location.name}`);
            continue;
          }
          
          const route = data.routes[0];
          
          // Add the route to the map
          map.current?.addSource(routeId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            }
          });
          
          // Get a color based on the category
          let color = '#ff0000';
          switch (location.category) {
            case 'travail':
              color = '#8B5CF6';
              break;
            case 'famille':
              color = '#EC4899';
              break;
            case 'adresse-principale':
              color = '#10B981';
              break;
            case 'alimentation':
              color = '#F97316';
              break;
            case 'sante':
              color = '#EF4444';
              break;
            case 'divertissement':
              color = '#3B82F6';
              break;
            case 'shopping':
              color = '#14B8A6';
              break;
            case 'hotels':
              color = '#6366F1';
              break;
          }
          
          map.current?.addLayer({
            id: `${routeId}-layer`,
            type: 'line',
            source: routeId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': color,
              'line-width': 4,
              'line-opacity': 0.8
            }
          });
          
          routes.current.push(routeId);
          
        } catch (error) {
          console.error(`Error processing route for location ${location.name}:`, error);
        }
      }
    };
    
    fetchRoutes();
  }, [selectedLocations, mapLoaded, userLocation, transportMode]);

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default EnhancedMapComponent;
