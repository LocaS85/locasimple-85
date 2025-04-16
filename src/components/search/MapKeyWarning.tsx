
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const MapKeyWarning = () => {
  const [mapboxToken, setMapboxToken] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      try {
        // Set the temporary token
        (window as any).TEMPORARY_MAPBOX_TOKEN = mapboxToken.trim();
        toast.success('Token Mapbox temporairement défini. Veuillez actualiser la page.');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        toast.error('Erreur lors de la définition du token');
      }
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <div className="flex items-center mb-4 text-amber-500">
          <AlertTriangle className="mr-2" />
          <h2 className="text-xl font-semibold">Token Mapbox manquant</h2>
        </div>
        
        <p className="mb-4 text-gray-700">
          Pour utiliser les fonctionnalités cartographiques, vous devez configurer un token Mapbox.
        </p>
        
        {!isInputVisible ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Vous pouvez obtenir un token gratuit sur <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">mapbox.com</a> en créant un compte.
            </p>
            
            <button
              onClick={() => setIsInputVisible(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
              Entrer un token temporaire
            </button>
          </div>
        ) : (
          <form onSubmit={handleTokenSubmit}>
            <div className="mb-4">
              <label htmlFor="mapbox-token" className="block text-sm font-medium text-gray-700 mb-1">
                Token Mapbox
              </label>
              <input
                id="mapbox-token"
                type="text"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="pk.eyJ1Ijoi..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Note: Ce token sera stocké uniquement dans votre navigateur.
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1"
              >
                Appliquer
              </button>
              <button
                type="button"
                onClick={() => setIsInputVisible(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MapKeyWarning;
