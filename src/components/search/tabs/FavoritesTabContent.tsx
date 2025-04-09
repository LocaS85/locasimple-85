
import React from 'react';
import ResultsList, { Result } from '@/components/ResultsList';
import { useLanguage } from '@/contexts/LanguageContext';

interface FavoritesTabContentProps {
  favoritePlaces: Result[];
  onResultClick: (result: Result) => void;
  selectedResultId?: string;
}

export const FavoritesTabContent: React.FC<FavoritesTabContentProps> = ({
  favoritePlaces,
  onResultClick,
  selectedResultId
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium mb-2">{t('favorite_places')}</h3>
      {favoritePlaces.length > 0 ? (
        <ResultsList 
          results={favoritePlaces}
          onResultClick={onResultClick}
          selectedResultId={selectedResultId}
        />
      ) : (
        <div className="text-center py-4 text-gray-500">
          <p>{t('no_favorites')}</p>
          <p className="text-sm mt-2">{t('add_favorites_hint')}</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesTabContent;
