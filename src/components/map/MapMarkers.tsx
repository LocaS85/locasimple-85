
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import RouteLayer from './RouteLayer';
import type { Result } from '../ResultsList';
import { MAPBOX_TOKEN } from '@/config/environment';

interface MapMarkersProps {
  map: mapboxgl.Map | null;
  results: Result[];
  center: [number, number];
  transportMode: string;
  onMarkersReady?: () => void;
  showRoutes?: boolean;
  selectedResultId?: string;
  onResultClick?: (result: Result) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({ 
  map, 
  results, 
  center,
  transportMode,
  onMarkersReady,
  showRoutes = false,
  selectedResultId,
  onResultClick
}) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);

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

    // Clear existing markers and popups
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    popupsRef.current.forEach(popup => popup.remove());
    popupsRef.current = [];

    // Add new markers
    results.forEach((result, index) => {
      const isSelected = result.id === selectedResultId;
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker cursor-pointer';
      el.innerHTML = `<div class="bg-white rounded-full p-1.5 shadow-lg border-2 ${isSelected ? `border-${result.color}-500` : 'border-white'} transition-all hover:scale-110">
        <div class="rounded-full w-6 h-6 flex items-center justify-center bg-${result.color}-500 text-white font-bold">
          ${index + 1}
        </div>
      </div>`;
      el.style.width = '36px';
      el.style.height = '36px';
      el.style.transform = isSelected ? 'scale(1.2)' : 'scale(1)';
      
      // Add popup with details
      const popup = new mapboxgl.Popup({ 
        offset: 25, 
        closeButton: false,
        className: isSelected ? 'active-popup' : ''
      })
      .setHTML(`
        <div class="p-2 max-w-64">
          <h3 class="font-bold text-sm">${result.name}</h3>
          <p class="text-xs text-gray-500">${result.address}</p>
          <div class="flex items-center gap-2 mt-1 text-xs">
            <span>${result.distance.toFixed(1)} km</span>
            <span>·</span>
            <span>${result.duration} min</span>
          </div>
          ${result.openingHours ? `<div class="text-xs mt-1 text-gray-500">${result.openingHours}</div>` : ''}
          ${result.rating ? `<div class="flex items-center gap-1 mt-1">
            <span class="text-amber-400">★</span>
            <span class="text-xs">${result.rating}</span>
          </div>` : ''}
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([result.longitude, result.latitude])
        .setPopup(popup)
        .addTo(map);
      
      // Show popup for selected result
      if (isSelected) {
        popup.addTo(map);
      }
      
      // Add click event
      el.addEventListener('click', () => {
        if (onResultClick) {
          onResultClick(result);
        }
      });

      markersRef.current.push(marker);
      popupsRef.current.push(popup);
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
  }, [map, results, center, onMarkersReady, selectedResultId, onResultClick]);

  // Route display for selected result or all results
  const routesToShow = selectedResultId 
    ? results.filter(r => r.id === selectedResultId)
    : (showRoutes ? results : []);

  return (
    <>
      {routesToShow.map((result) => (
        <React.Fragment key={result.id}>
          {map && map.isStyleLoaded() && (
            <RouteLayer
              map={map}
              start={center}
              end={[result.longitude, result.latitude]}
              color={getColorForResult(result.color)}
              transportMode={transportMode}
              mapboxToken={MAPBOX_TOKEN}
              placeName={result.name}
              showDistance={true}
              showDuration={true}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default MapMarkers;
