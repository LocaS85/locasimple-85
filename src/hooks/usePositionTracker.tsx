
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

interface UsePositionTrackerProps {
  map: mapboxgl.Map | null;
  mapReady: boolean;
  currentPosition: [number, number];
  currentStep: number;
  isFollowing: boolean;
  routeColor: string;
}

export const usePositionTracker = ({
  map,
  mapReady,
  currentPosition,
  currentStep,
  isFollowing,
  routeColor
}: UsePositionTrackerProps) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [showPulse, setShowPulse] = useState(true);

  // Create and update position marker
  useEffect(() => {
    if (!mapReady || !map) return;

    // Remove existing marker if it exists
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Create marker element
    const el = document.createElement('div');
    el.className = 'position-marker';
    el.innerHTML = `
      <div class="relative">
        ${showPulse ? '<div class="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping"></div>' : ''}
        <div class="relative flex items-center justify-center bg-blue-500 border-2 border-white w-6 h-6 rounded-full">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    `;

    // Create marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat(currentPosition)
      .addTo(map);

    markerRef.current = marker;

    // Center map on position if following
    if (isFollowing) {
      map.flyTo({
        center: currentPosition,
        zoom: 16,
        pitch: 60,
        bearing: 0
      });
    }
  }, [map, mapReady, currentPosition, isFollowing, showPulse]);

  // Change pulse animation based on steps
  useEffect(() => {
    if (currentStep > 0) {
      setShowPulse(true);
      const timeout = setTimeout(() => {
        setShowPulse(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [currentStep]);

  return null;
};

export default usePositionTracker;
