
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { Server, WifiOff } from 'lucide-react';
import { API_BASE_URL } from '@/config/environment';
import { Button } from '@/components/ui/button';

interface FlaskServerStatusProps {
  className?: string;
}

const FlaskServerStatus: React.FC<FlaskServerStatusProps> = ({ className = '' }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkConnection = async () => {
    setChecking(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 3000 });
      setIsConnected(true);
      return response.data;
    } catch (error) {
      console.error('Failed to connect to Flask server:', error);
      setIsConnected(false);
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
          <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-blue-500 animate-spin"></div>
        ) : isConnected ? (
          <Server className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
        <span className="text-xs hidden md:inline-block">
          {isConnected ? 'Flask connecté' : 'Flask non connecté'}
        </span>
      </Button>
    </div>
  );
};

export default FlaskServerStatus;
