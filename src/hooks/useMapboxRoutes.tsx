import { useState, useEffect, useCallback } from 'react';
import { mapboxService, RouteResponse, TransportMode } from '@/services/mapboxService';
import { toast } from 'sonner';
import { startPerformanceMarker, endPerformanceMarker } from '@/utils/performanceMonitoring';
import { handleError } from '@/utils/errorHandling';

interface RouteState {
  [key: string]: RouteResponse | null;
}

interface UseMapboxRoutesProps {
  initialFrom?: [number, number];
  initialTo?: [number, number];
}

export const useMapboxRoutes = ({
  initialFrom,
  initialTo
}: UseMapboxRoutesProps = {}) => {
  const [from, setFrom] = useState<[number, number] | null>(initialFrom || null);
  const [to, setTo] = useState<[number, number] | null>(initialTo || null);
  const [waypoints, setWaypoints] = useState<[number, number][]>([]);
  const [routes, setRoutes] = useState<Record<TransportMode, RouteResponse | null>>({
    'driving': null,
    'walking': null,
    'cycling': null,
    'driving-traffic': null
  });
  const [activeMode, setActiveMode] = useState<TransportMode>('driving');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offlineMode, setOfflineMode] = useState(false);

  const transportModes: TransportMode[] = ['driving', 'walking', 'cycling', 'driving-traffic'];

  useEffect(() => {
    if (from) {
      console.log('Route from point set:', from);
    }
    if (to) {
      console.log('Route to point set:', to);
    }
  }, [from, to]);

  useEffect(() => {
    const checkConnectivity = () => {
      const isOffline = !navigator.onLine;
      if (isOffline !== offlineMode) {
        setOfflineMode(isOffline);
        if (isOffline) {
          toast.info("Mode hors ligne activé - utilisation des données en cache");
        } else {
          toast.success("Connexion rétablie");
        }
      }
    };

    window.addEventListener('online', checkConnectivity);
    window.addEventListener('offline', checkConnectivity);
    
    checkConnectivity();
    
    return () => {
      window.removeEventListener('online', checkConnectivity);
      window.removeEventListener('offline', checkConnectivity);
    };
  }, [offlineMode]);

  const calculateRoute = async (
    mode: TransportMode = activeMode,
    start = from,
    end = to,
    viaPoints = waypoints
  ) => {
    if (!start || !end) {
      console.warn('Cannot calculate route: missing start or end point');
      toast.error('Points de départ et d\'arrivée requis');
      return null;
    }

    setLoading(true);
    setError(null);

    const perfMarkerId = `route-calculation-${mode}`;
    startPerformanceMarker(perfMarkerId);

    try {
      const allPoints: [number, number][] = [start];
      
      if (viaPoints.length > 0) {
        allPoints.push(...viaPoints);
      }
      
      allPoints.push(end);

      console.log(`Calculating ${mode} route from ${start} to ${end} with ${viaPoints.length} waypoints`);
      
      const routeResult = await mapboxService.getDirections(allPoints, {
        profile: mode,
        alternatives: true,
        geometries: 'geojson',
        steps: true,
        overview: 'full',
        annotations: ['distance', 'duration'],
        voice_instructions: true,
        banner_instructions: true
      });

      if (routeResult) {
        console.log(`Route calculated for ${mode} mode, length: ${routeResult.routes.length} routes`);
        setRoutes(prev => ({ ...prev, [mode]: routeResult }));
        endPerformanceMarker(perfMarkerId);
        return routeResult;
      } else {
        throw new Error('Pas d\'itinéraire trouvé');
      }
    } catch (err) {
      endPerformanceMarker(perfMarkerId);
      const errorInfo = handleError(err, `Erreur de calcul d'itinéraire (${mode})`);
      setError(errorInfo.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const calculateAllRoutes = useCallback(async () => {
    if (!from || !to) {
      console.error('Cannot calculate routes: missing origin or destination coordinates');
      return;
    }
    
    setLoading(true);
    
    try {
      const results = await Promise.all(
        transportModes.map(async (mode) => {
          try {
            const result = await mapboxService.getDirections({
              origin: from,
              destination: to,
              profile: mode.mapboxId
            });
            
            if (result && 'routes' in result && Array.isArray(result.routes)) {
              return {
                mode: mode.mapboxId,
                data: result.routes
              };
            } else {
              console.error(`No valid routes returned for mode: ${mode.mapboxId}`);
              return {
                mode: mode.mapboxId,
                data: []
              };
            }
          } catch (error) {
            console.error(`Error fetching ${mode.mapboxId} route:`, error);
            return {
              mode: mode.mapboxId,
              data: []
            };
          }
        })
      );
      
      const newRoutes: Record<string, any[]> = {};
      results.forEach(result => {
        newRoutes[result.mode] = result.data;
      });
      
      setRoutes(newRoutes);
      
      if ((!newRoutes[activeMode] || newRoutes[activeMode].length === 0) && Object.values(newRoutes).some(r => r.length > 0)) {
        for (const mode of transportModes) {
          if (newRoutes[mode.mapboxId] && newRoutes[mode.mapboxId].length > 0) {
            setActiveMode(mode.mapboxId);
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error calculating routes:', error);
      toast.error('Erreur lors du calcul des itinéraires');
      setRoutes({});
    } finally {
      setLoading(false);
    }
  }, [from, to, activeMode, setActiveMode, transportModes]);

  const addWaypoint = (point: [number, number]) => {
    setWaypoints(prev => [...prev, point]);
  };

  const removeWaypoint = (index: number) => {
    setWaypoints(prev => prev.filter((_, i) => i !== index));
  };

  const reorderWaypoints = (newOrder: [number, number][]) => {
    setWaypoints(newOrder);
  };

  const clearRoutes = () => {
    setRoutes({
      'driving': null,
      'walking': null,
      'cycling': null,
      'driving-traffic': null
    });
  };

  return {
    from,
    setFrom,
    to, 
    setTo,
    waypoints,
    setWaypoints,
    addWaypoint,
    removeWaypoint,
    reorderWaypoints,
    routes,
    activeMode,
    setActiveMode,
    transportModes,
    loading,
    error,
    offlineMode,
    calculateRoute,
    calculateAllRoutes,
    clearRoutes
  };
};

export default useMapboxRoutes;
