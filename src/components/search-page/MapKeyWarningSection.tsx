
import React from 'react';
import MapKeyWarning from '@/components/search/MapKeyWarning';

interface MapKeyWarningSectionProps {
  showNoMapboxTokenWarning: boolean;
  setTemporaryApiKey: (key: string) => void;
}

export const MapKeyWarningSection: React.FC<MapKeyWarningSectionProps> = ({
  showNoMapboxTokenWarning,
  setTemporaryApiKey
}) => {
  if (!showNoMapboxTokenWarning) {
    return null;
  }
  
  return <MapKeyWarning setTemporaryApiKey={setTemporaryApiKey} />;
};

export default MapKeyWarningSection;
