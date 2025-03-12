
import React from 'react';
import { FiltersSection } from '@/components/search/FiltersSection';
import { SelectedFilters } from '@/components/search/SelectedFilters';
import { SearchFooter } from '@/components/search/SearchFooter';
import { MenuToggleHeader } from '@/components/search/MenuToggleHeader';
import ResultsList, { Result } from '@/components/ResultsList';
import { Button } from '@/components/ui/button';
import { Search, Filter, Map, List } from 'lucide-react';

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
  // Toggle between map view and list view
  const [showListView, setShowListView] = useState(false);

  return (
    <div 
      ref={menuRef}
      className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg transition-all duration-300 ease-in-out z-20 ${
        menuOpen ? 'h-[60vh]' : 'h-auto'
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
        <div className="px-3 py-2">
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
        <div className="overflow-y-auto max-h-[calc(60vh-3rem)] pb-16">
          {/* View toggle */}
          <div className="flex justify-center mb-2 px-4 py-1">
            <div className="bg-gray-100 rounded-full p-1 flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-4 ${!showListView ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setShowListView(false)}
              >
                <Map className="h-4 w-4 mr-1" />
                <span className="text-xs">Carte</span>
              </Button>
              <Button
                variant="ghost" 
                size="sm"
                className={`rounded-full px-4 ${showListView ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setShowListView(true)}
              >
                <List className="h-4 w-4 mr-1" />
                <span className="text-xs">Liste</span>
              </Button>
            </div>
          </div>

          {!showListView ? (
            // Filters tab
            <>
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
                selectedCategory={selectedCategory}
                onCategorySelect={onCategorySelect}
              />
              
              <div className="mt-4 px-4">
                <Button 
                  onClick={onSearch}
                  className="w-full bg-primary text-white font-medium rounded-full py-6 flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Rechercher
                </Button>
              </div>
            </>
          ) : (
            // Results list tab
            <div className="px-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Résultats {searchResults.length > 0 && `(${searchResults.length})`}
              </h3>
              {searchResults && searchResults.length > 0 ? (
                <ResultsList 
                  results={searchResults} 
                  onResultClick={onResultClick} 
                  selectedResultId={selectedResultId}
                  selectedCategory={selectedCategory}
                  selectedDuration={selectedDuration}
                  selectedDistance={selectedDistance}
                  transportMode={transportMode}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucun résultat trouvé</p>
                  <p className="text-sm mt-1">Essayez de modifier vos filtres ou votre recherche</p>
                </div>
              )}
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

// Add missing import
import { useState } from 'react';

export default SearchMenu;
