
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MapKeyWarningSectionProps {
  showNoMapboxTokenWarning: boolean;
  setTemporaryApiKey: (key: string) => void;
}

const MapKeyWarningSection: React.FC<MapKeyWarningSectionProps> = ({
  showNoMapboxTokenWarning,
  setTemporaryApiKey
}) => {
  const [apiKey, setApiKey] = React.useState('');

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setTemporaryApiKey(apiKey.trim());
      return true;
    }
    return false;
  };

  if (!showNoMapboxTokenWarning) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Clé API Mapbox manquante</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          Pour utiliser les fonctionnalités de carte, vous devez fournir une clé API Mapbox.
        </p>
        <div className="flex gap-2 mt-2">
          <Input 
            placeholder="Entrez votre clé API Mapbox" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleApiKeySubmit}>
            Appliquer
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default MapKeyWarningSection;
