
import React from 'react';
import CategoryAccordion from './CategoryAccordion';
import RadiusControl from './RadiusControl';
import TransportSelector from './TransportSelector';
import TimeFilter from './TimeFilter';
import PrintExportControl from './PrintExportControl';
import FilterStack from './FilterStack';
import { DistanceUnit } from '@/types/categoryTypes';

interface FilterSidebarProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  selectedDistance: number | null;
  distanceUnit: DistanceUnit;
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
  resultsCount: number;
  onResultsCountChange: (count: number) => void;
  filterMode: 'distance' | 'duration';
  onFilterModeChange: (mode: 'distance' | 'duration') => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategory,
  onCategorySelect,
  selectedDistance,
  distanceUnit,
  transportMode,
  onTransportModeChange,
  resultsCount,
  onResultsCountChange,
  filterMode,
  onFilterModeChange
}) => {
  // Handle radius change
  const handleRadiusChange = (radius: number, unit: string) => {
    // This is just a proxy to the parent's handler
    onFilterModeChange('distance');
  };

  // Handle duration change
  const handleDurationChange = (duration: number, timeUnit: string) => {
    onFilterModeChange('duration');
  };

  // Handle time range change
  const handleTimeRangeChange = (timeRange: { start: string; end: string }) => {
    console.log('Time range changed:', timeRange);
  };

  // Handle export
  const handleExport = (format: string, options: any) => {
    console.log(`Exporting ${format} with options:`, options);
  };

  return (
    <div className="w-full md:w-80 lg:w-96 h-full overflow-y-auto border-r border-gray-200 transition-all duration-300 bg-white z-10">
      <FilterStack>
        {/* Category selection */}
        <CategoryAccordion 
          categories={[]}
          selectionMode="hierarchical"
          onCategorySelect={(categoryId) => onCategorySelect(categoryId)}
          selectedCategory={selectedCategory}
          selectedSubcategory={undefined}
        />
        
        {/* Results count control */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium mb-2">Nombre de résultats</h3>
          <div className="flex items-center justify-between">
            <input
              type="range"
              min={1}
              max={10}
              value={resultsCount}
              onChange={(e) => onResultsCountChange(parseInt(e.target.value))}
              className="w-full"
            />
            <span className="ml-2 font-medium">{resultsCount}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Afficher les {resultsCount} lieux les plus proches
          </p>
        </div>
        
        {/* Radius control */}
        <RadiusControl
          unitOptions={['km', 'mi']}
          maxRadius={100}
          step={5}
          defaultRadius={selectedDistance || 5}
          defaultUnit={distanceUnit}
          onChange={handleRadiusChange}
          onDurationChange={handleDurationChange}
        />
        
        {/* Transport mode */}
        <TransportSelector
          defaultMode={transportMode}
          onChange={onTransportModeChange}
        />
        
        {/* Time filter */}
        <TimeFilter
          type="time-range"
          ranges={['now', 'today', 'custom']}
          onChange={handleTimeRangeChange}
        />
        
        {/* Export controls */}
        <PrintExportControl
          onExport={handleExport}
        />
      </FilterStack>
    </div>
  );
};

export default FilterSidebar;
