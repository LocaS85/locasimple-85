
import React from 'react';
import { ResultsCountPopover } from './ResultsCountPopover';
import { TransportModeSelector } from '@/components/menu/TransportModeSelector';
import { DurationFilter } from './DurationFilter';
import { DistanceFilter } from './DistanceFilter';
import { CategoriesFilter } from './CategoriesFilter';

interface FiltersSectionProps {
  resultsCount: number;
  onResultsCountChange: (count: number) => void;
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
  selectedDuration: number | null;
  onDurationChange: (duration: number) => void;
  selectedDistance: number | null;
  distanceUnit: 'km' | 'miles';
  onDistanceChange: (distance: number) => void;
  onDistanceUnitChange: (unit: 'km' | 'miles') => void;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export const FiltersSection: React.FC<FiltersSectionProps> = ({
  resultsCount,
  onResultsCountChange,
  transportMode,
  onTransportModeChange,
  selectedDuration,
  onDurationChange,
  selectedDistance,
  distanceUnit,
  onDistanceChange,
  onDistanceUnitChange,
  selectedCategory,
  onCategorySelect
}) => {
  return (
    <div className="px-2 py-1 flex flex-col gap-1.5">
      <CategoriesFilter
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
      />
      
      <ResultsCountPopover 
        resultsCount={resultsCount}
        onResultsCountChange={onResultsCountChange}
      />
      
      <div className="w-full border border-black rounded-full bg-white text-black">
        <TransportModeSelector 
          transportMode={transportMode} 
          onTransportModeChange={onTransportModeChange} 
        />
      </div>
      
      <div className="flex justify-between gap-1.5">
        <div className="w-1/2">
          <DurationFilter 
            selectedDuration={selectedDuration}
            onDurationChange={onDurationChange}
          />
        </div>
        <div className="w-1/2">
          <DistanceFilter 
            selectedDistance={selectedDistance}
            distanceUnit={distanceUnit}
            onDistanceChange={onDistanceChange}
            onDistanceUnitChange={onDistanceUnitChange}
          />
        </div>
      </div>
    </div>
  );
};
