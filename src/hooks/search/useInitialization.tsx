
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/config/environment';
import { MAPBOX_TOKEN } from '@/config/environment';

export const useInitialization = (
  handleLocationClick: () => void,
  setShowNoMapboxTokenWarning: (show: boolean) => void
) => {
  // Check Flask server connection on component mount
  useEffect(() => {
    const checkFlaskServer = async () => {
      try {
        await axios.get(`${API_BASE_URL}/search`, { 
          params: { query: 'test', mode: 'driving', lat: 48.8566, lon: 2.3522, limit: 1 },
          timeout: 2000
        });
        console.log('Flask server is running');
      } catch (error) {
        console.warn('Flask server is not running:', error);
        toast.warning('Le serveur Flask n\'est pas démarré. Certaines fonctionnalités peuvent ne pas fonctionner.');
      }
    };
    
    // Check if Mapbox token is available
    setShowNoMapboxTokenWarning(!MAPBOX_TOKEN);
    
    checkFlaskServer();
    handleLocationClick();
  }, [handleLocationClick, setShowNoMapboxTokenWarning]);
};

export default useInitialization;
