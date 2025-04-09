
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

// Define interface for geopoints
export interface GeoPoint {
  type: string;
  name: string;
  coordinates: [number, number];
  properties?: any;
}

// Define interface for the SearchState
export interface SearchState {
  origin: GeoPoint | null;
  destinations: GeoPoint[];
  filters: {
    radius: number;
    categories: string[];
    transport: string;
  };
  results: any[];
  viewMode: 'map' | 'list' | 'split';
}

export const useSearchState = () => {
  const [origin, setOrigin] = useState<GeoPoint | null>(null);
  const [destinations, setDestinations] = useState<GeoPoint[]>([]);
  const [filters, setFilters] = useState({
    radius: 5,
    categories: [],
    transport: 'driving'
  });
  const [results, setResults] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'split'>('map');
  const [isLoading, setIsLoading] = useState(false);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Add a destination
  const addDestination = useCallback((destination: GeoPoint) => {
    setDestinations(prev => [...prev, destination]);
  }, []);

  // Remove a destination
  const removeDestination = useCallback((index: number) => {
    setDestinations(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Clear all destinations
  const clearDestinations = useCallback(() => {
    setDestinations([]);
  }, []);

  // Reset map state (for error recovery)
  const resetMapState = useCallback(() => {
    setIsLoading(true);
    
    // Simulating map reset/reload
    setTimeout(() => {
      toast.success('Carte réinitialisée');
      setIsLoading(false);
    }, 1000);
  }, []);

  // Perform search with current parameters
  const performSearch = useCallback(() => {
    if (!origin) {
      toast.error('Veuillez définir un point de départ');
      return;
    }

    setIsLoading(true);

    // Simulate an API call
    setTimeout(() => {
      // Mock results
      const mockResults = Array(5).fill(0).map((_, i) => ({
        id: `result-${i}`,
        name: `Lieu ${i + 1}`,
        category: ['restaurant', 'shop', 'attraction', 'service', 'transport'][i % 5],
        distance: Math.round((Math.random() * filters.radius * 1000)) / 1000,
        duration: Math.round(Math.random() * 60),
        coordinates: [
          origin.coordinates[0] + (Math.random() - 0.5) * 0.02,
          origin.coordinates[1] + (Math.random() - 0.5) * 0.02
        ],
        rating: Math.round(Math.random() * 50) / 10
      }));

      setResults(mockResults);
      setIsLoading(false);
      
      if (mockResults.length === 0) {
        toast.info('Aucun résultat trouvé');
      } else {
        toast.success(`${mockResults.length} résultats trouvés`);
      }
    }, 1500);
  }, [origin, filters]);

  return {
    // State
    origin,
    setOrigin,
    destinations,
    filters,
    results,
    viewMode,
    isLoading,
    
    // Methods
    setViewMode,
    updateFilters,
    addDestination,
    removeDestination,
    clearDestinations,
    resetMapState,
    performSearch,
    setResults
  };
};

export default useSearchState;
