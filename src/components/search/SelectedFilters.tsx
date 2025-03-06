
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { transportModes } from '@/data/transportModes';
import { mockCategories } from '@/data/mockCategories';
import { Clock, MapPin, Navigation, Gauge, Users } from 'lucide-react';

interface SelectedFiltersProps {
  selectedDuration: number | null;
  selectedDistance: number | null;
  distanceUnit: 'km' | 'miles';
  transportMode: string;
  resultsCount: number;
  selectedCategory: string | null;
}

export const SelectedFilters: React.FC<SelectedFiltersProps> = ({
  selectedDuration,
  selectedDistance,
  distanceUnit,
  transportMode,
  resultsCount,
  selectedCategory
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
        `${selectedDistance} ${t('km')}`;
    } else {
      return `${(selectedDistance * 0.621371).toFixed(1)} ${t('miles')}`;
    }
  };

  const getTransportModeName = () => {
    const mode = transportModes.find(mode => mode.id === transportMode);
    return t(transportMode) || mode?.name || 'Voiture';
  };

  const getCategoryName = () => {
    const category = mockCategories.find(cat => cat.id === selectedCategory);
    return t(selectedCategory || '') || category?.name || '';
  };

  const getFilterSummary = () => {
    const parts = [];
    
    if (selectedCategory) {
      parts.push(getCategoryName());
    }
    
    if (selectedDuration) {
      parts.push(`${formatDuration(selectedDuration)} en ${getTransportModeName().toLowerCase()}`);
    } else if (selectedDistance) {
      parts.push(`${formatDistance()} en ${getTransportModeName().toLowerCase()}`);
    }
    
    if (parts.length === 0) return '';
    
    return parts.join(' · ');
  };

  return (
    <div className="px-2 py-2">
      {getFilterSummary() && (
        <div className="mb-2 text-center font-medium text-sm">
          <span className="bg-black/5 px-3 py-1 rounded-full">
            {getFilterSummary()}
          </span>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 items-center justify-center">
        {selectedCategory && (
          <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="font-medium">{getCategoryName()}</span>
          </div>
        )}
        
        {selectedDuration && (
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="font-medium">{formatDuration(selectedDuration)}</span>
          </div>
        )}
        
        {selectedDistance && (
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
            <Navigation className="w-3 h-3" />
            <span className="font-medium">{formatDistance()}</span>
          </div>
        )}
        
        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
          <Gauge className="w-3 h-3" />
          <span className="font-medium">{getTransportModeName()}</span>
        </div>
        
        <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span className="font-medium">{resultsCount} {resultsCount > 1 ? t('resultsFound') : t('resultsFound')}</span>
        </div>
      </div>
    </div>
  );
};
