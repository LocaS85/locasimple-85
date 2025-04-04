
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { MAPBOX_TOKEN, API_BASE_URL } from '@/config/environment';
import type { Result } from '@/components/ResultsList';

export const useSearchPageStateManager = () => {
  // Basic state
  const [searchQuery, setSearchQuery] = useState('');
  const [resultsCount, setResultsCount] = useState(3);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [transportMode, setTransportMode] = useState('driving');
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]); // Paris by default
  const [isLocationActive, setIsLocationActive] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 12
  });
  const [showRoutes, setShowRoutes] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNoMapboxTokenWarning, setShowNoMapboxTokenWarning] = useState(!MAPBOX_TOKEN);
  
  // Transform search results to places
  const places: Result[] = searchResults.map((result: any, index: number) => ({
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

  // Handler functions
  const handleLocationClick = useCallback(() => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
        setViewport({
          latitude,
          longitude,
          zoom: 14
        });
        setIsLocationActive(true);
        setLoading(false);
        toast.success('Position actuelle détectée');
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
        toast.error('Impossible de récupérer votre position');
        setLoading(false);
        setIsLocationActive(false);
      }
    );
  }, []);

  const handleCategoryToggle = useCallback((category: string) => {
    setSelectedCategory(prev => prev === category ? null : category);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    toast.info('Tous les filtres ont été effacés');
  }, []);

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
  }, [searchQuery, transportMode, userLocation, resultsCount, selectedCategory]);

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
  }, [userLocation, resultsCount, selectedCategory]);

  const handleResultClick = useCallback((place: any) => {
    setSelectedPlaceId(place.id);
    setPopupInfo(place);
    setViewport({
      latitude: place.lat,
      longitude: place.lon,
      zoom: 14
    });
  }, []);

  const generatePDF = useCallback(async () => {
    if (places.length === 0) {
      toast.error('Aucun résultat à exporter');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/generate_pdf`, { places });
      toast.success('PDF généré avec succès');
      
      window.open('resultats.pdf');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setLoading(false);
    }
  }, [places]);

  const toggleRoutes = useCallback(() => {
    setShowRoutes(prev => !prev);
  }, []);

  const resetSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  // Check Flask server connection on component mount
  useEffect(() => {
    const checkFlaskServer = async () => {
      try {
        await axios.get(`${API_BASE_URL}/search`, { 
          params: { query: 'test', mode: 'driving', lat: 48.8566, lon: 2.3522, limit: 1 },
          timeout: 2000
        });
        console.log('Flask server is running');
      } catch (error) {
        console.warn('Flask server is not running:', error);
        toast.warning('Le serveur Flask n\'est pas démarré. Certaines fonctionnalités peuvent ne pas fonctionner.');
      }
    };
    
    checkFlaskServer();
    handleLocationClick();
  }, [handleLocationClick]);

  return {
    // State values
    searchQuery,
    setSearchQuery,
    resultsCount,
    setResultsCount,
    searchResults,
    setSearchResults,
    loading,
    transportMode,
    setTransportMode,
    userLocation,
    isLocationActive,
    selectedPlaceId,
    popupInfo,
    viewport,
    showRoutes,
    selectedCategory,
    setSelectedCategory,
    showNoMapboxTokenWarning,
    setShowNoMapboxTokenWarning,
    places,
    
    // Handlers
    handleLocationClick,
    handleCategoryToggle,
    clearFilters,
    performSearch,
    handleResultClick,
    generatePDF,
    toggleRoutes,
    resetSearch
  };
};

export default useSearchPageStateManager;
