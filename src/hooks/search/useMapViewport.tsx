
import { useEffect } from 'react';

export const useMapViewport = (
  isLocationActive: boolean,
  userLocation: [number, number],
  setViewport: (viewport: any) => void
) => {
  // Update viewport when user location changes and is active
  useEffect(() => {
    if (isLocationActive && userLocation) {
      setViewport({
        latitude: userLocation[1],
        longitude: userLocation[0],
        zoom: 14
      });
    }
  }, [isLocationActive, userLocation, setViewport]);

  return {};
};

export default useMapViewport;
