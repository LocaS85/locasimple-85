
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useLocationHandling = (
  setLoading: (loading: boolean) => void,
  setUserLocation: (location: [number, number]) => void,
  setViewport: (viewport: any) => void,
  setIsLocationActive: (active: boolean) => void
) => {
  const handleLocationClick = useCallback(() => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
        setViewport({
          latitude,
          longitude,
          zoom: 14
        });
        setIsLocationActive(true);
        setLoading(false);
        toast.success('Position actuelle détectée');
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
        toast.error('Impossible de récupérer votre position');
        setLoading(false);
        setIsLocationActive(false);
      }
    );
  }, [setLoading, setUserLocation, setViewport, setIsLocationActive]);

  return {
    handleLocationClick
  };
};

export default useLocationHandling;
