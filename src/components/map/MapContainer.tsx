
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
  loading?: boolean;
  showRoutes?: boolean;
  onSearch?: () => void;
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
  isLocationActive = false,
  loading = false,
  showRoutes = false,
  onSearch = () => {}
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const centerMarker = useRef<mapboxgl.Marker | null>(null);
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

  // Update center when coordinates change
  useEffect(() => {
    if (!map.current || !isMapInitialized) return;
    
    // Update map center
    map.current.flyTo({
      center: center,
      zoom: map.current.getZoom(),
      speed: 1.5,
      curve: 1,
      essential: true
    });
    
    // Add or update center marker if location is active
    if (isLocationActive) {
      if (centerMarker.current) {
        centerMarker.current.setLngLat(center);
      } else {
        // Create a custom marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'center-marker';
        markerEl.innerHTML = `
          <div class="relative">
            <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            <div class="absolute -inset-2 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
          </div>
        `;
        
        centerMarker.current = new mapboxgl.Marker(markerEl)
          .setLngLat(center)
          .addTo(map.current);
      }
    } else if (centerMarker.current) {
      // Remove center marker if location is not active
      centerMarker.current.remove();
      centerMarker.current = null;
    }
  }, [center, isMapInitialized, isLocationActive]);

  useEffect(() => {
    return () => {
      map.current?.remove();
      centerMarker.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-auto">
        <SearchInput
          searchQuery={searchQuery}
          isRecording={isRecording}
          isLocationActive={isLocationActive}
          loading={loading}
          onSearchChange={onSearchChange}
          onMicClick={onMicClick}
          onLocationClick={onLocationClick}
          onSearch={onSearch}
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
            showRoutes={showRoutes}
          />
        </>
      )}
    </div>
  );
};

export default MapContainer;
