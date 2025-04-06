
import { useMemo } from 'react';
import { Result } from '@/components/ResultsList';

/**
 * Hook pour convertir les résultats de recherche en format utilisable par les marqueurs de carte
 */
export const useResultMapping = (searchResults: Result[]) => {
  const places = useMemo(() => {
    return searchResults.map(result => ({
      id: result.id,
      name: result.name || 'Sans nom',
      lat: result.latitude,
      lon: result.longitude,
      address: result.address || '',
      category: result.category || '',
      distance: result.distance,
      duration: result.duration
    }));
  }, [searchResults]);

  return { places };
};

export default useResultMapping;
