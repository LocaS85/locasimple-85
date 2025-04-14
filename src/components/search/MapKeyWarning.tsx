
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MAPBOX_TOKEN } from '@/config/environment';

interface MapKeyWarningProps {
  onSetMapboxToken?: (token: string) => boolean;
}

const MapKeyWarning = ({ onSetMapboxToken }: MapKeyWarningProps) => {
  const [token, setToken] = useState<string>(MAPBOX_TOKEN || '');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleTokenSubmit = () => {
    setSubmitting(true);
    setError(null);

    try {
      // Attempt to set token
      if (token && token.startsWith('pk.')) {
        // Set the token for the application
        (window as any).mapboxgl.accessToken = token;
        
        // Call the provided callback if available
        if (onSetMapboxToken) {
          const result = onSetMapboxToken(token);
          if (result) {
            setSuccess(true);
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            setError("Impossible d'appliquer le token. Vérifiez qu'il est valide.");
          }
        } else {
          setSuccess(true);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } else {
        setError("Le token Mapbox doit commencer par 'pk.'");
      }
    } catch (err) {
      console.error('Error setting Mapbox token:', err);
      setError("Une erreur s'est produite en configurant le token");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-2">Configuration Mapbox requise</h3>
        
        {!success ? (
          <>
            <p className="text-gray-600 mb-4">
              Pour utiliser les fonctionnalités de carte, un token Mapbox est nécessaire. 
              Le token est déjà préconfiguré, vous pouvez simplement cliquer sur 'Appliquer'.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="mapbox-token" className="block text-sm font-medium text-gray-700 mb-1">
                  Token Mapbox
                </label>
                <Input
                  id="mapbox-token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="pk.eyJ1IjoibG9jYXNpbXBsZS..."
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Token préconfigué: <code className="bg-gray-100 px-1 py-0.5 rounded">pk.eyJ1IjoibG9jYXNpbXBsZS...</code>
                </p>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
                  {error}
                </div>
              )}
              
              <Button 
                onClick={handleTokenSubmit} 
                disabled={submitting || !token}
                className="w-full"
              >
                {submitting ? 'Application...' : 'Appliquer le token'}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Token appliqué avec succès</h4>
            <p className="text-gray-600">
              L'application va se recharger automatiquement...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapKeyWarning;
