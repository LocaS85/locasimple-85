
import React from 'react';
import type { Result } from '../ResultsList';
import { useLanguage } from '@/contexts/LanguageContext';

interface MapResultsProps {
  results: Result[];
}

const MapResults: React.FC<MapResultsProps> = ({ results }) => {
  const { t } = useLanguage();
  
  if (results.length === 0) return null;
  
  return (
    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-sm font-medium">
      {results.length} {t('resultsFound')}
    </div>
  );
};

export default MapResults;
