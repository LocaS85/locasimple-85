
import React from 'react';
import SearchBar from '@/components/SearchBar';
import CategorySelector from '@/components/category/CategorySelector';
import FilterPanel from '@/components/FilterPanel';
import ResultsList from '@/components/ResultsList';
import Map from '@/components/Map';
import { categories as appCategories } from '@/data/categories';
import type { Result } from '@/components/ResultsList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, PersonStanding, Bike, Bus, Train } from 'lucide-react';

interface SearchSectionProps {
  categories: typeof appCategories;
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
  const transportModes = [
    { value: 'driving', label: 'Voiture', Icon: Car },
    { value: 'walking', label: 'À pied', Icon: PersonStanding },
    { value: 'cycling', label: 'Vélo', Icon: Bike },
    { value: 'transit', label: 'Transport en commun', Icon: Bus },
    { value: 'train', label: 'Train', Icon: Train },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)]">
      <div className="w-full lg:w-96 h-full flex flex-col p-4 space-y-4 border-b lg:border-b-0 lg:border-r bg-white">
        <SearchBar onSearch={(query) => console.log('Searching:', query)} />
        
        <div className="flex flex-wrap gap-2">
          {transportModes.map(({ value, label, Icon }) => (
            <Button
              key={value}
              variant={transportMode === value ? "default" : "outline"}
              size="sm"
              onClick={() => onTransportModeChange(value)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>

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
