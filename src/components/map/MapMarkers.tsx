
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Result } from '../ResultsList';

interface MapMarkersProps {
  map: mapboxgl.Map | null;
  results: Result[];
  center: [number, number];
  transportMode: string;
  onMarkersReady?: () => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({ 
  map, 
  results, 
  center,
  transportMode,
  onMarkersReady 
}) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Convert color name to hex value
  const getColorForResult = (color: string): string => {
    const colorMap: Record<string, string> = {
      'primary': '#2563eb',
      'red': '#ef4444',
      'green': '#10b981',
      'blue': '#3b82f6',
      'orange': '#f97316',
      'purple': '#8b5cf6',
      'pink': '#ec4899'
    };
    
    return colorMap[color] || '#3b82f6';
  };
  
  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    results.forEach((result, index) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.innerHTML = `<div class="bg-white rounded-full p-2 shadow-lg">
        <span class="font-bold text-${result.color}-500">${index + 1}</span>
      </div>`;
      el.style.width = '30px';
      el.style.height = '30px';
      
      // Add popup with details
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${result.name}</h3>
            <p class="text-xs text-gray-500">${result.address}</p>
            <div class="flex items-center gap-2 mt-1 text-xs">
              <span>${result.distance.toFixed(1)} km</span>
              <span>·</span>
              <span>${result.duration} min</span>
            </div>
          </div>
        `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([result.longitude, result.latitude])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers if there are any
    if (results.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(center);
      results.forEach(result => {
        bounds.extend([result.longitude, result.latitude]);
      });
      map.fitBounds(bounds, { padding: 50 });
    }

    if (onMarkersReady) {
      onMarkersReady();
    }
  }, [map, results, center, onMarkersReady]);

  return (
    <>
      {results.map((result, index) => (
        <React.Fragment key={result.id}>
          {map && map.isStyleLoaded() && (
            <RouteLayer
              map={map}
              start={center}
              end={[result.longitude, result.latitude]}
              color={getColorForResult(result.color)}
              transportMode={transportMode}
              mapboxToken={process.env.MAPBOX_TOKEN || 'pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbTdwMTZmZXAwZ3Q4MmtyM3U1bG8weng3In0.38X4Wh5p8tTmfNQj1rqutw'}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

// Import at the top to avoid circular dependency
import RouteLayer from './RouteLayer';

export default MapMarkers;
