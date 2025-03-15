
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '@/config/environment';

interface UseGeolocationProps {
  setLoading: (loading: boolean) => void;
  setIsLocationActive: (active: boolean) => void;
  setUserLocation: (location: [number, number]) => void;
}

export const useGeolocation = ({
  setLoading,
  setIsLocationActive,
  setUserLocation,
}: UseGeolocationProps) => {
  const [watchId, setWatchId] = useState<number | null>(null);

  // Activer la géolocalisation
  const activateGeolocation = () => {
    if (watchId) {
      // Si déjà actif, désactiver
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsLocationActive(false);
      toast.info('Suivi de position désactivé');
      return;
    }

    setIsLocationActive(true);
    setLoading(true);
    
    // Vérifier d'abord si la géolocalisation est disponible
    if (!navigator.geolocation) {
      setLoading(false);
      setIsLocationActive(false);
      toast.error('La géolocalisation n\'est pas prise en charge par votre navigateur');
      return;
    }
    
    // Utiliser la géolocalisation du navigateur en mode watch
    startWatchingPosition();
  };
  
  // Démarrer le suivi de position
  const startWatchingPosition = () => {
    toast.info('Autorisation de géolocalisation requise');
    
    const id = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation([position.coords.longitude, position.coords.latitude]);
        console.log("Position mise à jour:", position.coords);
        setLoading(false);
        
        // Notification seulement la première fois
        if (!watchId) {
          toast.success('Position trouvée et suivi actif');
        }
        
        setWatchId(id);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLoading(false);
        setIsLocationActive(false);
        
        // Show appropriate error message based on error code
        switch(error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Accès à la localisation refusé');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Position non disponible');
            break;
          case error.TIMEOUT:
            toast.error('Délai de localisation dépassé');
            break;
          default:
            toast.error('Erreur de localisation');
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000, // 30 secondes de cache max
        timeout: 27000
      }
    );
    
    setWatchId(id);
  };
  
  // Obtenir une seule fois la position
  const getOneTimePosition = () => {
    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.longitude, position.coords.latitude]);
        console.log("Position obtenue:", position.coords);
        setLoading(false);
        setIsLocationActive(true);
        toast.success('Position trouvée');
      },
      (error) => {
        console.error('Error getting location:', error);
        setLoading(false);
        setIsLocationActive(false);
        toast.error('Erreur de localisation');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };
  
  // Nettoyage lors du démontage du composant
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return { 
    activateGeolocation, 
    getOneTimePosition,
    isWatching: watchId !== null
  };
};

export default useGeolocation;
