
import { useCallback } from 'react';
import { toast } from 'sonner';
import { MAPBOX_TOKEN } from '@/config/environment';
import { SearchResult } from '@/services/mapboxService';

export const useSearchOperations = (
  searchQuery: string,
  transportMode: string,
  userLocation: [number, number],
  resultsCount: number,
  isLocationActive: boolean,
  setLoading: (loading: boolean) => void,
  setPlaces: (places: any[]) => void,
  setSearchHistory: (history: (prev: string[]) => string[]) => void,
  setSelectedPlaceId: (id: string | null) => void
) => {
  const performSearch = useCallback(async (query: string = searchQuery) => {
    if (!query.trim()) {
      toast.error('Veuillez entrer une recherche');
      return;
    }

    setLoading(true);
    try {
      // Add to search history
      setSearchHistory(prev => [query, ...prev.filter(q => q !== query)].slice(0, 10));
      
      // Connect to Flask API for search
      const response = await fetch(`http://localhost:5000/search?query=${encodeURIComponent(query)}&mode=${transportMode}&lat=${userLocation[1]}&lon=${userLocation[0]}&limit=${resultsCount}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }
      
      const results = await response.json();
      console.log('API search results:', results);
      
      // Transform to Place objects
      const places = results.map((result: any, index: number) => ({
        id: `place-${index}`,
        name: result.name,
        lat: result.lat,
        lon: result.lon,
        duration: result.duration,
        distance: result.distance
      }));
      
      setPlaces(places);
      
      if (places.length === 0) {
        toast.info('Aucun résultat trouvé');
      } else {
        toast.success(`${places.length} résultats trouvés`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Erreur lors de la recherche. Vérifiez que le serveur Flask est en cours d\'exécution.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, transportMode, userLocation, resultsCount, setLoading, setPlaces, setSearchHistory]);

  const generatePDF = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/generate_pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ places }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la génération du PDF');
      }
      
      const result = await response.json();
      toast.success('PDF généré avec succès');
      console.log('PDF result:', result);
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (place: any) => {
    setSelectedPlaceId(place.id);
    
    // Center map on selected place (this will be handled by the main hook)
    return place;
  };

  const resetSearch = () => {
    // This will be handled by the main hook
  };

  // This will be set from the main hook
  let places: any[] = [];

  return {
    performSearch,
    generatePDF,
    handleResultClick,
    resetSearch,
    _setData: (placesData: any[]) => {
      places = placesData;
    }
  };
};

export default useSearchOperations;
