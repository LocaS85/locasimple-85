
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import RadiusCircle from './RadiusCircle';
import MapMarkers from './MapMarkers';
import { SearchInput } from '../search/SearchInput';
import type { Result } from '../ResultsList';
import { MAPBOX_TOKEN } from '@/config/environment';
import MapStyleSelector, { MapStyle } from './MapStyleSelector';

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
  selectedResultId?: string;
  onResultClick?: (result: Result) => void;
}

// Map style URLs for Mapbox
const MAP_STYLE_URLS = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  terrain: 'mapbox://styles/mapbox/outdoors-v12'
};

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
  onSearch = () => {},
  selectedResultId,
  onResultClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const centerMarker = useRef<mapboxgl.Marker | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapStyle>('streets');
  
  useEffect(() => {
    if (!mapContainer.current || isMapInitialized) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAP_STYLE_URLS[mapStyle],
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
  }, [mapContainer, center, isMapInitialized, mapStyle]);

  // Update map style when it changes
  useEffect(() => {
    if (!map.current || !isMapInitialized) return;
    map.current.setStyle(MAP_STYLE_URLS[mapStyle]);
  }, [mapStyle, isMapInitialized]);

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

  // Handle map style change
  const handleStyleChange = (newStyle: MapStyle) => {
    setMapStyle(newStyle);
  };

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
      
      {/* Map Style Selector */}
      <MapStyleSelector 
        onStyleChange={handleStyleChange}
        currentStyle={mapStyle}
      />
      
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
            selectedResultId={selectedResultId}
            onResultClick={onResultClick}
          />
        </>
      )}
      
      {/* Results Counter */}
      {results.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-sm font-medium">
          {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default MapContainer;
