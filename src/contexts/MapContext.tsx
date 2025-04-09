
import React, { createContext, useContext, useState, ReactNode } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapFeature } from '@/types/search';

interface MapContextType {
  map: mapboxgl.Map | null;
  setMap: (map: mapboxgl.Map | null) => void;
  selectedFeature: MapFeature | null;
  setSelectedFeature: (feature: MapFeature | null) => void;
  viewport: {
    center: [number, number];
    zoom: number;
    bearing: number;
    pitch: number;
  };
  setViewport: (viewport: {
    center?: [number, number];
    zoom?: number;
    bearing?: number;
    pitch?: number;
  }) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<MapFeature | null>(null);
  const [viewport, setViewportState] = useState({
    center: [2.3522, 48.8566] as [number, number], // Paris by default
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });

  const setViewport = (newViewport: {
    center?: [number, number];
    zoom?: number;
    bearing?: number;
    pitch?: number;
  }) => {
    setViewportState(prev => ({
      ...prev,
      ...newViewport
    }));

    if (map) {
      if (newViewport.center) {
        map.setCenter(newViewport.center);
      }
      if (newViewport.zoom !== undefined) {
        map.setZoom(newViewport.zoom);
      }
      if (newViewport.bearing !== undefined) {
        map.setBearing(newViewport.bearing);
      }
      if (newViewport.pitch !== undefined) {
        map.setPitch(newViewport.pitch);
      }
    }
  };

  const value = {
    map,
    setMap,
    selectedFeature,
    setSelectedFeature,
    viewport,
    setViewport,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMapContext = (): MapContextType => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};
