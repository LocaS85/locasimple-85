
import React from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
  const handleLocationClick = () => {
    setIsLocationActive(!isLocationActive);
    
    if (!isLocationActive) {
      if (navigator.geolocation) {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation([position.coords.longitude, position.coords.latitude]);
            console.log("Location updated:", position.coords);
            setLoading(false);
          },
          (error) => {
            console.error('Error getting location:', error);
            setLoading(false);
            setIsLocationActive(false);
            toast.error('Unable to get your location');
          }
        );
      }
    }
  };

  return { handleLocationClick };
};

export default SearchLocation;
