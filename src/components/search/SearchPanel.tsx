
import React from 'react';
import { Button } from '@/components/ui/button';
import TransparentSearchBar from './TransparentSearchBar';
import type { Result } from '@/components/ResultsList';

interface SearchPanelProps {
  query: string;
  setQuery: (query: string) => void;
  search: (query: string) => void;
  isRecording?: boolean;
  onMicClick?: () => void;
  isLocationActive?: boolean;
  onLocationClick?: () => void;
  loading?: boolean;
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
  onMenuClick?: () => void;
  // Add new props
  onResultSelect?: (result: Result) => void;
  resetSearch?: () => void;
  showHistory?: boolean;
  setShowHistory?: (show: boolean) => void;
  searchHistory?: string[];
  savedSearches?: string[];
  onHistoryItemClick?: (query: string) => void;
  onSaveSearch?: (query: string) => void;
  onRemoveSavedSearch?: (query: string) => void;
  userLocation?: [number, number];
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  query,
  setQuery,
  search,
  isRecording = false,
  onMicClick = () => {},
  isLocationActive = false,
  onLocationClick = () => {},
  loading = false,
  transportMode,
  onTransportModeChange,
  onMenuClick = () => {},
  // Add new props with defaults
  onResultSelect = () => {},
  resetSearch = () => {},
  showHistory = false,
  setShowHistory = () => {},
  searchHistory = [],
  savedSearches = [],
  onHistoryItemClick = () => {},
  onSaveSearch = () => {},
  onRemoveSavedSearch = () => {},
  userLocation
}) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
      <div className="flex flex-col items-center gap-2">
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
          onMenuClick={onMenuClick}
        />

        {/* We can optionally add a search history display here */}
        {showHistory && searchHistory.length > 0 && (
          <div className="w-full bg-white/80 backdrop-blur-sm rounded-lg shadow-md mt-2 p-3 max-h-60 overflow-y-auto">
            <div className="mb-2 text-sm font-medium text-gray-600">Recent searches</div>
            <ul className="space-y-1">
              {searchHistory.map((historyItem, index) => (
                <li key={`history-${index}`}>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex justify-between items-center"
                    onClick={() => onHistoryItemClick(historyItem)}
                  >
                    <span>{historyItem}</span>
                    <button 
                      className="text-gray-500 hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSaveSearch(historyItem);
                      }}
                    >
                      Save
                    </button>
                  </button>
                </li>
              ))}
            </ul>

            {savedSearches.length > 0 && (
              <>
                <div className="mt-4 mb-2 text-sm font-medium text-gray-600">Saved searches</div>
                <ul className="space-y-1">
                  {savedSearches.map((savedItem, index) => (
                    <li key={`saved-${index}`}>
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md flex justify-between items-center"
                        onClick={() => onHistoryItemClick(savedItem)}
                      >
                        <span>{savedItem}</span>
                        <button 
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveSavedSearch(savedItem);
                          }}
                        >
                          Remove
                        </button>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
