
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { SearchMenuTabs } from './SearchMenuTabs';
import FiltersTabContent from './tabs/FiltersTabContent';
import HistoryTabContent from './tabs/HistoryTabContent';
import FavoritesTabContent from './tabs/FavoritesTabContent';
import { Result } from '@/components/ResultsList';
import { useLanguage } from '@/contexts/LanguageContext';
import { DistanceUnit } from '@/types/categoryTypes';

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
  distanceUnit: DistanceUnit;
  onDistanceUnitChange: (unit: DistanceUnit) => void;
  resultsCount: number;
  onResultsCountChange: (count: number) => void;
  filterMode: 'distance' | 'duration';
  onFilterModeChange: (type: 'distance' | 'duration') => void;
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
  filterMode,
  onFilterModeChange,
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

  if (!show) return null;

  const handleRadiusTypeChange = (type: 'distance' | 'duration') => {
    onFilterModeChange(type);
    // Si on change pour durée, utiliser la valeur sélectionnée précédemment
    if (type === 'duration' && selectedDuration) {
      // This is handled by the parent now
    }
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
            <SearchMenuTabs />
            
            <TabsContent value="filters">
              <FiltersTabContent 
                transportMode={transportMode}
                onTransportModeChange={onTransportModeChange}
                selectedDistance={selectedDistance}
                onDistanceChange={onDistanceChange}
                selectedDuration={selectedDuration}
                onDurationChange={onDurationChange}
                distanceUnit={distanceUnit}
                onDistanceUnitChange={onDistanceUnitChange}
                filterMode={filterMode}
                onFilterModeChange={handleRadiusTypeChange}
                resultsCount={resultsCount}
                onResultsCountChange={onResultsCountChange}
                selectedCategory={selectedCategory}
                onCategorySelect={onCategorySelect}
                results={results}
                onResultClick={onResultClick}
                selectedResultId={selectedResultId}
                onReset={onReset}
              />
            </TabsContent>
            
            <TabsContent value="history">
              <HistoryTabContent 
                searchHistory={searchHistory}
                savedSearches={savedSearches}
                onHistoryItemClick={onHistoryItemClick}
                onSaveSearch={onSaveSearch}
                onRemoveSavedSearch={onRemoveSavedSearch}
              />
            </TabsContent>
            
            <TabsContent value="favorites">
              <FavoritesTabContent 
                favoritePlaces={favoritePlaces}
                onResultClick={onResultClick}
                selectedResultId={selectedResultId}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchMenu;
