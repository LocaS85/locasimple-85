
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Result } from './ResultsList';

interface MapProps {
  results: Result[];
  center: [number, number];
}

const Map = ({ results, center }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const routesRef = useRef<mapboxgl.Map[]>([]);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  const addRoute = async (start: [number, number], end: [number, number], color: string) => {
    if (!map.current || !mapboxToken) return;

    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxToken}`
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };

      // Si la source existe déjà, mettre à jour les données
      if (map.current.getSource(`route-${color}`)) {
        const source = map.current.getSource(`route-${color}`) as mapboxgl.GeoJSONSource;
        source.setData(geojson as any);
      } else {
        // Sinon, ajouter une nouvelle source et une nouvelle couche
        map.current.addSource(`route-${color}`, {
          type: 'geojson',
          data: geojson as any
        });

        map.current.addLayer({
          id: `route-${color}`,
          type: 'line',
          source: `route-${color}`,
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
    } catch (error) {
      console.error('Error adding route:', error);
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: center,
        zoom: 13,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      setIsMapInitialized(true);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  useEffect(() => {
    if (!map.current || !isMapInitialized) return;

    // Clear existing markers and routes
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    routesRef.current.forEach((route: any) => {
      if (map.current?.getLayer(route)) {
        map.current.removeLayer(route);
        map.current.removeSource(route);
      }
    });
    routesRef.current = [];

    // Add new markers and routes
    results.forEach((result, index) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.innerHTML = `<div class="bg-white rounded-full p-2 shadow-lg">
        <span class="font-bold">${index + 1}</span>
      </div>`;
      el.style.width = '30px';
      el.style.height = '30px';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([result.longitude, result.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <h3 class="font-bold">${result.name}</h3>
              <p>${result.address}</p>
              <p class="text-sm text-gray-500">${result.distance.toFixed(1)} km - ${result.duration} min</p>
            `)
        )
        .addTo(map.current);

      markersRef.current.push(marker);

      // Add route from center to this result
      addRoute(center, [result.longitude, result.latitude], result.color);
    });

    // Fit bounds to show all markers if there are any
    if (results.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(center);
      results.forEach(result => {
        bounds.extend([result.longitude, result.latitude]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }

  }, [results, isMapInitialized]);

  // Cleanup
  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!isMapInitialized) {
    return (
      <div className="p-4 space-y-4">
        <p className="text-sm text-gray-600">
          Pour initialiser la carte, veuillez entrer votre token Mapbox public. 
          Vous pouvez le trouver dans votre tableau de bord Mapbox.
        </p>
        <div className="flex gap-2">
          <Input
            type="text"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            placeholder="Entrez votre token Mapbox public"
            className="flex-1"
          />
          <Button onClick={initializeMap}>Initialiser la carte</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
    </div>
  );
};

export default Map;
