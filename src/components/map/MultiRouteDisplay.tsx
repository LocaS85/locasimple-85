
import React from 'react';
import { Button } from '@/components/ui/button';
import { TransportMode } from '@/hooks/useMapboxRoutes';
import { Car, Walk, Bike, Clock, LocateIcon, Save } from 'lucide-react';

interface RouteResponse {
  geometry: any;
  duration: number;
  distance: number;
  legs: any[];
}

interface MultiRouteDisplayProps {
  routes: Record<TransportMode, RouteResponse>;
  activeMode: TransportMode;
  onModeChange: (mode: string) => void;
  onRouteSelect?: (route: RouteResponse, mode: string) => void;
  onSaveRoute?: (route: RouteResponse, mode: string) => void;
}

const MultiRouteDisplay: React.FC<MultiRouteDisplayProps> = ({
  routes,
  activeMode,
  onModeChange,
  onRouteSelect,
  onSaveRoute
}) => {
  // Get the appropriate icon based on transport mode
  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'driving':
      case 'driving-traffic':
        return <Car className="h-4 w-4" />;
      case 'cycling':
        return <Bike className="h-4 w-4" />;
      case 'walking':
        return <Walk className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  // Format duration from seconds to minutes
  const formatDuration = (seconds: number): string => {
    if (!seconds) return 'N/A';
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}min` : ''}`;
  };

  // Format distance from meters to km
  const formatDistance = (meters: number): string => {
    if (!meters) return 'N/A';
    const km = meters / 1000;
    return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
  };

  // Get all available modes that have routes
  const availableModes = Object.entries(routes)
    .filter(([_, route]) => route && route.geometry)
    .map(([mode]) => mode as TransportMode);

  if (availableModes.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 text-center">
        <p className="text-gray-600">Calcul d'itinéraire en cours...</p>
      </div>
    );
  }

  const selectedRoute = routes[activeMode];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
      {/* Header with mode tabs */}
      <div className="flex border-b">
        {availableModes.map((mode) => (
          <button
            key={mode}
            className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 text-xs font-medium ${
              activeMode === mode
                ? 'bg-primary text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => onModeChange(mode)}
          >
            {getTransportIcon(mode)}
            <span>
              {mode === 'driving-traffic' 
                ? 'Trafic' 
                : mode === 'driving' 
                  ? 'Voiture' 
                  : mode === 'walking' 
                    ? 'À pied' 
                    : 'Vélo'}
            </span>
          </button>
        ))}
      </div>

      {/* Route details */}
      {selectedRoute && selectedRoute.geometry && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{formatDuration(selectedRoute.duration)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <LocateIcon className="h-4 w-4" />
              <span className="font-medium">{formatDistance(selectedRoute.distance)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-2">
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1"
              onClick={() => onRouteSelect && onRouteSelect(selectedRoute, activeMode)}
            >
              Démarrer
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSaveRoute && onSaveRoute(selectedRoute, activeMode)}
            >
              <Save className="h-4 w-4 mr-1" />
              Sauvegarder
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiRouteDisplay;
