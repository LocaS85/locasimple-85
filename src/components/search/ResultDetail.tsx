
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Result } from '@/components/ResultsList';

interface ResultDetailProps {
  result: Result | null;
}

const ResultDetail: React.FC<ResultDetailProps> = ({ result }) => {
  const { t } = useLanguage();

  if (!result) return null;

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-lg">{result.name}</h3>
      <p className="text-gray-600">{result.address}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div>
          <span className="text-gray-500">{t('distance')}:</span> 
          <span className="font-medium ml-1">{result.distance?.toFixed(1)} km</span>
        </div>
        <div>
          <span className="text-gray-500">{t('duration')}:</span> 
          <span className="font-medium ml-1">{result.duration} min</span>
        </div>
        {result.rating !== undefined && (
          <div>
            <span className="text-gray-500">{t('rating')}:</span> 
            <span className="font-medium ml-1">{result.rating}/5</span>
          </div>
        )}
        {result.openingHours && (
          <div>
            <span className="text-gray-500">{t('opening_hours')}:</span> 
            <span className="font-medium ml-1">{result.openingHours}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <Button variant="outline" size="sm">
          {t('get_directions')}
        </Button>
      </div>
    </div>
  );
};

export default ResultDetail;
