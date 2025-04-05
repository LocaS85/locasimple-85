
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocationHandling } from './search/useLocationHandling';
import { useSearchOperations } from './search/useSearchOperations';
import { useResultHandling } from './search/useResultHandling';
import { useResultMapping } from './search/useResultMapping';
import { useInitialization } from './search/useInitialization';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

export const useSearchPageState = () => {
  // State for search parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [transportMode, setTransportMode] = useState('driving');
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // State for search results and UI
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNoMapboxTokenWarning, setShowNoMapboxTokenWarning] = useState(false);
  const [isLocationActive, setIsLocationActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 12
  });
  const [routeDisplayed, setRouteDisplayed] = useState(false);
  const [resultsCount, setResultsCount] = useState(5);

  // Router hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Extract search params from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    const category = searchParams.get('category');
    
    if (query) setSearchQuery(query);
    if (category) setSelectedCategory(category);
    
  }, [location.search]);

  // Custom hooks
  const { places } = useResultMapping(searchResults);
  
  const { handleLocationClick } = useLocationHandling(
    setLoading,
    setUserLocation,
    setViewport,
    setIsLocationActive
  );
  
  const { 
    performSearch, 
    searchWithMapbox, 
    resetSearch 
  } = useSearchOperations(
    searchQuery,
    transportMode,
    userLocation,
    resultsCount,
    selectedCategory,
    setSearchResults,
    setLoading,
    setViewport,
    setShowNoMapboxTokenWarning
  );
  
  const { 
    selectedResult, 
    handleResultClick, 
    clearSelection 
  } = useResultHandling(
    setSelectedPlace,
    setViewport,
    setRouteDisplayed
  );
  
  useInitialization(
    handleLocationClick,
    setShowNoMapboxTokenWarning
  );

  // Effect to trigger search when category is selected from URL
  useEffect(() => {
    if (selectedCategory) {
      performSearch();
    }
  }, [selectedCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Update URL parameters
    const searchParams = new URLSearchParams();
    if (query) searchParams.set('query', query);
    if (selectedCategory) searchParams.set('category', selectedCategory);
    
    navigate(`/search?${searchParams.toString()}`);
    performSearch(query);
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const handleTransportModeChange = (mode: string) => {
    setTransportMode(mode);
    if (selectedResult) {
      performSearch();
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(prevCategory => 
      prevCategory === categoryId ? null : categoryId
    );
    
    // Update URL with the selected category
    const searchParams = new URLSearchParams(location.search);
    if (categoryId && categoryId !== selectedCategory) {
      searchParams.set('category', categoryId);
    } else {
      searchParams.delete('category');
    }
    
    navigate(`/search?${searchParams.toString()}`);
    performSearch();
  };

  return {
    // Search state
    searchQuery,
    setSearchQuery,
    transportMode,
    selectedCategory,
    loading,
    showNoMapboxTokenWarning,
    isLocationActive,
    menuOpen,
    places,
    viewport,
    setViewport,
    routeDisplayed,
    resultsCount,
    setResultsCount,
    
    // Actions and handlers
    handleSearch,
    handleLocationClick,
    toggleMenu,
    handleTransportModeChange,
    handleCategorySelect,
    handleResultClick,
    clearSelection,
    
    // API methods
    searchOperations: {
      performSearch,
      searchWithMapbox,
      resetSearch
    }
  };
};

export default useSearchPageState;
