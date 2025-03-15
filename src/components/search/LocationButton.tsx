
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MapPin, Loader2, Navigation } from 'lucide-react';

interface LocationButtonProps {
  loading: boolean;
  isLocationActive: boolean;
  isWatching?: boolean;
  onClick: () => void;
}

export const LocationButton: React.FC<LocationButtonProps> = ({ 
  loading, 
  isLocationActive, 
  isWatching = false,
  onClick 
}) => {
  return (
    <div className="absolute bottom-24 right-4 z-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onClick}
              className={`rounded-full h-14 w-14 shadow-lg transition-all hover:scale-105 ${
                isLocationActive 
                  ? (isWatching 
                      ? 'bg-green-500 text-white border-white border-2' 
                      : 'bg-primary text-white border-white border-2')
                  : 'bg-white text-primary border border-gray-200'
              }`}
              disabled={loading}
              aria-label="Ma position"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : isWatching ? (
                <Navigation className="h-6 w-6 animate-pulse" />
              ) : (
                <MapPin className="h-6 w-6" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {loading 
              ? 'Localisation en cours...' 
              : isWatching 
                ? 'Suivi de position actif (cliquer pour désactiver)' 
                : isLocationActive 
                  ? 'Position définie (cliquer pour activer le suivi)' 
                  : 'Activer ma position'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default LocationButton;
