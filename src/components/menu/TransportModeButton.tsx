
import React from 'react';
import { Button } from '@/components/ui/button';
import type { TransportMode } from '@/data/transportModes';
import { cn } from '@/lib/utils';

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
      variant="outline" 
      className={cn(
        "flex-shrink-0 whitespace-nowrap rounded-full px-1.5 py-0 h-6 flex items-center gap-0.5 text-[10px]",
        isSelected ? "bg-primary text-white" : "bg-white text-black"
      )}
      onClick={onClick}
    >
      {mode.icon}
      <span>{mode.name}</span>
    </Button>
  );
};
