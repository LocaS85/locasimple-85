
import React from 'react';
import { Button } from '@/components/ui/button';
import { getTransportModeColor, getTransportModeIcon, getTransportModeLabel } from '@/data/transportModes';

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
  // Get the transport mode details
  const color = getTransportModeColor(mode);
  const icon = getTransportModeIcon(mode);
  const label = getTransportModeLabel(mode);
  
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className={`flex items-center justify-center p-2 h-10 ${className}`}
      onClick={() => onClick(mode)}
      style={{
        backgroundColor: isActive ? color : 'white',
        color: isActive ? 'white' : '#374151',
        borderColor: isActive ? color : '#e5e7eb',
        borderWidth: '1px'
      }}
    >
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
    </Button>
  );
};

export default TransportModeButton;
