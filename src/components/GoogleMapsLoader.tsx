
import React, { useState, useEffect } from 'react';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';

interface MapLoaderProps {
  children: React.ReactNode;
}

// Renamed to MapLoader since we're primarily using Mapbox
const MapLoader: React.FC<MapLoaderProps> = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const loadMaps = async () => {
      try {
        // Initialisation de Mapbox
        if (MAPBOX_TOKEN) {
          mapboxgl.accessToken = MAPBOX_TOKEN;
          console.log('Mapbox access token configuré');
          setLoaded(true);
        } else {
          console.error('Mapbox token manquant');
          toast.error('Token Mapbox manquant. La fonctionnalité de carte peut être limitée.');
          // Set loaded to true anyway to not block the UI
          setLoaded(true);
        }
      } catch (error) {
        console.error('Erreur de chargement des APIs cartographiques:', error);
        toast.error('Erreur de chargement des APIs cartographiques');
        // Set loaded to true to show the UI with potential fallbacks
        setLoaded(true);
      }
    };
    
    loadMaps();
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

export default MapLoader;
