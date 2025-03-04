
import React from 'react';
import { CategoriesScroller } from '@/components/search/CategoriesScroller';
import { FiltersSection } from '@/components/search/FiltersSection';
import { SelectedFilters } from '@/components/search/SelectedFilters';
import { SearchFooter } from '@/components/search/SearchFooter';
import { MenuToggleHeader } from '@/components/search/MenuToggleHeader';

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
  onDistanceUnitChange
}) => {
  return (
    <div 
      ref={menuRef}
      className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg transition-all duration-300 z-20 ${
        menuOpen ? 'h-[55vh]' : 'h-auto'
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
        <div className="px-3 py-1">
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
        <div className="overflow-y-auto max-h-[calc(55vh-3rem)] pb-12">
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
        </div>
      )}
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <SearchFooter />
      </div>
    </div>
  );
};
