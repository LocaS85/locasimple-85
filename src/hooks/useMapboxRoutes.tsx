
import { useState, useEffect } from 'react';
import { mapboxService, RouteResponse, TransportMode } from '@/services/mapboxService';
import { toast } from 'sonner';

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
        return routeResult;
      } else {
        throw new Error('Pas d\'itinéraire trouvé');
      }
    } catch (err) {
      console.error(`Erreur de calcul d'itinéraire (${mode}):`, err);
      setError(`Erreur lors du calcul de l'itinéraire en ${mode}`);
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

    try {
      const allPoints: [number, number][] = [start, ...viaPoints, end];
      
      console.log(`Calculating routes for all transport modes from ${start} to ${end}`);
      
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
      
      setRoutes(results);
      return results;
    } catch (err) {
      console.error('Erreur de calcul des itinéraires:', err);
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
    calculateRoute,
    calculateAllRoutes,
    clearRoutes
  };
};

export default useMapboxRoutes;
