
import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const addRoute = async () => {
      if (!map || !mapboxToken) return;

      try {
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxToken}`
        );
        const json = await query.json();
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

        const sourceId = `route-${color}`;
        const layerId = `route-${color}`;

        // If the source already exists, update the data
        if (map.getSource(sourceId)) {
          const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
          source.setData(geojson as any);
        } else {
          // Otherwise, add a new source and layer
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
        }
        
        // Add a popup for the route information if placeName is provided
        if (placeName) {
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
          
          // Remove existing popup if any
          const popupId = `popup-${color}`;
          if (document.getElementById(popupId)) {
            document.getElementById(popupId)?.remove();
          }
          
          // Create a popup for route info
          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'route-popup',
            offset: 6
          })
          .setLngLat(midpoint)
          .setDOMContent(popupContent)
          .addTo(map);
          
          // Set id for future reference
          const popupElement = popup.getElement();
          popupElement.id = popupId;
        }
      } catch (error) {
        console.error('Error adding route:', error);
      }
    };

    addRoute();
    
    return () => {
      // Clean up popups when component unmounts
      if (map) {
        const popupId = `popup-${color}`;
        if (document.getElementById(popupId)) {
          document.getElementById(popupId)?.remove();
        }
      }
    };
  }, [map, start, end, color, transportMode, mapboxToken, placeName, showDistance, showDuration]);

  return null;
};

export default RouteLayer;
