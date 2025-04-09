
import React from 'react';
import { Filter, Star, Clock } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

export const SearchMenuTabs: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <TabsList className="w-full mb-4 grid grid-cols-3">
      <TabsTrigger value="filters" className="flex gap-1 items-center">
        <Filter className="h-4 w-4" />
        {t('filters')}
      </TabsTrigger>
      <TabsTrigger value="history" className="flex gap-1 items-center">
        <Clock className="h-4 w-4" />
        {t('history')}
      </TabsTrigger>
      <TabsTrigger value="favorites" className="flex gap-1 items-center">
        <Star className="h-4 w-4" />
        {t('favorites')}
      </TabsTrigger>
    </TabsList>
  );
};

export default SearchMenuTabs;
