
import { useMemo } from 'react';
import type { Result } from '@/components/ResultsList';

export const useResultMapping = (searchResults: any[]) => {
  // Transform search results to places
  const places: Result[] = useMemo(() => {
    return searchResults.map((result: any, index: number) => ({
      id: result.id || `place-${index}`,
      name: result.name,
      latitude: result.lat,
      longitude: result.lon,
      distance: result.distance,
      duration: result.duration,
      address: result.place_name || '',
      category: result.category || '',
      color: index % 2 === 0 ? '#0EA5E9' : '#8B5CF6' // Alternate colors
    }));
  }, [searchResults]);

  return {
    places
  };
};

export default useResultMapping;
