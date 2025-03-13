
import { useState, useEffect } from 'react';
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
  // Initialisation correcte avec tous les modes de transport
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

  // Les modes de transport disponibles
  const transportModes: TransportMode[] = ['driving', 'walking', 'cycling', 'driving-traffic'];

  // Log des points de départ et d'arrivée pour le débogage
  useEffect(() => {
    if (from) {
      console.log('Route from point set:', from);
    }
    if (to) {
      console.log('Route to point set:', to);
    }
  }, [from, to]);

  // Vérifier si le mode hors ligne est activé
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
    
    // Vérification initiale
    checkConnectivity();
    
    return () => {
      window.removeEventListener('online', checkConnectivity);
      window.removeEventListener('offline', checkConnectivity);
    };
  }, [offlineMode]);

  // Calculer un itinéraire pour un mode de transport spécifique
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
      // Compiler tous les points de l'itinéraire
      const allPoints: [number, number][] = [start];
      
      // Ajouter les points intermédiaires
      if (viaPoints.length > 0) {
        allPoints.push(...viaPoints);
      }
      
      // Ajouter le point d'arrivée
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

  // Calculer les itinéraires pour tous les modes de transport
  const calculateAllRoutes = async (
    start = from,
    end = to,
    viaPoints = waypoints
  ) => {
    if (!start || !end) {
      console.warn('Cannot calculate all routes: missing start or end point');
      toast.error('Points de départ et d\'arrivée requis');
      return null;
    }

    setLoading(true);
    setError(null);
    
    const perfMarkerId = 'multi-route-calculation';
    startPerformanceMarker(perfMarkerId);

    try {
      const allPoints: [number, number][] = [start, ...viaPoints, end];
      
      console.log(`Calculating routes for all transport modes from ${start} to ${end}`);
      
      // En mode hors ligne, vérifier les données en cache d'abord
      if (offlineMode) {
        const cachedRoutes = sessionStorage.getItem(`routes-${JSON.stringify(allPoints)}`);
        if (cachedRoutes) {
          const parsedRoutes = JSON.parse(cachedRoutes) as Record<TransportMode, RouteResponse | null>;
          console.log('Using cached routes for offline mode');
          setRoutes(parsedRoutes);
          endPerformanceMarker(perfMarkerId);
          return parsedRoutes;
        }
      }
      
      const results = await mapboxService.getMultiModeDirections(
        allPoints,
        transportModes
      );
      
      // Vérifier quels modes ont réussi
      Object.entries(results).forEach(([mode, result]) => {
        if (result) {
          console.log(`${mode} route calculation successful with ${result.routes.length} routes`);
        } else {
          console.warn(`${mode} route calculation failed`);
        }
      });
      
      // Mettre en cache les résultats pour le mode hors ligne
      sessionStorage.setItem(`routes-${JSON.stringify(allPoints)}`, JSON.stringify(results));
      
      setRoutes(results as Record<TransportMode, RouteResponse | null>);
      endPerformanceMarker(perfMarkerId);
      return results as Record<TransportMode, RouteResponse | null>;
    } catch (err) {
      endPerformanceMarker(perfMarkerId);
      handleError(err, 'Erreur lors du calcul des itinéraires');
      setError('Erreur lors du calcul des itinéraires');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un point intermédiaire
  const addWaypoint = (point: [number, number]) => {
    setWaypoints(prev => [...prev, point]);
  };

  // Supprimer un point intermédiaire
  const removeWaypoint = (index: number) => {
    setWaypoints(prev => prev.filter((_, i) => i !== index));
  };

  // Réorganiser les points intermédiaires
  const reorderWaypoints = (newOrder: [number, number][]) => {
    setWaypoints(newOrder);
  };

  // Effacer tous les itinéraires
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
