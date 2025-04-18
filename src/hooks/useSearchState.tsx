
import { useState } from 'react';
import { DistanceUnit } from '@/types/categoryTypes';

export const useSearchState = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('km');
  const [transportMode, setTransportMode] = useState('driving');
  const [resultsCount, setResultsCount] = useState(5);
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]);
  const [isLocationActive, setIsLocationActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [origin, setOrigin] = useState<any>(null);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'split'>('map');
  const [filters, setFilters] = useState({
    radius: 5,
    categories: [] as string[],
    transport: 'driving'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const resetMapState = () => {
    setIsLoading(false);
    setSearchResults([]);
    setSelectedCategory(null);
    setShowRoutes(false);
    setSearchPerformed(false);
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedDistance,
    setSelectedDistance,
    selectedDuration,
    setSelectedDuration,
    distanceUnit,
    setDistanceUnit,
    transportMode,
    setTransportMode,
    resultsCount,
    setResultsCount,
    userLocation,
    setUserLocation,
    isLocationActive,
    setIsLocationActive,
    loading,
    setLoading,
    searchResults,
    setSearchResults,
    selectedCategory,
    setSelectedCategory,
    showRoutes,
    setShowRoutes,
    searchPerformed,
    setSearchPerformed,
    handleSearchChange,
    origin,
    setOrigin,
    destinations,
    setDestinations,
    viewMode,
    setViewMode,
    filters,
    updateFilters,
    isLoading,
    setIsLoading,
    resetMapState
  };
};

export default useSearchState;
