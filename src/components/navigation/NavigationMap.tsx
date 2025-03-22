
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '@/config/environment';
import { getTransportModeColor } from '@/data/transportModes';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useRouteDisplay } from '@/hooks/useRouteNavigation';
import { usePositionTracker } from '@/hooks/usePositionTracker';
import 'mapbox-gl/dist/mapbox-gl.css';

interface NavigationMapProps {
  start: [number, number];
  end: [number, number];
  transportMode: string;
  currentStep: number;
  isFollowing: boolean;
}

const NavigationMap: React.FC<NavigationMapProps> = ({
  start,
  end,
  transportMode,
  currentStep,
  isFollowing
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);
  
  // Get transport mode color
  const routeColor = getTransportModeColor(transportMode);

  // Use custom hooks for map functionality
  const { map, isMapInitialized } = useMapInitialization({
    container: mapContainer,
    center: start,
    mapStyle: 'streets',
    initialOptions: {
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      zoom: 14,
      pitch: 45,
      bearing: 0
    }
  });

  // Set map as ready when initialized
  useEffect(() => {
    if (isMapInitialized) {
      setMapReady(true);
    }
  }, [isMapInitialized]);

  // Use hook for route display
  useRouteDisplay({
    map,
    mapReady,
    start,
    end,
    transportMode,
    routeColor
  });

  // Use hook for position tracking
  usePositionTracker({
    map,
    mapReady,
    currentPosition: start,
    currentStep,
    isFollowing,
    routeColor
  });

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default NavigationMap;
