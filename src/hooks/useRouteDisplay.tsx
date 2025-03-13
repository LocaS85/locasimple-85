
import { useState, useEffect } from 'react';
import { useMapboxRoutes, TransportMode } from '@/hooks/useMapboxRoutes';
import { Result } from '@/components/ResultsList';

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

  return {
    from,
    to,
    routes,
    activeMode,
    setActiveMode
  };
};

export default useRouteDisplay;
