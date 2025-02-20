
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
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);

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

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
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
    });

    // Fit bounds to show all markers if there are any
    if (results.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
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
