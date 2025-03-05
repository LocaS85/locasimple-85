
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

interface RouteLayerProps {
  map: mapboxgl.Map | null;
  start: [number, number];
  end: [number, number];
  color: string;
  transportMode: string;
  mapboxToken?: string;
  placeName?: string;
  showDistance?: boolean;
  showDuration?: boolean;
}

const RouteLayer: React.FC<RouteLayerProps> = ({ 
  map, 
  start, 
  end, 
  color, 
  transportMode,
  mapboxToken = MAPBOX_TOKEN,
  placeName,
  showDistance = true,
  showDuration = true
}) => {
  const [routeInfo, setRouteInfo] = useState<{distance?: number; duration?: number}>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const sourceId = `route-${color}`;
  const layerId = `route-${color}`;
  const routeLoadedRef = useRef(false);
  
  useEffect(() => {
    // Cleanup function to remove layers, sources and popups
    return () => {
      if (!map) return;
      
      try {
        // Remove layers and sources
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
        
        // Remove popup
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      } catch (error) {
        console.error("Error during route cleanup:", error);
      }
    };
  }, [map, sourceId, layerId]);

  useEffect(() => {
    // Wait for map to load before adding route
    const checkMapAndAddRoute = () => {
      if (!map) return;
      
      if (map.isStyleLoaded()) {
        addRoute();
      } else {
        // If style is not loaded yet, wait and retry
        map.once('load', addRoute);
      }
    };
    
    checkMapAndAddRoute();
    
    return () => {
      if (map) {
        map.off('load', addRoute);
      }
    };
  }, [map, start, end, color, transportMode, mapboxToken, placeName]);

  const addRoute = async () => {
    if (!map || !mapboxToken || !map.getContainer()) {
      console.log("Map not ready for route addition");
      return;
    }
    
    console.log("Adding route from", start, "to", end);

    try {
      // Remove existing route if it exists
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
      
      // Remove existing popup
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }

      if (!map.isStyleLoaded()) {
        console.log("Map style not loaded yet, waiting...");
        map.once('load', addRoute);
        return;
      }

      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxToken}`
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
      
      console.log(`Route loaded: ${route.length} points, ${data.distance.toFixed(2)}m, ${Math.round(data.duration / 60)}min`);
      
      // Store route information
      setRouteInfo({
        distance: data.distance / 1000, // Convert to km
        duration: Math.round(data.duration / 60) // Convert to minutes
      });

      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };

      // Check if the map is still valid
      if (!map.getContainer()) {
        console.log("Map container no longer available");
        return;
      }

      // Add a new source and layer
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
      
      routeLoadedRef.current = true;
      
      // Add a popup for the route information if placeName is provided
      if (placeName && route.length > 0) {
        const midIndex = Math.floor(route.length / 2);
        const midpoint = route[midIndex];
        
        const popupContent = document.createElement('div');
        popupContent.className = 'text-xs p-1';
        
        let popupHtml = `<strong>${placeName}</strong>`;
        if (showDistance && routeInfo.distance) {
          popupHtml += `<br>${routeInfo.distance.toFixed(1)} km`;
        }
        if (showDuration && routeInfo.duration) {
          popupHtml += `<br>${routeInfo.duration} min`;
        }
        
        popupContent.innerHTML = popupHtml;
        
        // Create a popup but don't add it to the map right away
        popupRef.current = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: 'route-popup',
          offset: 6
        })
        .setLngLat(midpoint)
        .setDOMContent(popupContent);
        
        // Add the popup to the map after a short delay
        setTimeout(() => {
          try {
            if (map && map.getContainer() && popupRef.current) {
              popupRef.current.addTo(map);
            }
          } catch (error) {
            console.error("Error adding popup to map:", error);
          }
        }, 300);
      }
    } catch (error) {
      console.error('Error adding route:', error);
      toast.error('Impossible de calculer l\'itinéraire');
    }
  };

  return null;
};

export default RouteLayer;
