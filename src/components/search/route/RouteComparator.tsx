
import React, { useState } from 'react';
import { Map, BarChart2, Mountain } from 'lucide-react';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

interface RouteComparatorProps {
  mode: 'split-view' | 'tabs' | 'cards';
  metrics: string[];
  displayModes: string[];
  origin: any;
  destinations: any[];
  transportMode: string;
}

interface RouteInfo {
  distance: number;
  duration: number;
  elevation?: number;
  cost?: number;
}

const RouteComparator: React.FC<RouteComparatorProps> = ({
  mode = 'split-view',
  metrics = ['distance', 'time'],
  displayModes = ['2d-map'],
  origin,
  destinations,
  transportMode
}) => {
  const [activeDisplayMode, setActiveDisplayMode] = useState(displayModes[0]);
  const [routes, setRoutes] = useState<Record<string, RouteInfo>>({
    // Mock data - in a real app, these would come from an API
    route1: { distance: 5.2, duration: 15, elevation: 120, cost: 0 },
    route2: { distance: 6.7, duration: 22, elevation: 80, cost: 0 }
  });

  // Function to format metrics
  const formatMetric = (metric: string, value: number) => {
    switch(metric) {
      case 'distance':
        return `${value.toFixed(1)} km`;
      case 'time':
      case 'duration':
        return value < 60 ? `${value} min` : `${Math.floor(value/60)}h ${value%60}min`;
      case 'elevation':
        return `${value}m`;
      case 'cost':
        return `${value.toFixed(2)}€`;
      default:
        return `${value}`;
    }
  };

  if (!origin || destinations.length === 0) {
    return null;
  }

  // Check if Mapbox token is available
  if (!MAPBOX_TOKEN) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        Token Mapbox manquant. Impossible de calculer les itinéraires.
      </div>
    );
  }

  const displayModeComponents = {
    '2d-map': <Map size={18} />,
    '3d-view': <Map3D />,
    'elevation-profile': <Mountain size={18} />
  };

  return (
    <div className="route-comparator bg-white p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Comparaison d'itinéraires</h3>
        
        {/* Display mode selector */}
        <div className="flex bg-gray-100 rounded-md overflow-hidden">
          {displayModes.map(dispMode => (
            <button
              key={dispMode}
              className={`p-2 ${
                activeDisplayMode === dispMode ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
              }`}
              onClick={() => setActiveDisplayMode(dispMode)}
              title={`Afficher en mode ${dispMode}`}
            >
              {dispMode === '2d-map' && <Map size={18} />}
              {dispMode === '3d-view' && <div>3D</div>}
              {dispMode === 'elevation-profile' && <Mountain size={18} />}
              <span className="sr-only">{dispMode}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex h-[calc(100%-2rem)] gap-4">
        {destinations.map((destination, index) => {
          const routeKey = `route${index+1}`;
          const routeInfo = routes[routeKey];
          
          if (!routeInfo) return null;
          
          return (
            <div key={routeKey} className="flex-1 border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-50 p-2 flex justify-between items-center">
                <div className="font-medium">Option {index + 1}</div>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => toast.success('Itinéraire sélectionné')}
                >
                  Choisir
                </button>
              </div>
              
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {metrics.map(metric => (
                    <div key={metric} className="bg-gray-50 p-2 rounded">
                      <div className="text-xs text-gray-500">
                        {metric === 'distance' && 'Distance'}
                        {metric === 'time' && 'Durée'}
                        {metric === 'elevation' && 'Dénivelé'}
                        {metric === 'cost' && 'Coût'}
                      </div>
                      <div className="font-semibold">
                        {formatMetric(metric, routeInfo[metric as keyof RouteInfo] as number)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Placeholder for route visualization */}
                <div className="h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                  {activeDisplayMode === '2d-map' && "Carte 2D"}
                  {activeDisplayMode === '3d-view' && "Vue 3D"}
                  {activeDisplayMode === 'elevation-profile' && "Profil d'élévation"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Custom Map3D component since it's not in lucide-react
const Map3D = () => (
  <div className="w-[18px] h-[18px] flex items-center justify-center">
    <span className="font-bold text-xs">3D</span>
  </div>
);

export default RouteComparator;
