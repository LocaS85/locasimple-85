import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import RadiusCircle from './RadiusCircle';
import MapMarkers from './MapMarkers';
import { SearchInput } from '../search/SearchInput';
import type { Result } from '../ResultsList';
import { MAPBOX_TOKEN } from '@/config/environment';

interface MapContainerProps {
  results: Result[];
  center: [number, number];
  radius?: number;
  radiusUnit?: 'km' | 'miles';
  radiusType?: 'distance' | 'duration';
  duration?: number;
  timeUnit?: 'minutes' | 'hours';
  transportMode?: string;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  isRecording?: boolean;
  onMicClick?: () => void;
  onLocationClick?: () => void;
  isLocationActive?: boolean;
}

const MapContainer: React.FC<MapContainerProps> = ({ 
  results, 
  center, 
  radius = 5, 
  radiusUnit = 'km', 
  radiusType = 'distance',
  duration = 15,
  timeUnit = 'minutes',
  transportMode = 'driving',
  searchQuery = '',
  onSearchChange = () => {},
  isRecording = false,
  onMicClick = () => {},
  onLocationClick = () => {},
  isLocationActive = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  
  useEffect(() => {
    if (!mapContainer.current || isMapInitialized) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: center,
        zoom: 13,
      });

      map.current.on('load', () => {
        setIsMapInitialized(true);
        
        map.current?.addControl(
          new mapboxgl.NavigationControl(),
          'top-right'
        );
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [mapContainer, center, isMapInitialized]);

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-11/12 max-w-md">
        <SearchInput
          searchQuery={searchQuery}
          isRecording={isRecording}
          isLocationActive={isLocationActive}
          onSearchChange={onSearchChange}
          onMicClick={onMicClick}
          onLocationClick={onLocationClick}
        />
      </div>
      
      {isMapInitialized && map.current && (
        <>
          <RadiusCircle
            map={map.current}
            center={center}
            radius={radius}
            radiusUnit={radiusUnit}
            radiusType={radiusType}
            duration={duration}
            timeUnit={timeUnit}
            transportMode={transportMode}
          />
          
          <MapMarkers
            map={map.current}
            results={results}
            center={center}
            transportMode={transportMode}
          />
        </>
      )}
    </div>
  );
};

export default MapContainer;
