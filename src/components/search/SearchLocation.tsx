import React from 'react';
import { toast } from 'sonner';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAddressSearch } from '@/hooks/useAddressSearch';

interface SearchLocationProps {
  isLocationActive: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setIsLocationActive: (active: boolean) => void;
  setUserLocation: (location: [number, number]) => void;
}

export const SearchLocation: React.FC<SearchLocationProps> = ({
  isLocationActive,
  loading,
  setLoading,
  setIsLocationActive,
  setUserLocation,
}) => {
  return (
    <React.Fragment>
      {/* This is a utility component that only provides functionality */}
    </React.Fragment>
  );
};

// Export the handler separately
export const useSearchLocation = (
  isLocationActive: boolean, 
  loading: boolean, 
  setLoading: (loading: boolean) => void,
  setIsLocationActive: (active: boolean) => void,
  setUserLocation: (location: [number, number]) => void
) => {
  const { activateGeolocation } = useGeolocation({
    setLoading,
    setIsLocationActive,
    setUserLocation
  });
  
  const { searchAddress } = useAddressSearch({
    setLoading,
    setIsLocationActive,
    setUserLocation
  });

  const handleLocationClick = () => {
    // If location is already active, toggle it off
    if (isLocationActive) {
      setIsLocationActive(false);
      return;
    }
    
    // Check for geolocation permissions first
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'denied') {
          toast.error('Accès à la géolocalisation refusé. Veuillez l\'activer dans vos paramètres de navigateur.');
          return;
        }
        
        // Proceed with geolocation
        activateGeolocation();
      }).catch(error => {
        console.error('Error checking geolocation permission:', error);
        // Try geolocation anyway in case permissions API isn't available
        activateGeolocation();
      });
    } else {
      // Permissions API not available, proceed with geolocation directly
      activateGeolocation();
    }
  };

  return { handleLocationClick, searchAddress };
};

export default SearchLocation;
