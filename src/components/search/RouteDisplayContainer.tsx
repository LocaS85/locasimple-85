
import React from 'react';
import { getTransportModeIcon } from '@/utils/categoryIcons';

interface RouteDisplayContainerProps {
  destinations?: [number, number];
  origin?: [number, number];
  transportMode?: string;
  selectedResultId?: string;
  from?: [number, number];
  to?: [number, number];
  routes?: any;
  activeMode?: string;
  setActiveMode?: (mode: string) => void;
  setTransportMode?: (mode: string) => void;
}

export const RouteDisplayContainer = ({
  destinations,
  origin,
  transportMode = 'driving',
  selectedResultId,
  from,
  to,
  routes,
  activeMode,
  setActiveMode,
  setTransportMode
}: RouteDisplayContainerProps) => {
  // Use either the new props or fall back to old ones
  const startPoint = from || origin;
  const endPoint = to || destinations;
  const currentMode = activeMode || transportMode;
  
  if (!startPoint || !endPoint) return null;

  return (
    <div className="route-display-container absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
      <h3 className="text-lg font-semibold mb-2">Itinéraire</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white">A</span>
          <span>Votre position</span>
        </div>
        <div className="w-0.5 h-4 bg-gray-300 ml-3"></div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white">B</span>
          <span>Destination</span>
        </div>
      </div>
      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
        Mode de transport: {currentMode}
      </div>
      {routes && setActiveMode && (
        <div className="flex gap-2 mt-3">
          {Object.keys(routes).map((mode) => (
            <button
              key={mode}
              className={`p-2 rounded ${mode === activeMode ? 'bg-blue-100 text-blue-700' : 'bg-gray-50'}`}
              onClick={() => {
                setActiveMode(mode);
                if (setTransportMode) setTransportMode(mode);
              }}
            >
              {getTransportModeIcon(mode, "w-4 h-4")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RouteDisplayContainer;
