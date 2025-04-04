
import { useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { MAPBOX_TOKEN, API_BASE_URL } from '@/config/environment';

export const useSearchOperations = (
  searchQuery: string,
  transportMode: string,
  userLocation: [number, number],
  resultsCount: number,
  selectedCategory: string | null,
  setSearchResults: (results: any[]) => void,
  setLoading: (loading: boolean) => void,
  setViewport: (viewport: any) => void,
  setShowNoMapboxTokenWarning: (show: boolean) => void
) => {
  const performSearch = useCallback(async (query: string = searchQuery) => {
    if (!query.trim() && !selectedCategory) {
      toast.error('Veuillez entrer un terme de recherche ou sélectionner une catégorie');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: {
          query: query.trim() || 'places',
          mode: transportMode,
          lat: userLocation[1],
          lon: userLocation[0],
          limit: resultsCount,
          category: selectedCategory
        }
      });

      if (response.data && response.data.length > 0) {
        setSearchResults(response.data);
        
        setViewport({
          latitude: response.data[0].lat,
          longitude: response.data[0].lon,
          zoom: 13
        });
        
        toast.success(`${response.data.length} résultats trouvés`);
      } else {
        setSearchResults([]);
        toast.info('Aucun résultat trouvé');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast.error('Erreur lors de la recherche. Vérifiez que le serveur Flask est démarré.');
      
      try {
        await searchWithMapbox(query);
      } catch (mapboxError) {
        console.error('Erreur lors de la recherche avec Mapbox:', mapboxError);
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery, transportMode, userLocation, resultsCount, selectedCategory, setSearchResults, setLoading, setViewport]);

  const searchWithMapbox = useCallback(async (query: string) => {
    if (!MAPBOX_TOKEN) {
      toast.error('Token Mapbox manquant');
      setShowNoMapboxTokenWarning(true);
      return;
    }

    try {
      let mapboxQuery = query.trim();
      if (!mapboxQuery && selectedCategory) {
        mapboxQuery = selectedCategory;
      }

      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(mapboxQuery)}.json`,
        {
          params: {
            access_token: MAPBOX_TOKEN,
            proximity: `${userLocation[0]},${userLocation[1]}`,
            types: 'poi',
            limit: resultsCount,
            language: 'fr'
          }
        }
      );

      if (response.data && response.data.features.length > 0) {
        const formattedResults = response.data.features.map((feature: any) => ({
          id: feature.id,
          name: feature.text,
          lat: feature.center[1],
          lon: feature.center[0],
          place_name: feature.place_name,
          category: feature.properties?.category || selectedCategory || '',
          distance: 0,
          duration: 0
        }));

        setSearchResults(formattedResults);
        
        setViewport({
          latitude: formattedResults[0].lat,
          longitude: formattedResults[0].lon,
          zoom: 13
        });
        
        toast.success(`${formattedResults.length} résultats trouvés (via Mapbox)`);
      } else {
        setSearchResults([]);
        toast.info('Aucun résultat trouvé');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche avec Mapbox:', error);
      toast.error('Erreur lors de la recherche avec Mapbox');
      setSearchResults([]);
    }
  }, [userLocation, resultsCount, selectedCategory, setSearchResults, setViewport, setShowNoMapboxTokenWarning]);

  const resetSearch = useCallback(() => {
    setSearchResults([]);
  }, [setSearchResults]);

  return {
    performSearch,
    searchWithMapbox,
    resetSearch
  };
};

export default useSearchOperations;
