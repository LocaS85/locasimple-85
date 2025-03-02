
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
    return `${hours} h`;
  };

  return (
    <div className="px-4 py-3">
      <div className="bg-gray-100 rounded-lg p-3">
        <h3 className="font-bold mb-2">Vos critères de recherche :</h3>
        <div className="flex flex-wrap gap-2">
          {selectedDuration && (
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {formatDuration(selectedDuration)}
            </div>
          )}
          {selectedDistance && (
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              {distanceUnit === 'km' ? 
                (selectedDistance < 1 ? `${selectedDistance * 1000} m` : `${selectedDistance} km`) : 
                `${(selectedDistance * 0.621371).toFixed(1)} mi`}
            </div>
          )}
          <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
            {transportModes.find(mode => mode.id === transportMode)?.name || 'Voiture'}
          </div>
          <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
            Résultats: {resultsCount}
          </div>
        </div>
      </div>
    </div>
  );
};
