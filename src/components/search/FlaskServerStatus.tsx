
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { Server, WifiOff, RefreshCw } from 'lucide-react';
import { API_BASE_URL, MAPBOX_TOKEN, isApiKeyValid } from '@/config/environment';
import { Button } from '@/components/ui/button';

interface FlaskServerStatusProps {
  className?: string;
}

const FlaskServerStatus: React.FC<FlaskServerStatusProps> = ({ className = '' }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    flask: false,
    mapbox: isApiKeyValid(MAPBOX_TOKEN)
  });

  const checkConnection = async () => {
    setChecking(true);
    try {
      // Check Flask server connection
      const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 3000 });
      setIsConnected(true);
      setApiStatus(prev => ({ ...prev, flask: true }));
      
      // If Flask server has Mapbox token info, update status
      if (response.data && response.data.mapbox_token_available !== undefined) {
        setApiStatus(prev => ({ ...prev, mapbox: response.data.mapbox_token_available }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to connect to Flask server:', error);
      setIsConnected(false);
      setApiStatus(prev => ({ ...prev, flask: false }));
      return null;
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every minute
    const interval = setInterval(checkConnection, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleManualCheck = async () => {
    const result = await checkConnection();
    if (isConnected) {
      toast.success('Serveur Flask connecté !');
      if (result && result.mapbox_token_available) {
        toast.success('Token Mapbox disponible sur le serveur');
      } else {
        toast.warning('Token Mapbox non disponible sur le serveur');
        
        // Check if token is available in the frontend
        if (isApiKeyValid(MAPBOX_TOKEN)) {
          toast.success('Token Mapbox disponible dans le frontend');
        } else {
          toast.error('Token Mapbox manquant dans le frontend. Vérifiez votre fichier .env');
        }
      }
    } else {
      toast.error('Impossible de se connecter au serveur Flask');
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Button 
        variant="ghost" 
        size="sm"
        className="flex items-center gap-2 px-2"
        onClick={handleManualCheck}
        title={isConnected ? 'Serveur Flask connecté' : 'Serveur Flask non connecté'}
      >
        {checking ? (
          <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
        ) : isConnected ? (
          <Server className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
        <span className="text-xs hidden md:inline-block">
          {isConnected ? 'Flask connecté' : 'Flask non connecté'}
        </span>
        
        {/* Added indicator for Mapbox token status */}
        <div 
          className={`h-2 w-2 rounded-full ml-1 ${apiStatus.mapbox ? 'bg-green-500' : 'bg-red-500'}`}
          title={apiStatus.mapbox ? 'Token Mapbox disponible' : 'Token Mapbox non disponible'}
        />
      </Button>
    </div>
  );
};

export default FlaskServerStatus;
