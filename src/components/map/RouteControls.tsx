
import React from 'react';
import TransportModeFilter from '@/components/search/TransportModeFilter';

interface RouteControlsProps {
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
}

const RouteControls: React.FC<RouteControlsProps> = ({
  transportMode,
  onTransportModeChange
}) => {
  return (
    <TransportModeFilter
      transportMode={transportMode}
      onTransportModeChange={onTransportModeChange}
    />
  );
};

export default RouteControls;
