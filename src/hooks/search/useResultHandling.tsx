
import { useState, useCallback } from 'react';
import type { Result } from '@/components/ResultsList';

export const useResultHandling = (
  setSelectedPlace: (place: Result | null) => void,
  setViewport: (viewport: any) => void,
  setRouteDisplayed: (displayed: boolean) => void
) => {
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  
  const handleResultClick = useCallback((place: Result) => {
    setSelectedResult(place);
    setSelectedPlace(place);
    
    if (place) {
      setViewport({
        latitude: place.latitude,
        longitude: place.longitude,
        zoom: 14
      });
    }
    
    setRouteDisplayed(true);
  }, [setSelectedPlace, setViewport, setRouteDisplayed]);
  
  const clearSelection = useCallback(() => {
    setSelectedResult(null);
    setSelectedPlace(null);
    setRouteDisplayed(false);
  }, [setSelectedPlace, setRouteDisplayed]);
  
  return {
    selectedResult,
    handleResultClick,
    clearSelection
  };
};

export default useResultHandling;
