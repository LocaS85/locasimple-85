
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
  const activateGeolocation = () => {
    setIsLocationActive(true);
    setLoading(true);
    
    // Vérifier d'abord si la géolocalisation est disponible
    if (!navigator.geolocation) {
      setLoading(false);
      setIsLocationActive(false);
      toast.error('La géolocalisation n\'est pas prise en charge par votre navigateur');
      return;
    }
    
    // Utiliser la géolocalisation du navigateur directement
    useBrowserGeolocation();
  };
  
  const useBrowserGeolocation = () => {
    toast.info('Autorisation de géolocalisation requise');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.longitude, position.coords.latitude]);
        console.log("Browser location updated:", position.coords);
        setLoading(false);
        toast.success('Position trouvée');
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
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return { activateGeolocation, useBrowserGeolocation };
};

export default useGeolocation;
