
import { useState, useCallback, useEffect } from 'react';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

interface Direction {
  text: string;
  distance: number;
  duration: number;
  maneuver: {
    type: string;
    instruction: string;
    bearing_before: number;
    bearing_after: number;
  };
}

export const useNavigationState = () => {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFollowing, setIsFollowing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFollowMode = useCallback(() => {
    setIsFollowing(prev => !prev);
  }, []);

  const loadRoute = useCallback(async (
    start: [number, number],
    end: [number, number],
    transportMode: string
  ) => {
    if (!MAPBOX_TOKEN) {
      toast.error('Mapbox token manquant');
      return;
    }

    setIsLoading(true);

    try {
      // Format coordinates for Mapbox API
      const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
      
      // Use the appropriate API endpoint based on transport mode
      const url = `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${coordinates}?steps=true&geometries=geojson&overview=full&voice_instructions=true&banner_instructions=true&language=fr&access_token=${MAPBOX_TOKEN}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to load route: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        toast.error('Aucun itinéraire trouvé');
        return;
      }
      
      const route = data.routes[0];
      
      // Extract steps from legs
      const allSteps: Direction[] = [];
      if (route.legs) {
        route.legs.forEach((leg: any) => {
          if (leg.steps) {
            leg.steps.forEach((step: any) => {
              allSteps.push({
                text: step.maneuver.instruction || 'Continuez tout droit',
                distance: step.distance,
                duration: step.duration,
                maneuver: {
                  type: step.maneuver.type,
                  instruction: step.maneuver.instruction,
                  bearing_before: step.maneuver.bearing_before,
                  bearing_after: step.maneuver.bearing_after
                }
              });
            });
          }
        });
      }
      
      setDirections(allSteps);
      setDistance(route.distance);
      setDuration(route.duration);
      setCurrentStep(0);
      setProgress(0);
    } catch (error) {
      console.error('Error loading route:', error);
      toast.error("Erreur lors du chargement de l'itinéraire");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Simulate progress updates
  useEffect(() => {
    if (directions.length === 0 || !isFollowing) return;
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < directions.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
      
      setProgress(prev => {
        const newProgress = prev + (100 / directions.length);
        return Math.min(newProgress, 100);
      });
    }, 10000); // Move to next step every 10 seconds (simulated)
    
    return () => clearInterval(interval);
  }, [directions, isFollowing]);

  return {
    directions,
    currentStep,
    distance,
    duration,
    progress,
    isFollowing,
    isLoading,
    toggleFollowMode,
    setCurrentStep,
    loadRoute
  };
};

export default useNavigationState;
