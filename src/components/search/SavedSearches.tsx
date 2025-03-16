
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pin, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SavedSearchesProps {
  searches: string[];
  onSearchClick: (query: string) => void;
  onRemoveSearch: (query: string) => void;
}

const SavedSearches: React.FC<SavedSearchesProps> = ({
  searches,
  onSearchClick,
  onRemoveSearch
}) => {
  const { t } = useLanguage();

  if (searches.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">{t('saved_searches')}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        {searches.map((query, index) => (
          <div 
            key={`${query}-${index}`}
            className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-100"
          >
            <Button 
              variant="ghost" 
              className="w-full justify-start p-2 h-auto text-sm"
              onClick={() => onSearchClick(query)}
            >
              <Pin className="mr-2 h-4 w-4 text-amber-400" />
              {query}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onRemoveSearch(query)}
              className="h-8 w-8 text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SavedSearches;
