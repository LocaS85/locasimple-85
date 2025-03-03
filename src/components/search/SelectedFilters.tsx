
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { transportModes } from '@/data/transportModes';

interface SelectedFiltersProps {
  selectedDuration: number | null;
  selectedDistance: number | null;
  distanceUnit: 'km' | 'miles';
  transportMode: string;
  resultsCount: number;
}

export const SelectedFilters: React.FC<SelectedFiltersProps> = ({
  selectedDuration,
  selectedDistance,
  distanceUnit,
  transportMode,
  resultsCount
}) => {
  const { t } = useLanguage();

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? 
      `${hours} h ${remainingMinutes} min` : 
      `${hours} h`;
  };

  const formatDistance = () => {
    if (!selectedDistance) return null;
    
    if (distanceUnit === 'km') {
      return selectedDistance < 1 ? 
        `${selectedDistance * 1000} m` : 
        `${selectedDistance} km`;
    } else {
      return `${(selectedDistance * 0.621371).toFixed(1)} mi`;
    }
  };

  const getTransportModeName = () => {
    return transportModes.find(mode => mode.id === transportMode)?.name || 'Voiture';
  };

  return (
    <div className="px-0 py-1">
      <div className="flex flex-wrap gap-2 items-center justify-center">
        {selectedDuration && (
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
            <span className="font-medium">{formatDuration(selectedDuration)}</span>
          </div>
        )}
        
        {selectedDistance && (
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center">
            <span className="font-medium">{formatDistance()}</span>
          </div>
        )}
        
        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center">
          <span className="font-medium">{getTransportModeName()}</span>
        </div>
        
        <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center">
          <span className="font-medium">{resultsCount} {resultsCount > 1 ? 'résultats' : 'résultat'}</span>
        </div>
      </div>
    </div>
  );
};
