
import { useState } from 'react';
import { toast } from 'sonner';
import { useLocationTracking } from './useLocationTracking';

interface UseGeolocationProps {
  setLoading: (loading: boolean) => void;
  setIsLocationActive: (active: boolean) => void;
  setUserLocation: (location: [number, number]) => void;
  onLocationUpdate?: (location: [number, number]) => void;
}

export const useGeolocation = ({
  setLoading,
  setIsLocationActive,
  setUserLocation,
  onLocationUpdate
}: UseGeolocationProps) => {
  const [isWatching, setIsWatching] = useState(false);
  
  // Utiliser le hook de suivi pour gérer les mises à jour en temps réel
  const locationTracking = useLocationTracking({
    isLocationActive: isWatching,
    setUserLocation,
    onLocationUpdate
  });
  
  /**
   * Fonction pour activer la géolocalisation simple (position unique)
   */
  const activateGeolocation = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }
    
    setLoading(true);
    console.log("Demande de géolocalisation...");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        console.log(`Position obtenue: [${longitude}, ${latitude}]`);
        
        setUserLocation([longitude, latitude]);
        setIsLocationActive(true);
        setLoading(false);
        
        toast.success("Position déterminée avec succès");
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
        setLoading(false);
        
        let message = "Erreur lors de la géolocalisation";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Vous avez refusé l'accès à votre position";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Votre position n'est pas disponible";
            break;
          case error.TIMEOUT:
            message = "La demande de position a expiré";
            break;
        }
        
        toast.error(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };
  
  /**
   * Fonction pour activer le suivi de position en temps réel
   */
  const activateTracking = () => {
    setIsWatching(true);
    setIsLocationActive(true);
    toast.success("Suivi de position activé");
  };
  
  /**
   * Fonction pour désactiver le suivi de position
   */
  const deactivateTracking = () => {
    setIsWatching(false);
    locationTracking.stopTracking();
    toast.info("Suivi de position désactivé");
  };
  
  /**
   * Fonction pour basculer entre le suivi actif et inactif
   */
  const toggleTracking = () => {
    if (isWatching) {
      deactivateTracking();
    } else {
      activateTracking();
    }
  };
  
  return {
    activateGeolocation,
    activateTracking,
    deactivateTracking,
    toggleTracking,
    isWatching,
    ...locationTracking
  };
};

export default useGeolocation;
