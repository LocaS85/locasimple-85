
import { useState, useCallback } from 'react';
import type { Result } from '@/components/ResultsList';

export const useResultHandling = (
  setSelectedPlace: (place: Result | null) => void,
  setViewport: (viewport: any) => void,
  setRouteDisplayed: (displayed: boolean) => void
) => {
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  
  const handleResultClick = useCallback((result: Result) => {
    setSelectedResult(result);
    setSelectedPlace(result);
    
    if (result) {
      setViewport({
        latitude: result.latitude,
        longitude: result.longitude,
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
  
  const generatePDF = useCallback(() => {
    // Implementation would go here in a real app
    console.log('Generating PDF for', selectedResult);
  }, [selectedResult]);

  const toggleRoutes = useCallback(() => {
    // Fix: Pass boolean directly instead of a function
    setRouteDisplayed(!selectedResult ? false : true);
  }, [selectedResult, setRouteDisplayed]);
  
  return {
    selectedResult,
    handleResultClick,
    clearSelection,
    generatePDF,
    toggleRoutes
  };
};

export default useResultHandling;
