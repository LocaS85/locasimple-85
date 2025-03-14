
import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SearchContainer } from '@/components/search/SearchContainer';
import { toast } from 'sonner';
import { MAPBOX_TOKEN } from '@/config/environment';

const SearchPage = () => {
  const { t } = useLanguage();

  useEffect(() => {
    // Verify Mapbox token on component mount
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === '') {
      toast.error('Token Mapbox manquant. La carte ne fonctionnera pas correctement.');
    } else {
      console.log('SearchPage loaded with Mapbox token available');
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Removed the black header bar with "Recherche" text */}
      
      <div className="flex-grow relative">
        <SearchContainer />
      </div>
    </div>
  );
};

export default SearchPage;
