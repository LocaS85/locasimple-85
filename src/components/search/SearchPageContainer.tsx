
import React, { useState } from 'react';
import { toast } from 'sonner';
import SearchPage from './SearchPage';
import { MAPBOX_TOKEN } from '@/config/environment';
import { initializeMapbox } from '@/utils/mapUtils';

// This container handles the initialization and common state
const SearchPageContainer: React.FC = () => {
  const [mapboxTokenSet, setMapboxTokenSet] = useState(!!MAPBOX_TOKEN);

  // Initialize Mapbox when component mounts
  React.useEffect(() => {
    const initMap = async () => {
      try {
        await initializeMapbox();
        setMapboxTokenSet(true);
      } catch (error) {
        console.error('Error initializing Mapbox:', error);
        setMapboxTokenSet(false);
        toast.error('Erreur d\'initialisation de Mapbox. Veuillez vérifier votre token.');
      }
    };
    
    initMap();
  }, []);

  const handleSetMapboxToken = (token: string) => {
    try {
      // Temporary set token for current session
      (window as any).TEMPORARY_MAPBOX_TOKEN = token;
      setMapboxTokenSet(true);
      toast.success('Token Mapbox configuré temporairement');
      return true;
    } catch (error) {
      console.error('Error setting Mapbox token:', error);
      toast.error('Erreur lors de la configuration du token Mapbox');
      return false;
    }
  };

  return (
    <SearchPage 
      mapboxTokenSet={mapboxTokenSet} 
      onSetMapboxToken={handleSetMapboxToken} 
    />
  );
};

export default SearchPageContainer;
