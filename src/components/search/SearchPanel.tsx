
import React from 'react';
import { Search, Map, ListFilter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from './SearchInput';
import { FiltersSection } from './FiltersSection';

interface SearchPanelProps {
  query: string;
  setQuery: (query: string) => void;
  search: (query: string) => void;
  isLocationActive: boolean;
  onLocationClick: () => void;
  loading: boolean;
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
  userLocation: [number, number];
  generatePDF: () => void;
  limit: number;
  setLimit: (limit: number) => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  query,
  setQuery,
  search,
  isLocationActive,
  onLocationClick,
  loading,
  transportMode,
  onTransportModeChange,
  userLocation,
  generatePDF,
  limit,
  setLimit
}) => {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="absolute top-4 left-0 right-0 px-4 z-10">
      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="flex-grow">
            <SearchInput
              searchQuery={query}
              onSearchChange={setQuery}
              isRecording={false}
              onMicClick={() => {}}
              isLocationActive={isLocationActive}
              onLocationClick={onLocationClick}
              loading={loading}
              transportMode={transportMode}
              onTransportModeChange={onTransportModeChange}
              userLocation={userLocation}
            />
          </div>
          
          <Button 
            type="submit"
            variant="default"
            size="icon"
            className="bg-blue-500 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
          
          <Button 
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              // Open filters menu
              console.log("Open filters menu");
            }}
          >
            <ListFilter className="h-5 w-5" />
          </Button>

          <Button 
            type="button"
            variant="outline"
            size="icon"
            onClick={generatePDF}
            disabled={loading}
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
          <FiltersSection
            resultsCount={limit}
            onResultsCountChange={setLimit}
            transportMode={transportMode}
            onTransportModeChange={onTransportModeChange}
            selectedDuration={15}
            onDurationChange={() => {}}
            selectedDistance={5}
            distanceUnit="km"
            onDistanceChange={() => {}}
            onDistanceUnitChange={() => {}}
            selectedCategory={null}
            onCategorySelect={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default SearchPanel;
