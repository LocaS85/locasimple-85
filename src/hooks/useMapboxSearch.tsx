
import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { mapboxService, SearchResult, SearchOptions } from '@/services/mapboxService';
import { toast } from 'sonner';

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

  // Lieux favoris
  const [favoritePlaces, setFavoritePlaces] = useState<SearchResult[]>(() => {
    try {
      const saved = localStorage.getItem('favorite_places');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Erreur lors du chargement des lieux favoris:', e);
      return [];
    }
  });

  // Effectuer la recherche
  const search = useCallback(async (searchQuery = query): Promise<SearchResult[]> => {
    if (!searchQuery.trim()) {
      console.log('Empty search query, clearing results');
      setResults([]);
      return [];
    }

    setLoading(true);
    setError(null);
    console.log(`Performing search for: "${searchQuery}"`);

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
        console.log(`Using user location for search proximity: ${userLocation}`);
      }

      const searchResults = await mapboxService.searchPlaces(options);
      console.log(`Search returned ${searchResults.length} results`);
      
      // Marquer les résultats qui sont des favoris
      const enhancedResults = searchResults.map(result => {
        const isFavorite = favoritePlaces.some(fp => fp.id === result.id);
        return { ...result, isFavorite };
      });
      
      setResults(enhancedResults);
      
      // Ajouter à l'historique si ce n'est pas déjà la dernière recherche
      if (searchQuery && (!searchHistory.length || searchHistory[0] !== searchQuery)) {
        const newHistory = [searchQuery, ...searchHistory.filter(s => s !== searchQuery)].slice(0, 10);
        setSearchHistory(newHistory);
        localStorage.setItem('search_history', JSON.stringify(newHistory));
      }
      
      return enhancedResults;
    } catch (err) {
      console.error('Erreur de recherche:', err);
      setError('Erreur lors de la recherche');
      setResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [query, limit, autocomplete, types, language, userLocation, searchHistory, favoritePlaces]);

  // Réinitialiser la recherche
  const resetSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  // Sauvegarder une recherche
  const saveSearch = useCallback((searchQuery: string) => {
    if (!searchQuery || savedSearches.includes(searchQuery)) return;
    
    const newSavedSearches = [...savedSearches, searchQuery];
    setSavedSearches(newSavedSearches);
    localStorage.setItem('saved_searches', JSON.stringify(newSavedSearches));
  }, [savedSearches]);

  // Supprimer une recherche sauvegardée
  const removeSavedSearch = useCallback((searchQuery: string) => {
    const newSavedSearches = savedSearches.filter(s => s !== searchQuery);
    setSavedSearches(newSavedSearches);
    localStorage.setItem('saved_searches', JSON.stringify(newSavedSearches));
  }, [savedSearches]);

  // Ajouter un lieu aux favoris
  const addFavoritePlace = useCallback((place: SearchResult) => {
    if (favoritePlaces.some(fp => fp.id === place.id)) return;
    
    const newFavorites = [...favoritePlaces, place];
    setFavoritePlaces(newFavorites);
    localStorage.setItem('favorite_places', JSON.stringify(newFavorites));
    
    // Mettre à jour le résultat dans les résultats actuels
    setResults(prev => prev.map(r => r.id === place.id ? { ...r, isFavorite: true } : r));
    
    toast.success(`${place.place_name} ajouté aux favoris`);
  }, [favoritePlaces]);

  // Supprimer un lieu des favoris
  const removeFavoritePlace = useCallback((placeId: string) => {
    const newFavorites = favoritePlaces.filter(fp => fp.id !== placeId);
    setFavoritePlaces(newFavorites);
    localStorage.setItem('favorite_places', JSON.stringify(newFavorites));
    
    // Mettre à jour le résultat dans les résultats actuels
    setResults(prev => prev.map(r => r.id === placeId ? { ...r, isFavorite: false } : r));
    
    toast.success(`Lieu retiré des favoris`);
  }, [favoritePlaces]);

  // Effectuer une recherche lorsque le type ou la position change
  useEffect(() => {
    if (query.trim()) {
      console.log('User location or language changed, updating search');
      const timer = setTimeout(() => {
        search();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [userLocation, language, search]);

  // Offrir une interface complète pour la gestion des recherches
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
    removeSavedSearch,
    favoritePlaces,
    addFavoritePlace,
    removeFavoritePlace
  };
};

export default useMapboxSearch;
