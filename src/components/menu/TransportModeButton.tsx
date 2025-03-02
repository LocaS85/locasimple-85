
import React from 'react';
import { Button } from '@/components/ui/button';
import type { TransportMode } from '@/data/transportModes';

interface TransportModeButtonProps {
  mode: TransportMode;
  isSelected: boolean;
  onClick: () => void;
}

export const TransportModeButton: React.FC<TransportModeButtonProps> = ({
  mode,
  isSelected,
  onClick
}) => {
  return (
    <Button 
      variant={isSelected ? 'default' : 'outline'} 
      className="flex-shrink-0"
      onClick={onClick}
    >
      {mode.icon}
      <span>{mode.name}</span>
    </Button>
  );
};
