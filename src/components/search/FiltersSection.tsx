
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransportModeFilter } from '@/components/search/TransportModeFilter';
import { DistanceFilter } from '@/components/search/DistanceFilter';
import { DistanceUnit } from '@/types/categoryTypes';
import { DurationFilter } from '@/components/search/DurationFilter';

interface FiltersSectionProps {
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
  selectedDistance: number;
  onDistanceChange: (distance: number) => void;
  selectedDuration: number | null;
  onDurationChange: (duration: number | null) => void;
  distanceUnit: DistanceUnit;
  onDistanceUnitChange: (unit: DistanceUnit) => void;
  filterMode: string;
  onFilterModeChange: (mode: string) => void;
  resultsCount?: number;
  onResultsCountChange?: (count: number) => void;
  selectedCategory?: string | null;
  onCategorySelect?: (categoryId: string | null) => void;
}

export const FiltersSection: React.FC<FiltersSectionProps> = ({
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
  onCategorySelect
}) => {
  return (
    <div className="space-y-4 p-2">
      <Tabs value={filterMode} onValueChange={onFilterModeChange} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="distance" className="flex-1">Distance</TabsTrigger>
          <TabsTrigger value="duration" className="flex-1">Durée</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <TransportModeFilter 
        selectedMode={transportMode} 
        onModeChange={onTransportModeChange} 
      />
      
      {filterMode === 'distance' ? (
        <DistanceFilter
          selectedDistance={selectedDistance}
          distanceUnit={distanceUnit}
          onDistanceChange={onDistanceChange}
          onDistanceUnitChange={onDistanceUnitChange}
        />
      ) : (
        <DurationFilter 
          selectedDuration={selectedDuration || 15}
          onDurationChange={onDurationChange}
        />
      )}
    </div>
  );
};
