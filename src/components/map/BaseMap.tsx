
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapContext } from '@/contexts/MapContext';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

interface BaseMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  onMapLoaded?: (map: mapboxgl.Map) => void;
}

export const BaseMap: React.FC<BaseMapProps> = ({
  initialCenter = [2.3522, 48.8566], // Paris by default
  initialZoom = 13,
  onMapLoaded
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { setMap, setViewport } = useMapContext();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Verify Mapbox token
    if (!MAPBOX_TOKEN) {
      toast.error('Mapbox token is missing. Please set it in your environment variables.');
      return;
    }

    // Initialize Mapbox map
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
      doubleClickZoom: true
    });
    
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapInstance.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');
    
    // Set map ready after it's loaded
    mapInstance.on('load', () => {
      console.log('Map loaded successfully');
      setMap(mapInstance);
      
      setViewport({
        center: initialCenter,
        zoom: initialZoom,
        bearing: 0,
        pitch: 0
      });
      
      if (onMapLoaded) {
        onMapLoaded(mapInstance);
      }
    });

    // Clean up
    return () => {
      mapInstance.remove();
      setMap(null);
    };
  }, [initialCenter, initialZoom, onMapLoaded, setMap, setViewport]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden" />
    </div>
  );
};
