
import React from 'react';
import { Button } from '@/components/ui/button';
import { getTransportModeOption } from '@/data/transportModes';

interface TransportModeButtonProps {
  mode: string;
  isActive: boolean;
  onClick: (mode: string) => void;
  className?: string;
}

const TransportModeButton: React.FC<TransportModeButtonProps> = ({
  mode,
  isActive,
  onClick,
  className = ''
}) => {
  // Get the transport mode option details
  const modeOption = getTransportModeOption(mode);
  
  if (!modeOption) {
    return null;
  }
  
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className={`flex items-center justify-center p-2 h-10 ${className} ${
        isActive 
          ? `bg-[${modeOption.color}] text-white` 
          : 'bg-white text-gray-700 border-gray-200'
      }`}
      onClick={() => onClick(mode)}
    >
      <div className="flex items-center space-x-2">
        {modeOption.icon}
        <span className="text-xs font-medium">{modeOption.name}</span>
      </div>
    </Button>
  );
};

export default TransportModeButton;
