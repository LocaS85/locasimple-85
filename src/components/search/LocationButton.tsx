
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Navigation } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isLocationActive ? "default" : "outline"}
          size="icon"
          className={`h-10 w-10 ${isLocationActive ? 'bg-blue-500 text-white' : 'bg-white'}`}
          onClick={onClick}
          disabled={loading}
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Navigation className={`h-4 w-4 ${isWatching ? 'animate-pulse text-blue-600' : ''}`} />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('useMyLocation')}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default LocationButton;
