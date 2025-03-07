
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
        "flex-shrink-0 whitespace-nowrap rounded-full px-2 py-0 h-8 flex items-center gap-1 text-xs transition-transform hover:scale-105",
        isSelected 
          ? `bg-[${mode.color}] text-white hover:bg-[${mode.color}]` 
          : `bg-white text-black hover:bg-[${mode.color}]/10 hover:border-[${mode.color}]`
      )}
      onClick={onClick}
      style={{
        backgroundColor: isSelected ? mode.color : 'white',
        borderColor: isSelected ? mode.color : '#e5e7eb',
        color: isSelected ? 'white' : 'black',
      }}
    >
      {mode.icon}
      <span>{mode.name}</span>
    </Button>
  );
};
