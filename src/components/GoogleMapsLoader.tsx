
import React, { useState, useEffect } from 'react';
import { initGoogleMaps, cleanupGoogleMaps } from '@/utils/loadGoogleMaps';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const loadMaps = async () => {
      try {
        // Initialisation de Google Maps
        await initGoogleMaps();
        
        // Initialisation de Mapbox
        if (MAPBOX_TOKEN) {
          mapboxgl.accessToken = MAPBOX_TOKEN;
          console.log('Mapbox access token configuré');
        } else {
          console.error('Mapbox token manquant');
          toast.error('Token Mapbox manquant. La fonctionnalité de carte peut être limitée.');
        }
        
        setLoaded(true);
      } catch (error) {
        console.error('Erreur de chargement des APIs cartographiques:', error);
        toast.error('Erreur de chargement des APIs cartographiques');
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
          <p className="mt-4 font-medium text-gray-700">Chargement des cartes...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default GoogleMapsLoader;
