
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FEATURES } from '@/config/environment';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FlaskServerStatusProps {
  className?: string;
}

const FlaskServerStatus: React.FC<FlaskServerStatusProps> = ({ className = '' }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!FEATURES.USE_FLASK_SERVER) return;

    const checkServer = async () => {
      if (isChecking) return;
      
      setIsChecking(true);
      try {
        const response = await fetch('/api/health', { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          setIsConnected(true);
          console.log('Flask server connected successfully');
        } else {
          setIsConnected(false);
          toast.error("Serveur Flask non accessible", {
            description: "Certaines fonctionnalités peuvent être limitées",
          });
          console.warn('Flask server health check failed');
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du serveur Flask:", error);
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkServer();
    
    // Check server periodically
    const interval = setInterval(checkServer, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, [isChecking]);

  if (isConnected === null || !FEATURES.USE_FLASK_SERVER) return null;

  return (
    <div className={`flask-server-status flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium shadow-sm ${
      isConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    } ${className}`}>
      {isConnected ? (
        <>
          <CheckCircle className="h-3.5 w-3.5" />
          <span>Serveur connecté</span>
        </>
      ) : (
        <>
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Serveur non connecté</span>
        </>
      )}
    </div>
  );
};

export default FlaskServerStatus;
