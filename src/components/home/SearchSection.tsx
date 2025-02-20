
import React from 'react';
import SearchBar from '@/components/SearchBar';
import CategorySelector from '@/components/CategorySelector';
import FilterPanel from '@/components/FilterPanel';
import ResultsList from '@/components/ResultsList';
import Map from '@/components/Map';
import type { Category } from '@/components/CategorySelector';
import type { Result } from '@/components/ResultsList';

interface SearchSectionProps {
  categories: Category[];
  selectedCategories: string[];
  onCategorySelect: (categoryId: string) => void;
  radius: number;
  onRadiusChange: (value: number) => void;
  transportMode: string;
  onTransportModeChange: (value: string) => void;
  resultsCount: number;
  onResultsCountChange: (value: number) => void;
  results: Result[];
}

const SearchSection = ({
  categories,
  selectedCategories,
  onCategorySelect,
  radius,
  onRadiusChange,
  transportMode,
  onTransportModeChange,
  resultsCount,
  onResultsCountChange,
  results,
}: SearchSectionProps) => {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-20rem)]">
      <div className="w-full lg:w-96 h-full flex flex-col p-4 space-y-4 border-b lg:border-b-0 lg:border-r bg-white">
        <SearchBar onSearch={(query) => console.log('Searching:', query)} />
        <CategorySelector
          categories={categories}
          selectedCategories={selectedCategories}
          onSelect={onCategorySelect}
        />
        <FilterPanel
          radius={radius}
          onRadiusChange={onRadiusChange}
          transportMode={transportMode}
          onTransportModeChange={onTransportModeChange}
          resultsCount={resultsCount}
          onResultsCountChange={onResultsCountChange}
        />
        <div className="flex-1 overflow-auto">
          <ResultsList
            results={results}
            onResultClick={(result) => console.log('Clicked:', result)}
          />
        </div>
      </div>

      <div className="flex-1 relative min-h-[300px] lg:min-h-0">
        <Map
          results={results}
          center={[2.3522, 48.8566]}
        />
      </div>
    </div>
  );
};

export default SearchSection;
