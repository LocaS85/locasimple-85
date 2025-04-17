
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FEATURES } from '@/config/environment';

interface FlaskServerStatusProps {
  className?: string;
}

const FlaskServerStatus: React.FC<FlaskServerStatusProps> = ({ className = '' }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    if (!FEATURES.USE_FLASK_SERVER) return;

    const checkServer = async () => {
      try {
        const response = await fetch('/api/health', { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          setIsConnected(true);
        } else {
          setIsConnected(false);
          toast.error("Serveur Flask non accessible", {
            description: "Certaines fonctionnalités peuvent être limitées",
          });
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du serveur Flask:", error);
        setIsConnected(false);
      }
    };

    checkServer();
    
    // Check server periodically
    const interval = setInterval(checkServer, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null || !FEATURES.USE_FLASK_SERVER) return null;

  return (
    <div className={`flask-server-status flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm text-xs ${className}`}>
      <div className={`status-indicator w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span>{isConnected ? 'Serveur connecté' : 'Serveur non connecté'}</span>
    </div>
  );
};

export default FlaskServerStatus;
