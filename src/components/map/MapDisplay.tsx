
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { isApiKeyValid, MAPBOX_TOKEN } from '@/config/environment';
import { Category } from '@/types/categories';
import { CATEGORIES } from '@/types/categories';
import MapMarkers from './MapMarkers';
import CategoryScroller from './CategoryScroller';
import RouteLayer from './RouteLayer';
import MapControls from './MapControls';
import MultiRouteDisplay from './MultiRouteDisplay';

// Don't set token globally here - we'll set it in the component

interface MapDisplayProps {
  viewport: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  setViewport: (viewport: any) => void;
  places: any[];
  resultsCount?: number;
  selectedPlaceId?: string | null;
  popupInfo?: any;
  setPopupInfo: (info: any) => void;
  handleResultClick?: (result: any) => void;
  isLocationActive?: boolean;
  userLocation?: [number, number];
  loading?: boolean;
  handleLocationClick?: () => void;
  transportMode?: string;
  showRoutes?: boolean;
  setMap?: (map: mapboxgl.Map | null) => void;
  customStyle?: string;
}

const MapDisplay: React.FC<MapDisplayProps> = ({
  viewport,
  setViewport,
  places = [],
  resultsCount = 0,
  selectedPlaceId = null,
  popupInfo,
  setPopupInfo,
  handleResultClick,
  isLocationActive = false,
  userLocation,
  loading = false,
  handleLocationClick = () => {},
  transportMode = 'driving',
  showRoutes = false,
  setMap,
  customStyle
}) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if map is already initialized or container isn't ready
    if (mapInitialized || !mapContainerRef.current) return;
    
    // Set token correctly
    if (isApiKeyValid(MAPBOX_TOKEN)) {
      // Set mapbox token - use the correct property
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: customStyle || 'mapbox://styles/mapbox/streets-v11',
        center: [viewport.longitude, viewport.latitude],
        zoom: viewport.zoom
      });
      
      map.on('load', () => {
        setMapInitialized(true);
        if (setMap) setMap(map);
      });
      
      map.on('move', () => {
        const center = map.getCenter();
        setViewport({
          latitude: center.lat,
          longitude: center.lng,
          zoom: map.getZoom()
        });
      });
      
      mapRef.current = map;
      
      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Cleanup on unmount
      return () => {
        map.remove();
        if (setMap) setMap(null);
      };
    } else {
      console.error('Invalid Mapbox token. Map will not initialize.');
    }
  }, [viewport.longitude, viewport.latitude, viewport.zoom, mapInitialized, customStyle, setMap]);
  
  // Update map when viewport changes
  useEffect(() => {
    if (mapRef.current && mapInitialized) {
      mapRef.current.setCenter([viewport.longitude, viewport.latitude]);
      mapRef.current.setZoom(viewport.zoom);
    }
  }, [viewport.longitude, viewport.latitude, viewport.zoom, mapInitialized]);
  
  // Update user location marker when it changes
  useEffect(() => {
    if (!mapRef.current || !mapInitialized || !isLocationActive || !userLocation) return;
    
    // Add or update user location marker logic here
  }, [userLocation, isLocationActive, mapInitialized]);
  
  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };
  
  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 map-container"
        data-testid="map-container"
      />
      
      {!isApiKeyValid(MAPBOX_TOKEN) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-50">
          <div className="bg-white p-4 rounded-md shadow-lg max-w-md text-center">
            <p className="text-red-500 font-semibold">Mapbox token is missing or invalid</p>
            <p className="mt-2 text-sm">Please add a valid Mapbox token in your environment variables.</p>
          </div>
        </div>
      )}
      
      {isApiKeyValid(MAPBOX_TOKEN) && mapInitialized && (
        <>
          <CategoryScroller 
            categories={CATEGORIES} 
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
          
          <MapMarkers
            map={mapRef.current}
            places={places}
            selectedPlaceId={selectedPlaceId}
            popupInfo={popupInfo}
            setPopupInfo={setPopupInfo}
            handleMarkerClick={handleResultClick}
            userLocation={isLocationActive ? userLocation : undefined}
          />
          
          {showRoutes && userLocation && (
            <MultiRouteDisplay
              map={mapRef.current}
              userLocation={userLocation}
              destinations={places}
              transportMode={transportMode}
            />
          )}
          
          <MapControls
            isLocationActive={isLocationActive}
            handleLocationClick={handleLocationClick}
            loading={loading}
            resultsCount={resultsCount}
          />
        </>
      )}
    </div>
  );
};

export default MapDisplay;
