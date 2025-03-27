
import React from 'react';

interface TransportModeFilterProps {
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
}

export const TransportModeFilter: React.FC<TransportModeFilterProps> = () => {
  // Composant rendu sans contenu visible
  return null;
};

export default TransportModeFilter;
