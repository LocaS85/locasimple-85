
import React from 'react';
import { ResultsCountPopover } from '@/components/search/ResultsCountPopover';
import { DurationFilter } from '@/components/search/DurationFilter';
import { DistanceFilter } from '@/components/search/DistanceFilter';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchHeaderProps {
  resultsCount: number;
  setResultsCount: (count: number) => void;
  selectedDuration: number | null;
  setSelectedDuration: (duration: number | null) => void;
  selectedDistance: number | null;
  setSelectedDistance: (distance: number | null) => void;
  distanceUnit: 'km' | 'miles';
  setDistanceUnit: (unit: 'km' | 'miles') => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  resultsCount,
  setResultsCount,
  selectedDuration,
  setSelectedDuration,
  selectedDistance,
  setSelectedDistance,
  distanceUnit,
  setDistanceUnit
}) => {
  const { t } = useLanguage();

  return (
    <div className="p-4 flex justify-between items-center bg-white shadow-sm z-10">
      <h1 className="text-xl font-bold">{t('search')}</h1>
      <div className="flex gap-2">
        <ResultsCountPopover 
          resultsCount={resultsCount} 
          onResultsCountChange={setResultsCount} 
        />
        <DurationFilter 
          selectedDuration={selectedDuration} 
          onDurationChange={setSelectedDuration} 
        />
        <DistanceFilter 
          selectedDistance={selectedDistance} 
          distanceUnit={distanceUnit} 
          onDistanceChange={setSelectedDistance} 
          onDistanceUnitChange={setDistanceUnit} 
        />
      </div>
    </div>
  );
};

export default SearchHeader;
