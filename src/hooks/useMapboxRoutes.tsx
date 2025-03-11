
import { useState } from 'react';
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
  // Fix: Initialize routes with all required TransportMode keys
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

  // Calculer un itinéraire pour un mode de transport spécifique
  const calculateRoute = async (
    mode: TransportMode = activeMode,
    start = from,
    end = to,
    viaPoints = waypoints
  ) => {
    if (!start || !end) {
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
      toast.error('Points de départ et d\'arrivée requis');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const allPoints: [number, number][] = [start, ...viaPoints, end];
      
      const results = await mapboxService.getMultiModeDirections(
        allPoints,
        transportModes
      );
      
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
    setRoutes({});
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
