
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Navigation } from 'lucide-react';

interface LocationButtonProps {
  loading: boolean;
  isLocationActive: boolean;
  isWatching?: boolean;
  onClick: () => void;
  onToggleTracking?: () => void;
}

export const LocationButton: React.FC<LocationButtonProps> = ({ 
  loading, 
  isLocationActive, 
  isWatching = false,
  onClick,
  onToggleTracking
}) => {
  const handleClick = () => {
    if (isLocationActive && onToggleTracking) {
      // Si la localisation est déjà active, basculer entre le suivi et la position fixe
      onToggleTracking();
    } else {
      // Sinon, activer la localisation
      onClick();
    }
  };
  
  return (
    <div className="absolute bottom-32 right-4 z-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleClick}
              className={`rounded-full h-14 w-14 shadow-lg transition-all hover:scale-105 ${
                isWatching 
                  ? 'bg-green-500 text-white border-white border-2' 
                  : 'bg-white text-primary border border-gray-200'
              }`}
              disabled={loading}
              aria-label="Ma position"
            >
              <Navigation className={`h-6 w-6 ${isWatching ? 'animate-pulse' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {loading 
              ? 'Localisation en cours...' 
              : isWatching 
                ? 'Suivi de position actif (cliquer pour désactiver)' 
                : 'Remonter à ma position'
            }
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default LocationButton;
