
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
        "flex-shrink-0 whitespace-nowrap rounded-full px-3 py-1 h-9 flex items-center gap-2 text-sm transition-all hover:scale-105",
        isSelected ? "text-white" : "bg-white text-black hover:text-white"
      )}
      onClick={onClick}
      style={{
        backgroundColor: isSelected ? mode.color : 'white',
        borderColor: mode.color,
        color: isSelected ? 'white' : 'black',
      }}
      onMouseOver={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = `${mode.color}20`;
          e.currentTarget.style.color = mode.color;
        }
      }}
      onMouseOut={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'white';
          e.currentTarget.style.color = 'black';
        }
      }}
    >
      {mode.icon}
      <span>{mode.name}</span>
    </Button>
  );
};
