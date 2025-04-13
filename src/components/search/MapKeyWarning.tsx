
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface MapKeyWarningProps {
  onSetMapboxToken?: (token: string) => boolean;
}

const MapKeyWarning: React.FC<MapKeyWarningProps> = ({ 
  onSetMapboxToken = () => false 
}) => {
  const [mapboxToken, setMapboxToken] = useState('');

  const handleSaveToken = () => {
    if (!mapboxToken.trim()) {
      toast.error("Veuillez entrer un token valide");
      return;
    }
    
    const success = onSetMapboxToken(mapboxToken.trim());
    
    if (success) {
      toast.success("Token Mapbox enregistré avec succès");
      // Reload the page to apply the new token
      window.location.reload();
    } else {
      toast.error("Erreur lors de l'enregistrement du token");
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-2">Token Mapbox requis</h3>
        <p className="text-gray-600 mb-4">
          Pour afficher la carte, vous devez fournir un token Mapbox valide. 
          Vous pouvez créer un compte gratuit sur <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Mapbox.com</a> et obtenir un token.
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="mapbox-token" className="text-sm font-medium">
              Token Mapbox
            </label>
            <Input 
              id="mapbox-token" 
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="pk.eyJ1Ijoi..."
              className="w-full"
            />
          </div>
          
          <Button 
            onClick={handleSaveToken}
            className="w-full"
          >
            Enregistrer le token
          </Button>
          
          <div className="text-xs text-gray-500 mt-2">
            Ce token sera stocké uniquement dans votre navigateur et ne sera pas partagé.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapKeyWarning;
