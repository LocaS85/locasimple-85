import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { TransportMode } from '@/hooks/useMapboxRoutes';

export interface MultiRouteDisplayProps {
  routeData: Record<TransportMode, any>;
  activeMode: TransportMode;
  onModeChange: (mode: string) => void;
  onRouteSelect?: (route: any, mode: string) => void;
  onSaveRoute?: (route: any, mode: string) => void;
}

const MultiRouteDisplay: React.FC<MultiRouteDisplayProps> = ({
  routeData,
  activeMode,
  onModeChange,
  onRouteSelect = () => {},
  onSaveRoute = () => {}
}) => {
  const [routeLayers, setRouteLayers] = useState<mapboxgl.Layer[]>([]);
  
  // This is a placeholder for the actual implementation
  // The real component would render UI elements for route control and display
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Itinéraires disponibles</h3>
      </div>
      
      <div className="flex gap-2 mb-3">
        {Object.keys(routeData).map((mode) => (
          <button
            key={mode}
            className={`px-3 py-1 text-xs rounded-full ${
              mode === activeMode 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => onModeChange(mode)}
          >
            {mode === 'driving-traffic' ? 'Voiture' : 
             mode === 'walking' ? 'À pied' :
             mode === 'cycling' ? 'Vélo' : 
             mode === 'transit' ? 'Transport' : mode}
          </button>
        ))}
      </div>
      
      {routeData[activeMode] && routeData[activeMode].routes && (
        <div className="space-y-2">
          {routeData[activeMode].routes.map((route: any, index: number) => (
            <div 
              key={index}
              className="p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100"
              onClick={() => onRouteSelect(route, activeMode)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Option {index + 1}</p>
                  <p className="text-xs text-gray-500">
                    {Math.round(route.duration / 60)} min • {(route.distance / 1000).toFixed(1)} km
                  </p>
                </div>
                <button 
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSaveRoute(route, activeMode);
                  }}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiRouteDisplay;
