
import React from 'react';
import { TransportMode } from '@/hooks/useMapboxRoutes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Car, PersonStanding, Bike, Clock, Bus } from 'lucide-react';
import { getTransportModeColor } from '@/data/transportModes';

interface RouteInfo {
  distance: number;
  duration: number;
  geometry?: any;
  legs?: any[];
}

interface MultiRouteDisplayProps {
  routes: Record<TransportMode, RouteInfo>;
  activeMode: TransportMode;
  onModeChange: (mode: string) => void;
  onRouteSelect?: (route: RouteInfo, mode: string) => void;
  onSaveRoute?: (route: RouteInfo, mode: string) => void;
}

const MultiRouteDisplay: React.FC<MultiRouteDisplayProps> = ({
  routes,
  activeMode,
  onModeChange,
  onRouteSelect,
  onSaveRoute
}) => {
  // Format distance and duration
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} h ${remainingMinutes} min`;
  };

  // Get icon based on mode
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'driving':
      case 'driving-traffic':
        return <Car className="h-4 w-4" />;
      case 'walking':
        return <PersonStanding className="h-4 w-4" />;
      case 'cycling':
        return <Bike className="h-4 w-4" />;
      case 'transit':
        return <Bus className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Filter out modes with no routes
  const availableModes = Object.entries(routes).filter(
    ([_, routeInfo]) => routeInfo.geometry && routeInfo.distance > 0
  ) as [TransportMode, RouteInfo][];

  if (availableModes.length === 0) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {availableModes.map(([mode, routeInfo]) => {
              const isActive = mode === activeMode;
              const modeColor = getTransportModeColor(mode);
              
              return (
                <Button
                  key={mode}
                  variant={isActive ? "default" : "outline"}
                  className={`flex flex-col items-center justify-center p-2 h-auto ${
                    isActive ? `bg-[${modeColor}]` : 'bg-white'
                  }`}
                  onClick={() => onModeChange(mode)}
                >
                  <div className="flex items-center justify-center mb-1">
                    {getModeIcon(mode)}
                  </div>
                  <div className="text-xs font-medium">
                    {formatDuration(routeInfo.duration)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistance(routeInfo.distance)}
                  </div>
                </Button>
              );
            })}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRouteSelect && onRouteSelect(routes[activeMode], activeMode)}
              className="text-xs"
            >
              Détails
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSaveRoute && onSaveRoute(routes[activeMode], activeMode)}
              className="text-xs"
            >
              Sauvegarder
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiRouteDisplay;
