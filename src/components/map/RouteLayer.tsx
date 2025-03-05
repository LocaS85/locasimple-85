
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '@/config/environment';

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
    const addRoute = async () => {
      if (!map || !mapboxToken || !map.isStyleLoaded() || !map.getContainer()) return;

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
          
          // Create a popup for route info - mais ne l'ajoute pas à la carte immédiatement
          // pour éviter le problème d'appendChild
          popupRef.current = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'route-popup',
            offset: 6
          })
          .setLngLat(midpoint)
          .setDOMContent(popupContent);
          
          // Ajouter le popup à la carte seulement si le conteneur est prêt
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
      }
    };

    // Attendre que la carte soit complètement chargée avant d'ajouter l'itinéraire
    if (map && map.isStyleLoaded()) {
      addRoute();
    } else if (map) {
      map.once('load', addRoute);
    }
    
    return () => {
      if (map) {
        map.off('load', addRoute);
      }
    };
  }, [map, start, end, color, transportMode, mapboxToken, placeName, showDistance, showDuration, sourceId, layerId]);

  return null;
};

export default RouteLayer;
