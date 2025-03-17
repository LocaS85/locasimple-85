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

// This component is not being rendered anymore, but we're keeping the file
// for compatibility with other components that might still import it
export const LocationButton: React.FC<LocationButtonProps> = ({ 
  loading, 
  isLocationActive, 
  isWatching = false,
  onClick,
  onToggleTracking
}) => {
  return null; // Return null to render nothing
};

export default LocationButton;
