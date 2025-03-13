
import React from 'react';
import { toast } from 'sonner';
import MultiRouteDisplay from '../map/MultiRouteDisplay';
import { TransportMode } from '@/hooks/useMapboxRoutes';

interface RouteDisplayContainerProps {
  selectedResultId?: string;
  from?: [number, number];
  to?: [number, number];
  routes: Record<TransportMode, any>;
  activeMode: TransportMode;
  setActiveMode: (mode: TransportMode) => void;
  setTransportMode: (mode: string) => void;
}

export const RouteDisplayContainer: React.FC<RouteDisplayContainerProps> = ({
  selectedResultId,
  from,
  to,
  routes,
  activeMode,
  setActiveMode,
  setTransportMode
}) => {
  if (!selectedResultId || !from || !to) {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-0 right-0 mx-auto max-w-md px-4 z-20">
      <MultiRouteDisplay
        routes={routes}
        activeMode={activeMode}
        onModeChange={(mode) => {
          setActiveMode(mode as TransportMode);
          setTransportMode(mode === 'driving-traffic' ? 'driving' : mode);
        }}
        onRouteSelect={(route, mode) => {
          console.log(`Route sélectionnée en mode ${mode}:`, route);
        }}
        onSaveRoute={(route, mode) => {
          toast.success(`Itinéraire en ${mode} sauvegardé`);
        }}
      />
    </div>
  );
};

export default RouteDisplayContainer;
