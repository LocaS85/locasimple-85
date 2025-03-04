import React from 'react';
import { CategoriesScroller } from '@/components/search/CategoriesScroller';
import { FiltersSection } from '@/components/search/FiltersSection';
import { SelectedFilters } from '@/components/search/SelectedFilters';
import { SearchFooter } from '@/components/search/SearchFooter';
import { MenuToggleHeader } from '@/components/search/MenuToggleHeader';
import ResultsList, { Result } from '@/components/ResultsList';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  menuRef: React.RefObject<HTMLDivElement>;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  selectedDuration: number | null;
  selectedDistance: number | null;
  distanceUnit: 'km' | 'miles';
  transportMode: string;
  resultsCount: number;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  onResultsCountChange: (count: number) => void;
  onTransportModeChange: (mode: string) => void;
  onDurationChange: (duration: number) => void;
  onDistanceChange: (distance: number) => void;
  onDistanceUnitChange: (unit: 'km' | 'miles') => void;
  searchResults: Result[];
  selectedResultId?: string;
  onResultClick: (result: Result) => void;
  onSearch?: () => void;
}

export const SearchMenu: React.FC<SearchMenuProps> = ({
  menuOpen,
  setMenuOpen,
  menuRef,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  selectedDuration,
  selectedDistance,
  distanceUnit,
  transportMode,
  resultsCount,
  selectedCategory,
  onCategorySelect,
  onResultsCountChange,
  onTransportModeChange,
  onDurationChange,
  onDistanceChange,
  onDistanceUnitChange,
  searchResults,
  selectedResultId,
  onResultClick,
  onSearch
}) => {
  return (
    <div 
      ref={menuRef}
      className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg transition-all duration-300 z-20 ${
        menuOpen ? 'h-[50vh]' : 'h-auto'
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <MenuToggleHeader 
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      
      {!menuOpen && (
        <div className="px-2 py-0.5">
          <SelectedFilters 
            selectedDuration={selectedDuration}
            selectedDistance={selectedDistance}
            distanceUnit={distanceUnit}
            transportMode={transportMode}
            resultsCount={resultsCount}
            selectedCategory={selectedCategory}
          />
        </div>
      )}
      
      {menuOpen && (
        <div className="overflow-y-auto max-h-[calc(50vh-2.5rem)] pb-8">
          <CategoriesScroller 
            selectedCategory={selectedCategory}
            onCategorySelect={onCategorySelect}
          />
          
          <FiltersSection 
            resultsCount={resultsCount}
            onResultsCountChange={onResultsCountChange}
            transportMode={transportMode}
            onTransportModeChange={onTransportModeChange}
            selectedDuration={selectedDuration}
            onDurationChange={onDurationChange}
            selectedDistance={selectedDistance}
            distanceUnit={distanceUnit}
            onDistanceChange={onDistanceChange}
            onDistanceUnitChange={onDistanceUnitChange}
          />
          
          <SelectedFilters 
            selectedDuration={selectedDuration}
            selectedDistance={selectedDistance}
            distanceUnit={distanceUnit}
            transportMode={transportMode}
            resultsCount={resultsCount}
            selectedCategory={selectedCategory}
          />
          
          {/* Add Search Button */}
          <div className="mt-4 px-4">
            <Button 
              onClick={onSearch}
              className="w-full bg-primary text-white font-medium rounded-full py-2 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Rechercher
            </Button>
          </div>
          
          {/* Results list */}
          {searchResults && searchResults.length > 0 && (
            <div className="mt-4 px-4">
              <h3 className="font-semibold text-lg mb-2">Résultats</h3>
              <ResultsList 
                results={searchResults} 
                onResultClick={onResultClick} 
                selectedResultId={selectedResultId}
                selectedCategory={selectedCategory}
                selectedDuration={selectedDuration}
                selectedDistance={selectedDistance}
                transportMode={transportMode}
              />
            </div>
          )}
        </div>
      )}
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <SearchFooter />
      </div>
    </div>
  );
};
