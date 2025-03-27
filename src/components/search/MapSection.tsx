
import React, { useState, useEffect } from 'react';
import MapContainer from '@/components/map/MapContainer';
import type { Result } from '@/components/ResultsList';
import { useSearchMenu } from '@/hooks/useSearchMenu';
import TransportModeFilter from '@/components/search/TransportModeFilter';
import { MAPBOX_TOKEN } from '@/config/environment';
import mapboxgl from 'mapbox-gl';
import { getTransportModeColor } from '@/data/transportModes';
import { toast } from 'sonner';

interface MapSectionProps {
  results: Result[];
  center: [number, number];
  radius: number;
  radiusUnit: 'km' | 'miles';
  radiusType: 'distance' | 'duration';
  duration: number;
  timeUnit: 'minutes' | 'hours';
  transportMode: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isRecording: boolean;
  onMicClick: () => void;
  onLocationClick: () => void;
  isLocationActive: boolean;
  loading: boolean;
  showRoutes: boolean;
  onSearch: () => void;
  selectedResultId?: string;
  onResultClick: (result: Result) => void;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  searchHistory: string[];
  savedSearches: string[];
  onHistoryItemClick: (query: string) => void;
  onSaveSearch: (query: string) => void;
  onRemoveSavedSearch: (query: string) => void;
  resetSearch: () => void;
  onTransportModeChange: (mode: string) => void;
  userLocation?: [number, number];
}

export const MapSection: React.FC<MapSectionProps> = ({
  results,
  center,
  radius,
  radiusUnit,
  radiusType,
  duration,
  timeUnit,
  transportMode,
  searchQuery,
  onSearchChange,
  isRecording,
  onMicClick,
  onLocationClick,
  isLocationActive,
  loading,
  showRoutes,
  onSearch,
  selectedResultId,
  onResultClick,
  selectedCategory,
  onCategorySelect,
  searchHistory,
  savedSearches,
  onHistoryItemClick,
  onSaveSearch,
  onRemoveSavedSearch,
  resetSearch,
  onTransportModeChange,
  userLocation
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const { menuOpen, setMenuOpen, toggleMenu } = useSearchMenu();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [routeSources, setRouteSources] = useState<string[]>([]);
  const [routeLayers, setRouteLayers] = useState<string[]>([]);

  // Fetch routes when results, center or transport mode changes
  useEffect(() => {
    if (!map || !showRoutes || results.length === 0 || !center) return;
    
    const fetchAndDisplayRoutes = async () => {
      // Clean up previous routes
      routeLayers.forEach(layerId => {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
      });
      
      routeSources.forEach(sourceId => {
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      });
      
      const newRouteSources: string[] = [];
      const newRouteLayers: string[] = [];
      
      if (!MAPBOX_TOKEN) {
        console.error('Mapbox token is missing');
        toast.error('Le token Mapbox est manquant, impossible d\'afficher les itinéraires');
        return;
      }
      
      let hasAddedRoute = false;
      
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (!result.latitude || !result.longitude) continue;
        
        try {
          // Fetch route from Mapbox Directions API
          const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${center[0]},${center[1]};${result.longitude},${result.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
          );
          
          if (!response.ok) {
            console.error(`Error fetching route: ${response.statusText}`);
            continue;
          }
          
          const data = await response.json();
          
          if (!data.routes || data.routes.length === 0) {
            console.warn(`No route found for result ${i}`);
            continue;
          }
          
          const route = data.routes[0];
          const sourceId = `route-source-${i}`;
          const layerId = `route-layer-${i}`;
          
          // Add route source to map
          map.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            }
          });
          
          // Add route layer to map
          map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': result.color || getTransportModeColor(transportMode),
              'line-width': selectedResultId === result.id ? 5 : 3,
              'line-opacity': selectedResultId ? (selectedResultId === result.id ? 1 : 0.6) : 0.8
            }
          });
          
          newRouteSources.push(sourceId);
          newRouteLayers.push(layerId);
          hasAddedRoute = true;
          
          // Add distance and duration information if available
          if (route.distance && route.duration) {
            console.log(`Route ${i+1}: ${(route.distance/1000).toFixed(1)}km, ${Math.round(route.duration/60)}min`);
          }
        } catch (error) {
          console.error(`Error processing route for result ${i}:`, error);
        }
      }
      
      setRouteSources(newRouteSources);
      setRouteLayers(newRouteLayers);
      
      if (hasAddedRoute) {
        // Fit map to include all routes
        try {
          const bounds = new mapboxgl.LngLatBounds();
          bounds.extend(center as [number, number]);
          
          results.forEach(result => {
            if (result.latitude && result.longitude) {
              bounds.extend([result.longitude, result.latitude]);
            }
          });
          
          map.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15
          });
        } catch (error) {
          console.error('Error fitting bounds:', error);
        }
      }
    };
    
    fetchAndDisplayRoutes();
  }, [map, showRoutes, results, center, transportMode, selectedResultId]);

  // Initialize map reference when MapContainer sets it
  const handleMapInitialized = (mapInstance: mapboxgl.Map) => {
    setMap(mapInstance);
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        results={results}
        center={center}
        radius={radius}
        radiusUnit={radiusUnit}
        radiusType={radiusType}
        duration={duration}
        timeUnit={timeUnit}
        transportMode={transportMode}
        isRecording={isRecording}
        onMicClick={onMicClick}
        onLocationClick={onLocationClick}
        isLocationActive={isLocationActive}
        loading={loading}
        showRoutes={showRoutes}
        onSearch={onSearch}
        selectedResultId={selectedResultId}
        onResultClick={onResultClick}
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
        userLocation={userLocation}
        onMapInitialized={handleMapInitialized}
      />
      
      {/* Transport Mode Filter - added below location button */}
      <TransportModeFilter
        transportMode={transportMode}
        onTransportModeChange={onTransportModeChange}
      />
    </div>
  );
};

export default MapSection;
