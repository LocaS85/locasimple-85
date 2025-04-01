
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import categoryService from '@/services/categoryService';
import searchResultsService, { SearchResult } from '@/services/searchResultsService';

interface UseSearchProps {
  initialCategory?: string | null;
  initialQuery?: string;
}

export const useSearch = ({ initialCategory = null, initialQuery = '' }: UseSearchProps = {}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryParam = searchParams.get('category');
  const queryParam = searchParams.get('query');
  
  const [searchQuery, setSearchQuery] = useState(queryParam || initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam || initialCategory);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'time' | 'rating'>('distance');
  
  const performSearch = useCallback(async (query: string = searchQuery, category: string | null = selectedCategory) => {
    setLoading(true);
    
    try {
      if (query.trim()) {
        const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        if (!recentSearches.includes(query)) {
          recentSearches.unshift(query);
          if (recentSearches.length > 10) recentSearches.pop();
        }
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
      }
      
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (query) params.set('query', query);
      setSearchParams(params);
      
      const searchResults = await fetchSearchResults(query, category, sortBy);
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        toast.info('No results found');
      } else if (category) {
        toast.success(`Found ${searchResults.length} ${category} results`);
      } else {
        toast.success(`Found ${searchResults.length} results`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('An error occurred while searching');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, sortBy, setSearchParams]);
  
  const fetchSearchResults = async (query: string, category: string | null, sortBy: string) => {
    const results = await searchResultsService.getMockResults(query);
    
    let filteredResults = results;
    if (query) {
      filteredResults = results.filter(result => 
        result.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (category) {
      filteredResults = filteredResults.filter(result => 
        result.category === category
      );
    }
    
    // Add type assertion for sorting
    if (sortBy === 'distance') {
      filteredResults.sort((a, b) => parseFloat(a.distance as string) - parseFloat(b.distance as string));
    } else if (sortBy === 'time') {
      filteredResults.sort((a, b) => parseFloat(a.time as string) - parseFloat(b.time as string));
    } else if (sortBy === 'rating') {
      filteredResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    
    return filteredResults;
  };
  
  const handleCategoryToggle = useCallback((category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      performSearch(searchQuery, null);
    } else {
      setSelectedCategory(category);
      performSearch(searchQuery, category);
    }
  }, [selectedCategory, searchQuery, performSearch]);
  
  const handleSearch = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    performSearch();
  }, [performSearch]);
  
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    performSearch('', selectedCategory);
  }, [selectedCategory, performSearch]);
  
  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    setSearchQuery('');
    performSearch('', null);
  }, [performSearch]);
  
  const navigateToCategorySearch = useCallback((categoryType: string) => {
    categoryService.navigateToSearch(navigate, categoryType);
  }, [navigate]);
  
  useEffect(() => {
    if (categoryParam !== selectedCategory || queryParam !== searchQuery) {
      setSelectedCategory(categoryParam);
      setSearchQuery(queryParam || '');
      performSearch(queryParam || '', categoryParam);
    }
  }, [categoryParam, queryParam]);
  
  const getRecentSearches = () => {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]');
  };
  
  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    results,
    loading,
    sortBy, 
    setSortBy,
    
    performSearch,
    handleCategoryToggle,
    handleSearch,
    clearSearch,
    clearFilters,
    navigateToCategorySearch,
    
    recentSearches: getRecentSearches(),
    categoryFilters: categoryService.getCategoryFilters(),
    mainCategoryTypes: categoryService.getMainCategoryTypes()
  };
};

export default useSearch;
