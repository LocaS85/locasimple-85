
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { mapboxService, SearchResult, SearchOptions } from '@/services/mapboxService';

interface UseMapboxSearchProps {
  initialQuery?: string;
  userLocation?: [number, number];
  limit?: number;
  autocomplete?: boolean;
  types?: string[];
}

export const useMapboxSearch = ({
  initialQuery = '',
  userLocation,
  limit = 5,
  autocomplete = true,
  types = ['poi', 'address', 'place']
}: UseMapboxSearchProps = {}) => {
  const { language } = useLanguage();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Historique de recherche
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('search_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Erreur lors du chargement de l\'historique:', e);
      return [];
    }
  });

  // Recherches favoris
  const [savedSearches, setSavedSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_searches');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Erreur lors du chargement des recherches sauvegardées:', e);
      return [];
    }
  });

  // Effectuer la recherche
  const search = async (searchQuery = query): Promise<SearchResult[]> => {
    if (!searchQuery.trim()) {
      setResults([]);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const options: SearchOptions = {
        query: searchQuery,
        limit,
        autocomplete,
        types,
        language,
      };

      if (userLocation) {
        options.proximity = userLocation;
      }

      const searchResults = await mapboxService.searchPlaces(options);
      setResults(searchResults);
      
      // Ajouter à l'historique si ce n'est pas déjà la dernière recherche
      if (searchQuery && (!searchHistory.length || searchHistory[0] !== searchQuery)) {
        const newHistory = [searchQuery, ...searchHistory.filter(s => s !== searchQuery)].slice(0, 10);
        setSearchHistory(newHistory);
        localStorage.setItem('search_history', JSON.stringify(newHistory));
      }
      
      return searchResults;
    } catch (err) {
      console.error('Erreur de recherche:', err);
      setError('Erreur lors de la recherche');
      setResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser la recherche
  const resetSearch = () => {
    setQuery('');
    setResults([]);
  };

  // Sauvegarder une recherche
  const saveSearch = (searchQuery: string) => {
    if (!searchQuery || savedSearches.includes(searchQuery)) return;
    
    const newSavedSearches = [...savedSearches, searchQuery];
    setSavedSearches(newSavedSearches);
    localStorage.setItem('saved_searches', JSON.stringify(newSavedSearches));
  };

  // Supprimer une recherche sauvegardée
  const removeSavedSearch = (searchQuery: string) => {
    const newSavedSearches = savedSearches.filter(s => s !== searchQuery);
    setSavedSearches(newSavedSearches);
    localStorage.setItem('saved_searches', JSON.stringify(newSavedSearches));
  };

  // Effectuer une recherche lorsque le type ou la position change
  useEffect(() => {
    if (query.trim()) {
      const timer = setTimeout(() => {
        search();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [userLocation, language]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    search,
    resetSearch,
    searchHistory,
    savedSearches,
    saveSearch,
    removeSavedSearch
  };
};

export default useMapboxSearch;
