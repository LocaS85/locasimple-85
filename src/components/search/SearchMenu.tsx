
import React, { useState } from 'react';
import { X, ArrowUpDown, ChevronRight, Filter, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoriesSelector } from '@/components/menu/CategoriesSelector';
import { RadiusSelector } from '@/components/menu/RadiusSelector';
import { TransportModeSelector } from '@/components/menu/TransportModeSelector';
import { FiltersSection } from '@/components/search/FiltersSection';
import ResultsList, { Result } from '@/components/ResultsList';
import SavedSearches from '@/components/search/SavedSearches';
import SearchHistory from '@/components/search/SearchHistory';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchMenuProps {
  show: boolean;
  onClose: () => void;
  onReset?: () => void;
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  selectedDistance: number | null;
  onDistanceChange: (distance: number) => void;
  selectedDuration: number | null;
  onDurationChange: (duration: number) => void;
  distanceUnit: 'km' | 'mi';
  onDistanceUnitChange: (unit: 'km' | 'mi') => void;
  resultsCount: number;
  onResultsCountChange: (count: number) => void;
  results: Result[];
  onResultClick: (result: Result) => void;
  selectedResultId?: string;
  searchHistory: string[];
  savedSearches: string[];
  onHistoryItemClick: (query: string) => void;
  onSaveSearch: (query: string) => void;
  onRemoveSavedSearch: (query: string) => void;
  searchQuery: string;
  favoritePlaces?: Result[];
  onToggleFavorite?: (result: Result) => void;
}

export const SearchMenu: React.FC<SearchMenuProps> = ({
  show,
  onClose,
  onReset,
  transportMode,
  onTransportModeChange,
  selectedCategory,
  onCategorySelect,
  selectedDistance,
  onDistanceChange,
  selectedDuration,
  onDurationChange,
  distanceUnit,
  onDistanceUnitChange,
  resultsCount,
  onResultsCountChange,
  results,
  onResultClick,
  selectedResultId,
  searchHistory,
  savedSearches,
  onHistoryItemClick,
  onSaveSearch,
  onRemoveSavedSearch,
  searchQuery,
  favoritePlaces = [],
  onToggleFavorite = () => {}
}) => {
  const { t } = useLanguage();
  const [radiusType, setRadiusType] = useState<'distance' | 'duration'>('distance');
  const [duration, setDuration] = useState(30);
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours'>('minutes');

  if (!show) return null;

  const handleRadiusTypeChange = (type: 'distance' | 'duration') => {
    setRadiusType(type);
    // Si on change pour durée, utiliser la valeur sélectionnée précédemment
    if (type === 'duration' && selectedDuration) {
      setDuration(selectedDuration);
    }
  };

  const handleDurationChange = (value: number) => {
    setDuration(value);
    onDurationChange(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <Card className="h-full w-full max-w-md overflow-y-auto rounded-none shadow-xl relative">
        <CardHeader className="flex-row items-center justify-between space-y-0 p-4">
          <CardTitle className="text-lg">{t('search_and_filters')}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-4">
          <Tabs defaultValue="filters" className="w-full">
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
            
            <TabsContent value="filters" className="space-y-6">
              <FiltersSection
                resultsCount={resultsCount}
                onResultsCountChange={onResultsCountChange}
                transportMode={transportMode}
                onTransportModeChange={onTransportModeChange}
                selectedDuration={selectedDuration}
                onDurationChange={onDurationChange}
                selectedDistance={selectedDistance}
                distanceUnit={distanceUnit}
                onDistanceChange={onDistanceChange}
                onDistanceUnitChange={onDistanceUnitChange}
                selectedCategory={selectedCategory}
                onCategorySelect={onCategorySelect}
              />
              
              {results.length > 0 && (
                <div className="mt-4">
                  <ResultsList 
                    results={results}
                    onResultClick={onResultClick}
                    selectedResultId={selectedResultId}
                  />
                </div>
              )}
              
              {onReset && (
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={onReset}
                >
                  {t('reset_filters')}
                </Button>
              )}
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-4">
                <SavedSearches
                  searches={savedSearches}
                  onSearchClick={onHistoryItemClick}
                  onRemoveSearch={onRemoveSavedSearch}
                />
                
                <SearchHistory
                  history={searchHistory}
                  savedSearches={savedSearches}
                  onHistoryItemClick={onHistoryItemClick}
                  onSaveSearch={onSaveSearch}
                  onRemoveSavedSearch={onRemoveSavedSearch}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="favorites">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchMenu;
