
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

interface MapKeyWarningProps {
  setTemporaryApiKey: (key: string) => boolean;
}

const MapKeyWarning: React.FC<MapKeyWarningProps> = ({ setTemporaryApiKey }) => {
  const [apiKey, setApiKey] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = () => {
    if (apiKey.trim().length > 0) {
      const success = setTemporaryApiKey(apiKey.trim());
      setSubmitted(true);
      
      if (!success) {
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      }
    }
  };
  
  return (
    <Card className="mb-4 border-red-300 bg-red-50">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <CardTitle className="text-lg text-red-700">Clé Mapbox manquante</CardTitle>
        </div>
        <CardDescription className="text-red-600">
          Une clé API Mapbox valide est requise pour afficher la carte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-4">
          Ajoutez votre clé API Mapbox dans le fichier .env ou saisissez une clé temporaire ci-dessous.
        </p>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Votre clé API Mapbox"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSubmit} disabled={apiKey.trim().length === 0 || submitted}>
            {submitted ? 'Chargement...' : 'Appliquer'}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-gray-500">
        Obtenez une clé API sur <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mapbox.com</a>
      </CardFooter>
    </Card>
  );
};

export default MapKeyWarning;
