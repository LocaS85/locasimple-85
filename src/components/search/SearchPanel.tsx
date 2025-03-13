
import React from 'react';
import { Button } from '@/components/ui/button';
import { History, Search } from 'lucide-react';
import SearchAutocomplete from './SearchAutocomplete';
import SearchHistory from './SearchHistory';
import { Result } from '@/components/ResultsList';

interface SearchPanelProps {
  query: string;
  setQuery: (query: string) => void;
  search: (query: string) => void;
  onResultSelect: (result: Result) => void;
  resetSearch: () => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  searchHistory: string[];
  savedSearches: string[];
  onHistoryItemClick: (query: string) => void;
  onSaveSearch: (query: string) => void;
  onRemoveSavedSearch: (query: string) => void;
  userLocation?: [number, number];
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  query,
  setQuery,
  search,
  onResultSelect,
  resetSearch,
  showHistory,
  setShowHistory,
  searchHistory,
  savedSearches,
  onHistoryItemClick,
  onSaveSearch,
  onRemoveSavedSearch,
  userLocation
}) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
      <div className="bg-white rounded-lg shadow-md p-3">
        <div className="flex items-center gap-2">
          <SearchAutocomplete
            value={query}
            onChange={setQuery}
            onSearch={search}
            onResultSelect={(result) => {
              // Find equivalent in searchResults
              const formattedResult = {
                id: result.id,
                name: result.place_name.split(',')[0],
                address: result.place_name,
                distance: 0,
                duration: 0,
                category: result.properties?.category || 'other',
                color: 'blue',
                latitude: result.center[1],
                longitude: result.center[0],
                description: ''
              };
              onResultSelect(formattedResult);
            }}
            onClear={resetSearch}
            placeholder="Rechercher un lieu, une entreprise..."
            userLocation={userLocation}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowHistory(!showHistory)}
            className="flex-shrink-0"
          >
            <History className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Search history */}
        {showHistory && (
          <div className="mt-2">
            <SearchHistory
              history={searchHistory}
              savedSearches={savedSearches}
              onHistoryItemClick={onHistoryItemClick}
              onSaveSearch={onSaveSearch}
              onRemoveSavedSearch={onRemoveSavedSearch}
              onClearHistory={() => {
                localStorage.removeItem('search_history');
                location.reload();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
