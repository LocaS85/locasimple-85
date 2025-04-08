
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { TransportModeFilter } from '@/components/search/TransportModeFilter';
import { DistanceFilter } from '@/components/search/DistanceFilter';
import { CategoriesFilter } from '@/components/search/CategoriesFilter';
import { ResultsCountPopover } from '@/components/search/ResultsCountPopover';
import { DistanceUnit } from '@/types/categoryTypes';

interface FiltersPanelProps {
  selectedCategory: string | null;
  selectedDistance: number;
  selectedDuration: number | null;
  transportMode: string;
  resultsCount: number;
  distanceUnit: DistanceUnit;
  onCategorySelect: (categoryId: string | null) => void;
  onDistanceChange: (value: number) => void;
  onTransportModeChange: (mode: string) => void;
  onResultsCountChange: (count: number) => void;
  onDurationChange: (duration: number | null) => void;
  onDistanceUnitChange: (unit: DistanceUnit) => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  selectedCategory,
  selectedDistance,
  selectedDuration,
  transportMode,
  resultsCount,
  distanceUnit,
  onCategorySelect,
  onDistanceChange,
  onTransportModeChange,
  onResultsCountChange,
  onDurationChange,
  onDistanceUnitChange
}) => {
  // Handle slider changes
  const handleRangeChange = (values: number[]) => {
    onDistanceChange(values[0]);
  };

  // Handle duration slider changes
  const handleDurationChange = (values: number[]) => {
    onDurationChange(values[0]);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <div className="space-y-6">
        <CategoriesFilter
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
        />

        <div className="space-y-4">
          <TransportModeFilter
            selectedMode={transportMode}
            onModeChange={onTransportModeChange}
          />

          <div>
            <DistanceFilter
              selectedDistance={selectedDistance}
              distanceUnit={distanceUnit}
              onDistanceChange={onDistanceChange}
              onDistanceUnitChange={onDistanceUnitChange}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-sm font-medium text-gray-700">Durée maximale</Label>
              <span className="text-sm font-medium text-gray-600">{selectedDuration || 15} min</span>
            </div>

            <Slider
              value={[selectedDuration || 15]}
              min={5}
              max={60}
              step={5}
              onValueChange={handleDurationChange}
            />

            <div className="flex justify-between text-xs text-gray-500">
              <span>5 min</span>
              <span>60 min</span>
            </div>
          </div>

          <ResultsCountPopover
            resultsCount={resultsCount}
            onChange={onResultsCountChange}
          />
        </div>
      </div>
    </div>
  );
};
