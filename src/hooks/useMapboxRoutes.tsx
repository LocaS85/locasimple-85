
import { useState, useCallback, useEffect } from 'react';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

// Define proper types for transport modes
export type TransportMode = 'driving' | 'walking' | 'cycling' | 'driving-traffic';

interface RouteResponse {
  geometry: any;
  duration: number;
  distance: number;
  legs: any[];
}

const transportModeMap: Record<TransportMode, string> = {
  'driving': 'driving',
  'walking': 'walking',
  'cycling': 'cycling',
  'driving-traffic': 'driving-traffic'
};

export const useMapboxRoutes = () => {
  const [from, setFrom] = useState<[number, number] | undefined>();
  const [to, setTo] = useState<[number, number] | undefined>();
  const [routes, setRoutes] = useState<Record<TransportMode, RouteResponse>>({
    'driving': { geometry: null, duration: 0, distance: 0, legs: [] },
    'walking': { geometry: null, duration: 0, distance: 0, legs: [] },
    'cycling': { geometry: null, duration: 0, distance: 0, legs: [] },
    'driving-traffic': { geometry: null, duration: 0, distance: 0, legs: [] }
  });
  const [activeMode, setActiveMode] = useState<TransportMode>('driving');
  const [loading, setLoading] = useState(false);

  // Calculate a route for a specific transport mode
  const calculateRoute = useCallback(async (mode: TransportMode): Promise<RouteResponse | null> => {
    if (!from || !to || !MAPBOX_TOKEN) {
      console.warn('Missing required parameters for route calculation');
      return null;
    }

    try {
      // Format coordinates for Mapbox API
      const coordinates = `${from[0]},${from[1]};${to[0]},${to[1]}`;
      
      // Use the transport mode directly with Mapbox API
      const url = `https://api.mapbox.com/directions/v5/mapbox/${transportModeMap[mode]}/${coordinates}?alternatives=true&geometries=geojson&steps=true&access_token=${MAPBOX_TOKEN}&language=fr`;
      
      console.log(`Calculating ${mode} route from [${from}] to [${to}]`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to calculate ${mode} route: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        console.warn(`No ${mode} routes found`);
        return null;
      }
      
      console.log(`Received ${data.routes.length} ${mode} routes, distance: ${data.routes[0].distance / 1000}km, duration: ${Math.round(data.routes[0].duration / 60)}min`);
      
      return data.routes[0];
    } catch (error) {
      console.error(`Error calculating ${mode} route:`, error);
      return null;
    }
  }, [from, to]);

  // Calculate routes for all transport modes
  const calculateAllRoutes = useCallback(async () => {
    if (!from || !to) {
      console.warn('Origin or destination coordinates missing');
      return;
    }

    setLoading(true);
    console.log('Calculating routes for all transport modes');

    const newRoutes: Partial<Record<TransportMode, RouteResponse>> = {};
    
    // Parallel calculation of routes for all transport modes
    const modes: TransportMode[] = ['driving', 'walking', 'cycling', 'driving-traffic'];
    
    try {
      const results = await Promise.all(
        modes.map(async mode => {
          const route = await calculateRoute(mode);
          return { mode, route };
        })
      );
      
      // Process results
      results.forEach(({ mode, route }) => {
        if (route) {
          newRoutes[mode] = route;
        }
      });
      
      // Update state with all available routes
      setRoutes(prev => ({ ...prev, ...newRoutes }));
      console.log(`Successfully calculated ${Object.keys(newRoutes).length} routes`);
    } catch (error) {
      console.error('Error calculating routes:', error);
      toast.error('Erreur lors du calcul des itinéraires');
      
      // Reset routes on error
      setRoutes({
        'driving': { geometry: null, duration: 0, distance: 0, legs: [] },
        'walking': { geometry: null, duration: 0, distance: 0, legs: [] },
        'cycling': { geometry: null, duration: 0, distance: 0, legs: [] },
        'driving-traffic': { geometry: null, duration: 0, distance: 0, legs: [] }
      });
    } finally {
      setLoading(false);
    }
  }, [from, to, calculateRoute]);

  // Calculate routes when from and to are updated
  useEffect(() => {
    if (from && to) {
      calculateAllRoutes();
    }
  }, [from, to, calculateAllRoutes]);

  return {
    from,
    setFrom,
    to,
    setTo,
    routes,
    activeMode,
    setActiveMode,
    loading,
    calculateRoute,
    calculateAllRoutes
  };
};

export default useMapboxRoutes;
