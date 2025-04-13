
import React from 'react';

interface RouteDisplayContainerProps {
  destinations: [number, number];
  origin: [number, number];
  transportMode: string;
}

export const RouteDisplayContainer = ({
  destinations,
  origin,
  transportMode
}: RouteDisplayContainerProps) => {
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
        Mode de transport: {transportMode}
      </div>
    </div>
  );
};

export default RouteDisplayContainer;
