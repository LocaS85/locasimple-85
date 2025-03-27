
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
  
  // Utilisons directement la couleur de transportMode au lieu de l'interpolation
  const backgroundColor = isActive ? modeOption.color : 'white';
  const textColor = isActive ? 'white' : 'gray-700';
  const borderColor = isActive ? modeOption.color : 'gray-200';
  
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className={`flex items-center justify-center p-2 h-10 ${className}`}
      onClick={() => onClick(mode)}
      style={{
        backgroundColor: isActive ? modeOption.color : 'white',
        color: isActive ? 'white' : '#374151',
        borderColor: isActive ? modeOption.color : '#e5e7eb',
        borderWidth: '1px'
      }}
    >
      <div className="flex items-center space-x-2">
        {modeOption.icon}
        <span className="text-xs font-medium">{modeOption.name}</span>
      </div>
    </Button>
  );
};

export default TransportModeButton;
