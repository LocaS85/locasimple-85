
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
    
    // Try to use Mapbox geolocate control first for better accuracy
    if (mapboxgl.supported() && MAPBOX_TOKEN) {
      try {
        // Create a temporary map container for the geolocate control
        const tempContainer = document.createElement('div');
        tempContainer.style.display = 'none';
        document.body.appendChild(tempContainer);
        
        const tempMap = new mapboxgl.Map({
          container: tempContainer,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [0, 0],
          zoom: 1,
          accessToken: MAPBOX_TOKEN
        });
        
        const geolocate = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: false
        });
        
        tempMap.addControl(geolocate);
        
        tempMap.on('load', () => {
          toast.info('Recherche de votre position...');
          geolocate.trigger();
        });
        
        // Listen for position updates
        geolocate.on('geolocate', (position: GeolocationPosition) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          console.log("Mapbox location updated:", position.coords);
          setLoading(false);
          toast.success('Position trouvée');
          
          // Clean up
          tempMap.remove();
          document.body.removeChild(tempContainer);
        });
        
        // Handle errors
        geolocate.on('error', (error: any) => {
          console.error('Mapbox geolocation error:', error);
          // Fall back to browser geolocation
          useBrowserGeolocation();
        });
      } catch (error) {
        console.error('Error with Mapbox geolocation:', error);
        // Fall back to browser geolocation
        useBrowserGeolocation();
      }
    } else {
      // Fall back to browser geolocation
      useBrowserGeolocation();
    }
  };
  
  const useBrowserGeolocation = () => {
    if (navigator.geolocation) {
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
    } else {
      setLoading(false);
      setIsLocationActive(false);
      toast.error('La géolocalisation n\'est pas prise en charge par votre navigateur');
    }
  };

  return { activateGeolocation, useBrowserGeolocation };
};

export default useGeolocation;
