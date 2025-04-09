
import React from 'react';
import SavedSearches from '@/components/search/SavedSearches';
import SearchHistory from '@/components/search/SearchHistory';

interface HistoryTabContentProps {
  searchHistory: string[];
  savedSearches: string[];
  onHistoryItemClick: (query: string) => void;
  onSaveSearch: (query: string) => void;
  onRemoveSavedSearch: (query: string) => void;
}

export const HistoryTabContent: React.FC<HistoryTabContentProps> = ({
  searchHistory,
  savedSearches,
  onHistoryItemClick,
  onSaveSearch,
  onRemoveSavedSearch
}) => {
  return (
    <div className="space-y-4">
      <SavedSearches
        searches={savedSearches}
        onSearchClick={onHistoryItemClick}
        onRemoveSearch={onRemoveSavedSearch}
      />
      
      <SearchHistory
        history={searchHistory}
        savedSearches={savedSearches}
        onHistoryItemClick={onHistoryItemClick}
        onSaveSearch={onSaveSearch}
        onRemoveSavedSearch={onRemoveSavedSearch}
      />
    </div>
  );
};

export default HistoryTabContent;
