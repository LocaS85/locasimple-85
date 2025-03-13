
import { useState } from 'react';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

export const useSearchLocation = (
  isLocationActive: boolean,
  isLoading: boolean,
  setLoading: (loading: boolean) => void,
  setIsLocationActive: (active: boolean) => void,
  setUserLocation: (location: [number, number]) => void
) => {
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleLocationClick = () => {
    if (isLoading) return;
    
    if (isLocationActive) {
      setIsLocationActive(false);
      toast.info('Localisation désactivée');
      return;
    }
    
    setLoading(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          setIsLocationActive(true);
          setLoading(false);
          toast.success('Localisation activée');
          console.log(`Location set to [${longitude}, ${latitude}]`);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError(error.message);
          setLoading(false);
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              toast.error('Vous avez refusé l\'accès à votre position');
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
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLoading(false);
      setLocationError('Géolocalisation non supportée par votre navigateur');
      toast.error('Géolocalisation non supportée');
    }
  };
  
  const searchAddress = async (address: string): Promise<void> => {
    if (!address.trim() || !MAPBOX_TOKEN) {
      return;
    }
    
    setLoading(true);
    console.log(`Searching for address: "${address}"`);
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&limit=1&language=fr`
      );
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        setUserLocation([longitude, latitude]);
        setIsLocationActive(true);
        toast.success(`Position définie sur: ${data.features[0].place_name}`);
        console.log(`Address found: ${data.features[0].place_name} at [${longitude}, ${latitude}]`);
      } else {
        toast.error(`Adresse "${address}" introuvable`);
      }
    } catch (error) {
      console.error('Erreur de recherche d\'adresse:', error);
      toast.error('Erreur lors de la recherche d\'adresse');
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLocationClick,
    searchAddress,
    locationError
  };
};

export default useSearchLocation;
