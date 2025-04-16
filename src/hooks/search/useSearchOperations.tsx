
import { useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { MAPBOX_TOKEN, API_BASE_URL } from '@/config/environment';
import { Result } from '@/components/ResultsList';

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
      // First try to use the local API if available
      if (API_BASE_URL) {
        try {
          const response = await axios.get(`${API_BASE_URL}/search`, {
            params: {
              query: query.trim() || 'places',
              mode: transportMode,
              lat: userLocation[1],
              lon: userLocation[0],
              limit: resultsCount,
              category: selectedCategory
            },
            timeout: 3000 // 3 second timeout for faster fallback
          });

          if (response.data && response.data.length > 0) {
            setSearchResults(response.data);
            
            setViewport({
              latitude: response.data[0].lat || response.data[0].latitude,
              longitude: response.data[0].lon || response.data[0].longitude,
              zoom: 13
            });
            
            toast.success(`${response.data.length} résultats trouvés`);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.warn('Local API search failed, falling back to Mapbox:', error);
        }
      }

      // Fallback to Mapbox API
      await searchWithMapbox(query);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast.error('Erreur lors de la recherche');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, transportMode, userLocation, resultsCount, selectedCategory, setSearchResults, setLoading, setViewport]);

  const searchWithMapbox = useCallback(async (query: string) => {
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN.trim().length === 0) {
      toast.error('Token Mapbox manquant');
      setShowNoMapboxTokenWarning(true);
      return;
    }

    try {
      let mapboxQuery = query.trim();
      if (!mapboxQuery && selectedCategory) {
        mapboxQuery = selectedCategory;
      }

      const searchParams = {
        access_token: MAPBOX_TOKEN,
        proximity: `${userLocation[0]},${userLocation[1]}`,
        limit: resultsCount,
        language: 'fr'
      };

      // Add category filter if selected
      if (selectedCategory) {
        // Convert category name to appropriate search term
        // This can be improved with a more comprehensive mapping
        searchParams["types"] = "poi";
      }

      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(mapboxQuery)}.json`,
        { params: searchParams }
      );

      if (response.data && response.data.features && response.data.features.length > 0) {
        // Transform mapbox results to our format
        const formattedResults: Result[] = response.data.features.map((feature: any, index: number) => {
          const distance = calculateDistance(
            userLocation[1], userLocation[0], 
            feature.center[1], feature.center[0]
          );
          
          const duration = estimateDuration(distance, transportMode);
          
          return {
            id: feature.id || `result-${index}`,
            name: feature.text || feature.place_name,
            address: feature.place_name,
            category: feature.properties?.category || selectedCategory || '',
            latitude: feature.center[1],
            longitude: feature.center[0],
            distance: parseFloat((distance / 1000).toFixed(1)), // Convert to km
            duration: Math.round(duration / 60), // Convert to minutes
            color: getCategoryColor(feature.properties?.category || selectedCategory || '')
          };
        });

        setSearchResults(formattedResults);
        
        if (formattedResults.length > 0) {
          setViewport({
            latitude: formattedResults[0].latitude,
            longitude: formattedResults[0].longitude,
            zoom: 13
          });
        }
        
        toast.success(`${formattedResults.length} résultats trouvés via Mapbox`);
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

  // Utility functions for distance and duration calculations
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const estimateDuration = (distanceInMeters: number, mode: string): number => {
    // Average speeds in meters per second
    const speeds: Record<string, number> = {
      'driving': 13.9, // 50 km/h
      'walking': 1.4,  // 5 km/h
      'cycling': 4.2,  // 15 km/h
      'transit': 8.3   // 30 km/h
    };

    const speed = speeds[mode] || speeds.driving;
    return distanceInMeters / speed; // Duration in seconds
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'restaurants': '#FF5252',
      'shopping': '#448AFF',
      'entertainment': '#7C4DFF',
      'health': '#4CAF50',
      'services': '#FF9800',
      'transport': '#795548'
    };

    // Simple category matching (can be improved)
    if (category.toLowerCase().includes('restaurant') || category.toLowerCase().includes('food')) 
      return colors.restaurants;
    if (category.toLowerCase().includes('shop') || category.toLowerCase().includes('store')) 
      return colors.shopping;
    if (category.toLowerCase().includes('entertainment') || category.toLowerCase().includes('theater')) 
      return colors.entertainment;
    if (category.toLowerCase().includes('health') || category.toLowerCase().includes('doctor')) 
      return colors.health;
    if (category.toLowerCase().includes('service') || category.toLowerCase().includes('bank')) 
      return colors.services;
    if (category.toLowerCase().includes('transport') || category.toLowerCase().includes('station')) 
      return colors.transport;

    // Default color
    return '#9E9E9E';
  };

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
