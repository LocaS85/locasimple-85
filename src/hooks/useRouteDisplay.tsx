
import { useState, useEffect, useCallback } from 'react';
import { useMapboxRoutes, TransportMode } from '@/hooks/useMapboxRoutes';
import { Result } from '@/components/ResultsList';
import { toast } from 'sonner';

interface UseRouteDisplayProps {
  userLocation?: [number, number];
  searchResults: Result[];
  selectedResultId?: string;
  transportMode: string;
}

export const useRouteDisplay = ({
  userLocation,
  searchResults,
  selectedResultId,
  transportMode
}: UseRouteDisplayProps) => {
  const {
    from,
    setFrom,
    to,
    setTo,
    routes,
    activeMode,
    setActiveMode,
    calculateAllRoutes
  } = useMapboxRoutes();

  const [alternativeRoutes, setAlternativeRoutes] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [savedRoutes, setSavedRoutes] = useState<any[]>([]);

  // Update from/to coordinates when userLocation or selected result changes
  useEffect(() => {
    if (userLocation) {
      setFrom(userLocation);
    }
  }, [userLocation, setFrom]);

  useEffect(() => {
    if (selectedResultId) {
      const selectedResult = searchResults.find(
        r => r.id === selectedResultId
      );
      if (selectedResult) {
        setTo([selectedResult.longitude, selectedResult.latitude]);
      }
    }
  }, [selectedResultId, searchResults, setTo]);

  // Calculate routes when from and to are defined
  useEffect(() => {
    if (from && to && selectedResultId) {
      calculateAllRoutes();
    }
  }, [from, to, selectedResultId, transportMode, calculateAllRoutes]);

  // Get alternative routes
  const fetchAlternativeRoutes = useCallback(async () => {
    if (!from || !to) return;
    
    try {
      // Code to fetch alternative routes
      // In a real implementation, we would call Mapbox Directions API
      // with the alternatives=true parameter
      
      // For now, simulate with example data
      const mockAlternatives = [
        {
          id: 'alt-1',
          name: 'Itinéraire principal',
          distance: routes[activeMode].distance,
          duration: routes[activeMode].duration,
          description: 'Le plus rapide'
        },
        {
          id: 'alt-2',
          name: 'Itinéraire alternatif',
          distance: routes[activeMode].distance * 1.1, // Slightly longer
          duration: routes[activeMode].duration * 1.2,
          description: 'Moins de trafic'
        },
        {
          id: 'alt-3',
          name: 'Itinéraire économique',
          distance: routes[activeMode].distance * 1.05,
          duration: routes[activeMode].duration * 1.15,
          description: 'Sans péage'
        }
      ];
      
      setAlternativeRoutes(mockAlternatives);
      setSelectedRoute(mockAlternatives[0]);
    } catch (error) {
      console.error('Error fetching alternative routes:', error);
      toast.error('Impossible de récupérer les itinéraires alternatifs');
    }
  }, [from, to, routes, activeMode]);

  // Load alternative routes when a route is calculated
  useEffect(() => {
    if (routes[activeMode]?.geometry && from && to) {
      fetchAlternativeRoutes();
    }
  }, [routes, activeMode, from, to, fetchAlternativeRoutes]);

  // Function to save a route
  const saveRoute = useCallback((route: any, mode: string) => {
    const selectedResult = searchResults.find(r => r.id === selectedResultId);
    if (!selectedResult) return;
    
    const savedRoute = {
      id: `saved-${Date.now()}`,
      destination: selectedResult.name,
      mode,
      distance: route.distance,
      duration: route.duration,
      start: from,
      end: to,
      date: new Date().toISOString()
    };
    
    setSavedRoutes(prev => {
      const newSavedRoutes = [...prev, savedRoute];
      // Store in localStorage
      try {
        localStorage.setItem('saved_routes', JSON.stringify(newSavedRoutes));
      } catch (error) {
        console.error('Error saving routes:', error);
      }
      return newSavedRoutes;
    });
    
    toast.success(`Itinéraire vers ${selectedResult.name} enregistré`);
  }, [from, to, selectedResultId, searchResults]);

  // Load saved routes from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('saved_routes');
      if (saved) {
        setSavedRoutes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved routes:', error);
    }
  }, []);

  return {
    from,
    to,
    routes,
    activeMode,
    setActiveMode,
    alternativeRoutes,
    selectedRoute,
    setSelectedRoute,
    saveRoute,
    savedRoutes
  };
};

export default useRouteDisplay;
