
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
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadMaps = async () => {
      try {
        // Initialize Mapbox
        if (MAPBOX_TOKEN) {
          try {
            mapboxgl.accessToken = MAPBOX_TOKEN;
            console.log('Mapbox access token configured successfully');
            setLoaded(true);
          } catch (err) {
            const errorMessage = `Failed to initialize Mapbox: ${(err as Error).message}`;
            console.error(errorMessage);
            setError(errorMessage);
            toast.error('Erreur lors de l\'initialisation de Mapbox');
            // Set loaded to true anyway to not block the UI
            setLoaded(true);
          }
        } else {
          const errorMessage = 'Mapbox token is missing. Please add it to your .env file.';
          console.error(errorMessage);
          setError(errorMessage);
          toast.error('Token Mapbox manquant. Les fonctionnalités de carte seront limitées.');
          // Set loaded to true anyway to not block the UI
          setLoaded(true);
        }
      } catch (error) {
        const errorMessage = `Error loading map APIs: ${(error as Error).message}`;
        console.error(errorMessage);
        setError(errorMessage);
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
  
  if (error && !MAPBOX_TOKEN) {
    // Show a warning but continue rendering the app
    return (
      <>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Attention: {error}
              </p>
              <p className="text-xs mt-1 text-yellow-600">
                Certaines fonctionnalités de carte peuvent ne pas fonctionner correctement.
              </p>
            </div>
          </div>
        </div>
        {children}
      </>
    );
  }
  
  return <>{children}</>;
};

export default MapLoader;
