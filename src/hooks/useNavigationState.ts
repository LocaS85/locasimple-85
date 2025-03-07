
import { useState, useCallback } from 'react';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';
import type { Direction } from '@/components/navigation/NavigationDirections';

export const useNavigationState = () => {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFollowing, setIsFollowing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Toggle follow mode
  const toggleFollowMode = useCallback(() => {
    setIsFollowing(prev => !prev);
  }, []);

  // Load route from Mapbox Directions API
  const loadRoute = useCallback(async (
    start: [number, number], 
    end: [number, number], 
    transportMode: string
  ) => {
    if (!MAPBOX_TOKEN) {
      toast.error('Token Mapbox manquant');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&overview=full&language=fr&access_token=${MAPBOX_TOKEN}`
      );
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'itinéraire');
      }
      
      const data = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        throw new Error('Aucun itinéraire trouvé');
      }
      
      const route = data.routes[0];
      
      // Set total distance and duration
      setDistance(route.distance / 1000); // Convert to km
      setDuration(Math.round(route.duration / 60)); // Convert to minutes
      
      // Parse directions
      const steps = route.legs[0].steps.map((step: any) => ({
        instruction: step.maneuver.instruction || formatManeuver(step.maneuver.type, step.maneuver.modifier),
        distance: step.distance / 1000, // Convert to km
        duration: step.duration / 60, // Convert to minutes
        maneuver: step.maneuver.type
      }));
      
      setDirections(steps);
      setCurrentStep(0);
      setProgress(0);

      // Start simulation in real app, this would be based on geolocation updates
      startSimulation();
      
    } catch (error) {
      console.error('Error loading route:', error);
      toast.error('Erreur lors du chargement de l\'itinéraire');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Format maneuver based on type and modifier
  const formatManeuver = (type: string, modifier?: string) => {
    switch (type) {
      case 'turn':
        return `Tourner ${modifier === 'right' ? 'à droite' : 'à gauche'}`;
      case 'depart':
        return 'Démarrer la navigation';
      case 'arrive':
        return 'Vous êtes arrivé à destination';
      case 'merge':
        return 'Rejoindre la circulation';
      case 'fork':
        return `Prendre la bifurcation ${modifier === 'right' ? 'à droite' : 'à gauche'}`;
      case 'roundabout':
        return 'Entrer dans le rond-point';
      case 'exit roundabout':
        return 'Sortir du rond-point';
      case 'continue':
        return 'Continuer tout droit';
      default:
        return 'Suivre les instructions';
    }
  };

  // Simulate navigation progress (in a real app, this would use geolocation)
  const startSimulation = () => {
    let step = 0;
    let elapsed = 0;
    const totalDuration = directions.reduce((sum, dir) => sum + dir.duration, 0);
    
    const interval = setInterval(() => {
      if (step >= directions.length) {
        clearInterval(interval);
        return;
      }
      
      elapsed += 0.5; // Add half a minute each time
      const newProgress = (elapsed / totalDuration) * 100;
      setProgress(Math.min(newProgress, 100));
      
      // Move to next step if current step duration has elapsed
      let stepDuration = 0;
      for (let i = 0; i <= step; i++) {
        stepDuration += directions[i]?.duration || 0;
      }
      
      if (elapsed >= stepDuration && step < directions.length - 1) {
        step++;
        setCurrentStep(step);
      }
    }, 2000); // Update every 2 seconds
    
    return () => clearInterval(interval);
  };

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
