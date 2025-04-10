
import React, { useState, useEffect } from 'react';

interface GeolocationContextType {
  userLocation: [number, number];
  isLocationActive: boolean;
}

interface GeolocationProviderProps {
  children: (context: GeolocationContextType) => React.ReactNode;
}

const GeolocationProvider: React.FC<GeolocationProviderProps> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]);
  const [isLocationActive, setIsLocationActive] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          setIsLocationActive(true);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  return (
    <>
      {children({
        userLocation,
        isLocationActive
      })}
    </>
  );
};

export default GeolocationProvider;
