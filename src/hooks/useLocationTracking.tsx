
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseLocationTrackingProps {
  isLocationActive: boolean;
  setUserLocation: (location: [number, number]) => void;
  onLocationUpdate?: (location: [number, number]) => void;
  updateInterval?: number; // en millisecondes
}

export const useLocationTracking = ({
  isLocationActive,
  setUserLocation,
  onLocationUpdate,
  updateInterval = 5000 // Par défaut, mise à jour toutes les 5 secondes
}: UseLocationTrackingProps) => {
  const [watchId, setWatchId] = useState<number | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [lastPosition, setLastPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fonction pour démarrer le suivi de position
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur");
      toast.error("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }
    
    // Options de géolocalisation
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    
    // Fonction de succès
    const success = (position: GeolocationPosition) => {
      const { longitude, latitude } = position.coords;
      const newPosition: [number, number] = [longitude, latitude];
      
      // Mettre à jour les états
      setUserLocation(newPosition);
      setLastPosition(newPosition);
      setError(null);
      
      // Notifier les composants parents
      if (onLocationUpdate) {
        onLocationUpdate(newPosition);
      }
      
      console.log(`Position mise à jour: [${longitude}, ${latitude}]`);
    };
    
    // Fonction d'erreur
    const handleError = (error: GeolocationPositionError) => {
      setIsWatching(false);
      setWatchId(null);
      
      let message = "Erreur de géolocalisation";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = "L'accès à la géolocalisation a été refusé";
          break;
        case error.POSITION_UNAVAILABLE:
          message = "La position n'est pas disponible";
          break;
        case error.TIMEOUT:
          message = "La demande de géolocalisation a expiré";
          break;
      }
      
      setError(message);
      toast.error(message);
    };
    
    // Démarrer le watch
    const id = navigator.geolocation.watchPosition(success, handleError, options);
    setWatchId(id);
    setIsWatching(true);
    
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
        setIsWatching(false);
      }
    };
  }, [setUserLocation, onLocationUpdate]);
  
  // Fonction pour arrêter le suivi
  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsWatching(false);
      console.log('Suivi de la position arrêté');
    }
  }, [watchId]);
  
  // Gérer l'activation/désactivation du suivi
  useEffect(() => {
    if (isLocationActive) {
      startTracking();
    } else {
      stopTracking();
    }
    
    return () => {
      stopTracking();
    };
  }, [isLocationActive, startTracking, stopTracking]);
  
  return {
    isWatching,
    lastPosition,
    error,
    startTracking,
    stopTracking
  };
};

export default useLocationTracking;
