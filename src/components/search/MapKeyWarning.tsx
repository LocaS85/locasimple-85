
import React, { useState } from 'react';
import { toast } from 'sonner';
import { X, AlertTriangle, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isApiKeyValid } from '@/config/environment';

interface MapKeyWarningProps {
  show: boolean;
  onClose: () => void;
  onSetKey?: (key: string) => void;
}

const MapKeyWarning: React.FC<MapKeyWarningProps> = ({ 
  show, 
  onClose,
  onSetKey
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const handleSaveKey = () => {
    // Basic validation
    if (isApiKeyValid(apiKey)) {
      if (onSetKey) {
        onSetKey(apiKey);
        toast.success('Clé API enregistrée temporairement');
      } else {
        toast.warning('Le stockage temporaire de clé API n\'est pas activé');
      }
      
      const envInstruction = `VITE_MAPBOX_TOKEN=${apiKey}`;
      console.info('Pour utiliser cette clé de façon permanente, ajoutez la ligne suivante dans votre fichier .env:', envInstruction);
      
      handleCloseDialog();
      onClose();
    } else {
      toast.error('Format de clé API invalide');
    }
  };

  const handleGetMapboxAccount = () => {
    window.open('https://account.mapbox.com/auth/signup/', '_blank');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold">Token Mapbox manquant</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-4 space-y-4">
          <p className="text-sm">
            Pour utiliser les fonctionnalités de carte, vous devez avoir une clé API Mapbox valide.
          </p>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Options:</p>
            <ul className="text-sm list-disc pl-5 space-y-2">
              <li>Créez un fichier <code>.env</code> à la racine du projet avec la variable <code>VITE_MAPBOX_TOKEN=votre_token_mapbox</code></li>
              <li>Créez un compte Mapbox et obtenez une clé gratuite</li>
              <li>Entrez temporairement une clé API ci-dessous (sera perdue au rechargement de la page)</li>
            </ul>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleGetMapboxAccount}>
              Créer un compte Mapbox
            </Button>
            <Button onClick={handleOpenDialog} className="gap-1">
              <Key className="h-4 w-4" />
              Entrer une clé API
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Entrez votre clé API Mapbox</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="api-key">Clé API (commence par pk.ey...)</Label>
            <Input
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="pk.eyJ1IjoidXNlcm5hbWUiLCJhIjoiY2...key"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-2">
              Cette clé sera stockée temporairement en mémoire. Pour une utilisation permanente, 
              ajoutez-la dans un fichier .env à la racine du projet.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Annuler</Button>
            <Button onClick={handleSaveKey}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapKeyWarning;
