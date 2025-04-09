
import React from 'react';
import { Button } from '@/components/ui/button';
import { FiltersSection } from '@/components/search/FiltersSection';
import ResultsList, { Result } from '@/components/ResultsList';
import { useLanguage } from '@/contexts/LanguageContext';
import { DistanceUnit } from '@/types/categoryTypes';

interface FiltersTabContentProps {
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
  selectedDistance: number | null;
  onDistanceChange: (distance: number) => void;
  selectedDuration: number | null;
  onDurationChange: (duration: number) => void;
  distanceUnit: DistanceUnit;
  onDistanceUnitChange: (unit: DistanceUnit) => void;
  filterMode: 'distance' | 'duration';
  onFilterModeChange: (mode: 'distance' | 'duration') => void;
  resultsCount: number;
  onResultsCountChange: (count: number) => void;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  results: Result[];
  onResultClick: (result: Result) => void;
  selectedResultId?: string;
  onReset?: () => void;
}

export const FiltersTabContent: React.FC<FiltersTabContentProps> = ({
  transportMode,
  onTransportModeChange,
  selectedDistance,
  onDistanceChange,
  selectedDuration,
  onDurationChange,
  distanceUnit,
  onDistanceUnitChange,
  filterMode,
  onFilterModeChange,
  resultsCount,
  onResultsCountChange,
  selectedCategory,
  onCategorySelect,
  results,
  onResultClick,
  selectedResultId,
  onReset
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <FiltersSection
        transportMode={transportMode}
        onTransportModeChange={onTransportModeChange}
        selectedDistance={selectedDistance || 5}
        onDistanceChange={onDistanceChange}
        selectedDuration={selectedDuration}
        onDurationChange={onDurationChange}
        distanceUnit={distanceUnit}
        onDistanceUnitChange={onDistanceUnitChange}
        filterMode={filterMode}
        onFilterModeChange={onFilterModeChange}
        resultsCount={resultsCount}
        onResultsCountChange={onResultsCountChange}
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
    </div>
  );
};

export default FiltersTabContent;
