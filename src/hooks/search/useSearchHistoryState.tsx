
import { useState } from 'react';

export const useSearchHistoryState = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  const handleHistoryItemClick = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const handleSaveSearch = (query: string) => {
    if (!savedSearches.includes(query)) {
      setSavedSearches(prev => [query, ...prev]);
      toast.success(`Recherche "${query}" sauvegardée`);
    }
  };

  const handleRemoveSavedSearch = (query: string) => {
    setSavedSearches(prev => prev.filter(q => q !== query));
    toast.success(`Recherche "${query}" supprimée`);
  };

  // These functions will be defined later in the main hook
  let setSearchQuery: (query: string) => void = () => {};
  let performSearch: (query: string) => Promise<void> = async () => {};

  return {
    showHistory,
    setShowHistory,
    searchHistory,
    setSearchHistory,
    savedSearches,
    setSavedSearches,
    handleHistoryItemClick,
    handleSaveSearch,
    handleRemoveSavedSearch,
    _setFunctions: (
      setSearchQueryFn: (query: string) => void,
      performSearchFn: (query: string) => Promise<void>
    ) => {
      setSearchQuery = setSearchQueryFn;
      performSearch = performSearchFn;
    }
  };
};

export default useSearchHistoryState;
