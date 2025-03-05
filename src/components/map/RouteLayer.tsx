
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
  const sourceId = `route-${color.replace('#', '')}`;
  const layerId = `route-${color.replace('#', '')}`;
  const routeLoadedRef = useRef(false);
  
  // Cleanup function to remove layers, sources and popups
  useEffect(() => {
    return () => {
      if (!map || !map.getContainer()) return;
      
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

  // Add route when map and coordinates are ready
  useEffect(() => {
    let isMounted = true;
    
    const checkMapAndAddRoute = async () => {
      if (!map || !isMounted) return;
      
      try {
        if (map.isStyleLoaded()) {
          await addRoute();
        } else {
          // If style is not loaded yet, wait and retry
          const onStyleLoad = async () => {
            if (isMounted) {
              await addRoute();
            }
          };
          
          map.once('load', onStyleLoad);
          return () => {
            map.off('load', onStyleLoad);
          };
        }
      } catch (error) {
        console.error("Error checking map and adding route:", error);
      }
    };
    
    checkMapAndAddRoute();
    
    return () => {
      isMounted = false;
    };
  }, [map, start, end, color, transportMode, mapboxToken, placeName]);

  // Function to add the route to the map
  const addRoute = async () => {
    if (!map || !mapboxToken) {
      console.log("Map or token not available for route addition");
      return;
    }
    
    // Check that the map still has a valid container
    if (!map.getContainer()) {
      console.log("Map container no longer available");
      return;
    }
    
    console.log("Adding route from", start, "to", end);

    try {
      // Remove existing route and popup
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }

      // Final check if map is still valid and style is loaded
      if (!map.isStyleLoaded() || !map.getContainer()) {
        console.log("Map not ready or container lost, cancelling route addition");
        return;
      }

      // Fetch route from Mapbox Directions API
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

      // Create GeoJSON for the route
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };

      // Final container check before adding to map
      if (!map.getContainer()) {
        console.log("Map container lost before adding route");
        return;
      }

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
      
      routeLoadedRef.current = true;
      
      // Add popup for route information if needed
      if (placeName && route.length > 0 && map.getContainer()) {
        const midIndex = Math.floor(route.length / 2);
        const midpoint = route[midIndex];
        
        // Create popup content
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
        
        // Create a new popup
        const newPopup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: 'route-popup',
          offset: 6
        })
        .setLngLat(midpoint)
        .setDOMContent(popupContent);
        
        // Store and add with delay
        popupRef.current = newPopup;
        
        setTimeout(() => {
          if (map && map.getContainer() && popupRef.current) {
            try {
              popupRef.current.addTo(map);
            } catch (error) {
              console.error("Error adding popup to map:", error);
            }
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
