
import React, { useState, useEffect } from 'react';
import type { Result } from '../ResultsList';
import RouteLayer from './RouteLayer';
import useMapMarkers from '@/hooks/useMapMarkers';
import useMapBounds from '@/hooks/useMapBounds';
import { getColorForResult } from '@/utils/mapColors';

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
  const [mapReady, setMapReady] = useState(false);

  // Check when the map is actually ready to receive markers
  useEffect(() => {
    if (!map) return;
    
    const checkMapReady = () => {
      if (map.isStyleLoaded() && map.getContainer()) {
        console.log("Map is ready for markers");
        setMapReady(true);
      } else {
        console.log("Map not ready yet, waiting...");
        setTimeout(checkMapReady, 100);
      }
    };
    
    const handleStyleLoad = () => {
      console.log("Style loaded event triggered");
      checkMapReady();
    };
    
    map.on('load', handleStyleLoad);
    map.on('style.load', handleStyleLoad);
    
    // Initial check
    checkMapReady();
    
    return () => {
      map.off('load', handleStyleLoad);
      map.off('style.load', handleStyleLoad);
    };
  }, [map]);
  
  // Use custom hooks for marker and bounds management
  useMapMarkers({
    map,
    results,
    mapReady,
    selectedResultId,
    onResultClick
  });
  
  useMapBounds({
    map,
    results,
    center,
    mapReady,
    onMarkersReady
  });

  // Route display for selected result or all results
  const routesToShow = selectedResultId 
    ? results.filter(r => r.id === selectedResultId)
    : (showRoutes ? results : []);

  return (
    <>
      {mapReady && routesToShow.map((result) => (
        <React.Fragment key={result.id}>
          {map && (
            <RouteLayer
              map={map}
              start={center}
              end={[result.longitude, result.latitude]}
              color={getColorForResult(result.color)}
              transportMode={transportMode}
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
