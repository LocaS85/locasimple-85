
import { useAddressSearch } from '@/hooks/useAddressSearch';
import { useGeolocation } from '@/hooks/useGeolocation';

export const useSearchLocation = (
  isLocationActive: boolean,
  loading: boolean,
  setLoading: (loading: boolean) => void,
  setIsLocationActive: (active: boolean) => void,
  setUserLocation: (location: [number, number]) => void
) => {
  // Initialiser les hooks
  const { searchAddress } = useAddressSearch({
    setLoading,
    setIsLocationActive,
    setUserLocation
  });
  
  const { activateGeolocation } = useGeolocation({
    setLoading,
    setIsLocationActive,
    setUserLocation
  });

  // Gérer le clic sur le bouton de localisation
  const handleLocationClick = () => {
    if (loading) return;
    
    if (!isLocationActive) {
      activateGeolocation();
    } else {
      setIsLocationActive(false);
    }
  };

  return {
    handleLocationClick,
    searchAddress
  };
};

export default useSearchLocation;
