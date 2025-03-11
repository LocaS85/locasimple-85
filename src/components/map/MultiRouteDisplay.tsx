
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransportMode, RouteResponse, Route } from '@/services/mapboxService';
import { Car, Clock, Navigation2, MapPin, MoreHorizontal, Save, Share } from 'lucide-react';

interface MultiRouteDisplayProps {
  routes: Record<TransportMode, RouteResponse | null>;
  activeMode: TransportMode;
  onModeChange: (mode: TransportMode) => void;
  onRouteSelect?: (route: Route, mode: TransportMode) => void;
  onSaveRoute?: (route: Route, mode: TransportMode) => void;
  isFullScreen?: boolean;
}

// Helper pour formater les durées
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes} min`;
};

// Helper pour formater les distances
const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

// Composant pour afficher les icônes de mode de transport
const TransportModeIcon: React.FC<{ mode: TransportMode }> = ({ mode }) => {
  switch (mode) {
    case 'driving':
      return <Car className="h-4 w-4" />;
    case 'walking':
      return <Navigation2 className="h-4 w-4" />;
    case 'cycling':
      return <span className="text-lg">🚲</span>;
    case 'driving-traffic':
      return <span className="text-lg">🚦</span>;
    default:
      return <Navigation2 className="h-4 w-4" />;
  }
};

// Composant principal
const MultiRouteDisplay: React.FC<MultiRouteDisplayProps> = ({
  routes,
  activeMode,
  onModeChange,
  onRouteSelect,
  onSaveRoute,
  isFullScreen = false
}) => {
  // Fix: Properly initialize the state with required TransportMode keys
  const [selectedRouteIndices, setSelectedRouteIndices] = useState<Record<TransportMode, number>>({
    'driving': 0,
    'walking': 0,
    'cycling': 0,
    'driving-traffic': 0
  });
  
  // Mode labels pour l'affichage
  const modeLabels: Record<TransportMode, string> = {
    'driving': 'Voiture',
    'walking': 'À pied',
    'cycling': 'Vélo',
    'driving-traffic': 'Traffic'
  };

  // Sélectionner le premier itinéraire par défaut pour chaque mode
  useEffect(() => {
    const defaultSelected: Record<TransportMode, number> = {
      'driving': 0,
      'walking': 0,
      'cycling': 0,
      'driving-traffic': 0
    };
    
    Object.entries(routes).forEach(([mode, response]) => {
      if (response && response.routes.length > 0) {
        defaultSelected[mode as TransportMode] = 0;
      }
    });
    
    setSelectedRouteIndices(defaultSelected);
  }, [routes]);

  // Gérer la sélection d'un itinéraire
  const handleRouteSelect = (mode: TransportMode, index: number) => {
    setSelectedRouteIndices(prev => ({ ...prev, [mode]: index }));
    
    if (onRouteSelect && routes[mode]?.routes[index]) {
      onRouteSelect(routes[mode]!.routes[index], mode);
    }
  };

  // Sauvegarder un itinéraire
  const handleSaveRoute = (mode: TransportMode, index: number) => {
    if (onSaveRoute && routes[mode]?.routes[index]) {
      onSaveRoute(routes[mode]!.routes[index], mode);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${isFullScreen ? 'h-full' : ''}`}>
      <Tabs defaultValue={activeMode} onValueChange={(value) => onModeChange(value as TransportMode)}>
        <TabsList className="w-full">
          {Object.keys(routes).map((mode) => {
            const routeData = routes[mode as TransportMode];
            const hasRoutes = routeData && routeData.routes.length > 0;
            const fastestRoute = hasRoutes ? routeData!.routes[0] : null;
            
            return (
              <TabsTrigger 
                key={mode} 
                value={mode}
                disabled={!hasRoutes}
                className="flex-1"
              >
                <div className="flex flex-col items-center">
                  <TransportModeIcon mode={mode as TransportMode} />
                  <span className="text-xs mt-1">{modeLabels[mode as TransportMode]}</span>
                  {fastestRoute && (
                    <span className="text-xs text-gray-500 mt-0.5">
                      {formatDuration(fastestRoute.duration)}
                    </span>
                  )}
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        {Object.keys(routes).map((mode) => {
          const routeData = routes[mode as TransportMode];
          const hasRoutes = routeData && routeData.routes.length > 0;
          
          return (
            <TabsContent key={mode} value={mode} className="p-2">
              {!hasRoutes ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun itinéraire disponible pour ce mode de transport
                </div>
              ) : (
                <div className="space-y-3">
                  {routeData!.routes.map((route, index) => {
                    const isSelected = selectedRouteIndices[mode as TransportMode] === index;
                    
                    return (
                      <Card 
                        key={index}
                        className={`cursor-pointer transition-all ${
                          isSelected ? 'border-primary ring-1 ring-primary' : ''
                        }`}
                        onClick={() => handleRouteSelect(mode as TransportMode, index)}
                      >
                        <CardHeader className="py-3 px-4">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <TransportModeIcon mode={mode as TransportMode} />
                              <span className="ml-2">
                                {index === 0 ? 'Itinéraire recommandé' : `Alternative ${index}`}
                              </span>
                            </CardTitle>
                            <Badge variant={index === 0 ? "default" : "outline"}>
                              {formatDuration(route.duration)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center text-gray-500">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                <span>{formatDistance(route.distance)}</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                <span>{formatDuration(route.duration)}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveRoute(mode as TransportMode, index);
                                }}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Partage à implémenter
                                }}
                              >
                                <Share className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default MultiRouteDisplay;
