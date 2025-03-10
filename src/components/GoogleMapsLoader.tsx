
import React, { useState, useEffect } from 'react';
import { initGoogleMaps, cleanupGoogleMaps } from '@/utils/loadGoogleMaps';

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const loadMaps = async () => {
      try {
        await initGoogleMaps();
        setLoaded(true);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };
    
    loadMaps();
    
    // Cleanup on unmount
    return () => {
      cleanupGoogleMaps();
    };
  }, []);
  
  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 font-medium text-gray-700">Chargement de la carte...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default GoogleMapsLoader;
