
import React from 'react';
import { Button } from '@/components/ui/button';
import { History, Search } from 'lucide-react';
import SearchHistory from './SearchHistory';
import { Result } from '@/components/ResultsList';
import TransparentSearchBar from './TransparentSearchBar';

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
  isRecording?: boolean;
  onMicClick?: () => void;
  isLocationActive?: boolean;
  onLocationClick?: () => void;
  loading?: boolean;
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
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
  userLocation,
  isRecording = false,
  onMicClick = () => {},
  isLocationActive = false,
  onLocationClick = () => {},
  loading = false,
  transportMode,
  onTransportModeChange
}) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
      <div className="flex flex-col items-center gap-2">
        <div className="w-full flex items-center gap-2">
          <TransparentSearchBar
            searchQuery={query}
            onSearchChange={setQuery}
            onSearch={search}
            isRecording={isRecording}
            onMicClick={onMicClick}
            isLocationActive={isLocationActive}
            onLocationClick={onLocationClick}
            loading={loading}
            transportMode={transportMode}
            onTransportModeChange={onTransportModeChange}
            showCategoryMenu={false}
          />
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowHistory(!showHistory)}
            className="flex-shrink-0 h-12 w-12 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-gray-200"
          >
            <History className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Search history */}
        {showHistory && (
          <div className="w-full mt-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200">
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
