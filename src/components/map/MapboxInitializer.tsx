
import { useEffect } from 'react';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

interface MapboxInitializerProps {
  onInitialized?: (success: boolean) => void;
}

const MapboxInitializer = ({ onInitialized }: MapboxInitializerProps) => {
  useEffect(() => {
    // Try to initialize Mapbox global access token
    try {
      if (typeof window !== 'undefined' && window.mapboxgl) {
        if (MAPBOX_TOKEN && MAPBOX_TOKEN.length > 0) {
          window.mapboxgl.accessToken = MAPBOX_TOKEN;
          console.log('Mapbox initialized with token:', MAPBOX_TOKEN.substring(0, 8) + '...');
          
          // Call the callback if provided
          if (onInitialized) {
            onInitialized(true);
          }
        } else {
          console.warn('Mapbox token is empty or not defined');
          if (onInitialized) {
            onInitialized(false);
          }
        }
      } else if (typeof window !== 'undefined' && !window.mapboxgl) {
        console.warn('Mapbox GL JS not loaded yet');
        
        // Set a global variable to use later when Mapbox is loaded
        if (MAPBOX_TOKEN && MAPBOX_TOKEN.length > 0) {
          window.MAPBOX_TOKEN_READY = MAPBOX_TOKEN;
        }
        
        // Call the callback with false if Mapbox isn't available yet
        if (onInitialized) {
          onInitialized(false);
        }
      }
    } catch (error) {
      console.error('Error initializing Mapbox:', error);
      toast.error('Erreur d\'initialisation de Mapbox');
      
      // Call the callback with false on error
      if (onInitialized) {
        onInitialized(false);
      }
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [onInitialized]);

  // This is a utility component, not a visual one
  return null;
};

export default MapboxInitializer;
