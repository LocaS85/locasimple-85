
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
  
  // Get URL parameters
  const categoryParam = searchParams.get('category');
  const queryParam = searchParams.get('query');
  
  // State
  const [searchQuery, setSearchQuery] = useState(queryParam || initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam || initialCategory);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'time' | 'rating'>('distance');
  
  // Search function
  const performSearch = useCallback(async (query: string = searchQuery, category: string | null = selectedCategory) => {
    setLoading(true);
    
    try {
      // Record the search
      if (query.trim()) {
        // Store recent search in local storage instead of using a non-existent method
        const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        if (!recentSearches.includes(query)) {
          recentSearches.unshift(query);
          if (recentSearches.length > 10) recentSearches.pop(); // Keep only 10 recent searches
        }
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
      }
      
      // Update URL parameters
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (query) params.set('query', query);
      setSearchParams(params);
      
      // Get search results
      // Using the mock data service instead of a non-existent search method
      const searchResults = await fetchSearchResults(query, category, sortBy);
      setResults(searchResults);
      
      // Show toast with results count
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
  
  // Mock search function that uses the available service methods
  const fetchSearchResults = async (query: string, category: string | null, sortBy: string) => {
    // Using the getMockSearchResults method instead since 'search' doesn't exist
    const results = await searchResultsService.getMockSearchResults();
    
    // Filter by query if provided
    let filteredResults = results;
    if (query) {
      filteredResults = results.filter(result => 
        result.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filter by category if provided
    if (category) {
      filteredResults = filteredResults.filter(result => 
        result.category === category
      );
    }
    
    // Sort results
    if (sortBy === 'distance') {
      filteredResults.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (sortBy === 'time') {
      filteredResults.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
    } else if (sortBy === 'rating') {
      filteredResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    
    return filteredResults;
  };
  
  // Handle category toggle
  const handleCategoryToggle = useCallback((category: string) => {
    // If already selected, deselect it
    if (selectedCategory === category) {
      setSelectedCategory(null);
      performSearch(searchQuery, null);
    } else {
      // Otherwise select it
      setSelectedCategory(category);
      performSearch(searchQuery, category);
    }
  }, [selectedCategory, searchQuery, performSearch]);
  
  // Handle search submission
  const handleSearch = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    performSearch();
  }, [performSearch]);
  
  // Clear search query
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    performSearch('', selectedCategory);
  }, [selectedCategory, performSearch]);
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    setSearchQuery('');
    performSearch('', null);
  }, [performSearch]);
  
  // Navigate to category search
  const navigateToCategorySearch = useCallback((categoryType: string) => {
    categoryService.navigateToSearch(navigate, categoryType);
  }, [navigate]);
  
  // Initialize search on mount and when URL parameters change
  useEffect(() => {
    if (categoryParam !== selectedCategory || queryParam !== searchQuery) {
      // Only update if there's a change to avoid infinite loop
      setSelectedCategory(categoryParam);
      setSearchQuery(queryParam || '');
      performSearch(queryParam || '', categoryParam);
    }
  }, [categoryParam, queryParam]);
  
  // Get recent searches from localStorage
  const getRecentSearches = () => {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]');
  };
  
  return {
    // State
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    results,
    loading,
    sortBy, 
    setSortBy,
    
    // Actions
    performSearch,
    handleCategoryToggle,
    handleSearch,
    clearSearch,
    clearFilters,
    navigateToCategorySearch,
    
    // Data
    recentSearches: getRecentSearches(),
    categoryFilters: categoryService.getCategoryFilters(),
    mainCategoryTypes: categoryService.getMainCategoryTypes()
  };
};

export default useSearch;
