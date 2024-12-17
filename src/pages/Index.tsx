import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import CategorySelector from '@/components/CategorySelector';
import FilterPanel from '@/components/FilterPanel';
import ResultsList from '@/components/ResultsList';
import Map from '@/components/Map';
import type { Category } from '@/components/CategorySelector';
import type { Result } from '@/components/ResultsList';

const categories: Category[] = [
  { id: 'restaurant', name: 'Restaurants', icon: '🍽️', color: 'primary' },
  { id: 'bar', name: 'Bars', icon: '🍺', color: 'secondary' },
  { id: 'park', name: 'Parcs', icon: '🌳', color: 'success' },
  { id: 'shop', name: 'Commerces', icon: '🛍️', color: 'accent' },
  { id: 'culture', name: 'Culture', icon: '🎭', color: 'highlight' },
];

const Index = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [radius, setRadius] = useState(5);
  const [transportMode, setTransportMode] = useState('driving');
  const [resultsCount, setResultsCount] = useState(5);
  const [results, setResults] = useState<Result[]>([]);

  const handleSearch = (query: string) => {
    // Implement search logic here
    console.log('Searching for:', query);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleResultClick = (result: Result) => {
    console.log('Clicked result:', result);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel */}
      <div className="w-96 h-full flex flex-col p-4 space-y-4 border-r bg-white">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">LocaSimple</h1>
          <SearchBar onSearch={handleSearch} />
          <CategorySelector
            categories={categories}
            selectedCategories={selectedCategories}
            onSelect={handleCategorySelect}
          />
        </div>
        
        <FilterPanel
          radius={radius}
          onRadiusChange={setRadius}
          transportMode={transportMode}
          onTransportModeChange={setTransportMode}
          resultsCount={resultsCount}
          onResultsCountChange={setResultsCount}
        />
        
        <div className="flex-1 overflow-auto">
          <ResultsList
            results={results}
            onResultClick={handleResultClick}
          />
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <Map
          results={results}
          center={[2.3522, 48.8566]} // Paris coordinates
        />
      </div>
    </div>
  );
};

export default Index;