
import { useState } from 'react';
import { toast } from 'sonner';

export const useSearchHistoryState = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('search_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading search history:', e);
      return [];
    }
  });
  
  const [savedSearches, setSavedSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_searches');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading saved searches:', e);
      return [];
    }
  });

  const handleHistoryItemClick = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const handleSaveSearch = (query: string) => {
    if (!savedSearches.includes(query)) {
      setSavedSearches(prev => [query, ...prev]);
      localStorage.setItem('saved_searches', JSON.stringify([query, ...savedSearches]));
      toast.success(`Recherche "${query}" sauvegardée`);
    }
  };

  const handleRemoveSavedSearch = (query: string) => {
    setSavedSearches(prev => prev.filter(q => q !== query));
    localStorage.setItem('saved_searches', JSON.stringify(savedSearches.filter(q => q !== query)));
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
