
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';
import { getTransportModeColor } from '@/data/transportModes';
import type { Result } from '@/components/ResultsList';

interface UseRoutesProps {
  map: mapboxgl.Map | null;
  showRoutes: boolean;
  results: Result[];
  center: [number, number];
  transportMode: string;
  selectedResultId?: string;
}

const useRoutes = ({
  map,
  showRoutes,
  results,
  center,
  transportMode,
  selectedResultId
}: UseRoutesProps) => {
  const [routeSources, setRouteSources] = useState<string[]>([]);
  const [routeLayers, setRouteLayers] = useState<string[]>([]);

  // Fetch and display routes
  useEffect(() => {
    if (!map || !showRoutes || results.length === 0 || !center) return;
    
    const fetchAndDisplayRoutes = async () => {
      // Clean up previous routes
      routeLayers.forEach(layerId => {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
      });
      
      routeSources.forEach(sourceId => {
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      });
      
      const newRouteSources: string[] = [];
      const newRouteLayers: string[] = [];
      
      if (!MAPBOX_TOKEN) {
        console.error('Mapbox token is missing');
        toast.error('Le token Mapbox est manquant, impossible d\'afficher les itinéraires');
        return;
      }
      
      let hasAddedRoute = false;
      
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (!result.latitude || !result.longitude) continue;
        
        try {
          // Fetch route from Mapbox Directions API
          const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${center[0]},${center[1]};${result.longitude},${result.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
          );
          
          if (!response.ok) {
            console.error(`Error fetching route: ${response.statusText}`);
            continue;
          }
          
          const data = await response.json();
          
          if (!data.routes || data.routes.length === 0) {
            console.warn(`No route found for result ${i}`);
            continue;
          }
          
          const route = data.routes[0];
          const sourceId = `route-source-${i}`;
          const layerId = `route-layer-${i}`;
          
          // Add route source to map
          map.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            }
          });
          
          // Add route layer to map
          map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': result.color || getTransportModeColor(transportMode),
              'line-width': selectedResultId === result.id ? 5 : 3,
              'line-opacity': selectedResultId ? (selectedResultId === result.id ? 1 : 0.6) : 0.8
            }
          });
          
          newRouteSources.push(sourceId);
          newRouteLayers.push(layerId);
          hasAddedRoute = true;
          
          // Add distance and duration information if available
          if (route.distance && route.duration) {
            console.log(`Route ${i+1}: ${(route.distance/1000).toFixed(1)}km, ${Math.round(route.duration/60)}min`);
          }
        } catch (error) {
          console.error(`Error processing route for result ${i}:`, error);
        }
      }
      
      setRouteSources(newRouteSources);
      setRouteLayers(newRouteLayers);
      
      if (hasAddedRoute) {
        // Fit map to include all routes
        try {
          const bounds = new mapboxgl.LngLatBounds();
          bounds.extend(center as [number, number]);
          
          results.forEach(result => {
            if (result.latitude && result.longitude) {
              bounds.extend([result.longitude, result.latitude]);
            }
          });
          
          map.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15
          });
        } catch (error) {
          console.error('Error fitting bounds:', error);
        }
      }
    };
    
    fetchAndDisplayRoutes();
  }, [map, showRoutes, results, center, transportMode, selectedResultId]);

  return {
    routeSources,
    routeLayers
  };
};

export default useRoutes;
