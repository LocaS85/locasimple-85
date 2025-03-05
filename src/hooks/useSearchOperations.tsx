
import { useEffect } from 'react';
import { toast } from 'sonner';
import { generateFilteredMockResults } from '@/data/mockSearchResults';
import type { Result } from '@/components/ResultsList';
import { MAPBOX_TOKEN } from '@/config/environment';

interface UseSearchOperationsProps {
  searchState: {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedDistance: number | null;
    selectedDuration: number | null;
    distanceUnit: 'km' | 'miles';
    transportMode: string;
    userLocation: [number, number];
    resultsCount: number;
    isLocationActive: boolean;
    setIsLocationActive: (active: boolean) => void;
    setUserLocation: (location: [number, number]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    searchResults: Result[];
    setSearchResults: (results: Result[]) => void;
    selectedCategory: string | null;
    showRoutes: boolean;
    setShowRoutes: (show: boolean) => void;
    searchPerformed: boolean;
    setSearchPerformed: (performed: boolean) => void;
  };
  locationOperations: {
    handleLocationClick: () => void;
    searchAddress: (address: string) => Promise<void>;
  };
  resultSelection: {
    selectedResultId: string | undefined;
    setSelectedResultId: (id: string | undefined) => void;
  };
}

export const useSearchOperations = ({
  searchState,
  locationOperations,
  resultSelection
}: UseSearchOperationsProps) => {
  const {
    searchQuery,
    selectedDistance,
    selectedDuration,
    distanceUnit,
    transportMode,
    userLocation,
    resultsCount,
    isLocationActive,
    setIsLocationActive,
    setUserLocation,
    loading,
    setLoading,
    setSearchResults,
    selectedCategory,
    setShowRoutes,
    setSearchPerformed
  } = searchState;

  const { setSelectedResultId } = resultSelection;

  const handleSearchPress = async () => {
    if (searchQuery.trim() && !searchState.searchPerformed) {
      setLoading(true);
      await locationOperations.searchAddress(searchQuery);
      setLoading(false);
    }
    
    setSelectedResultId(undefined);
    
    handleSearch();
  };

  const searchPlacesNearLocation = async () => {
    if (!MAPBOX_TOKEN || !userLocation) {
      toast.error('Configuration manquante pour la recherche');
      return null;
    }

    setLoading(true);
    try {
      // Paramètres de proximité basés sur la position de l'utilisateur
      const proximity = `${userLocation[0]},${userLocation[1]}`;
      
      // Créer la requête Mapbox avec la recherche de POIs
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&proximity=${proximity}&types=poi&limit=${resultsCount}&language=fr`
      );
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        toast.info(`Aucun résultat pour "${searchQuery}" près de votre position`);
        return [];
      }
      
      // Transformer les résultats Mapbox en format Result
      const results: Result[] = await Promise.all(data.features.map(async (feature: any, index: number) => {
        // Calculer la distance et la durée (avec l'API Directions si possible)
        const coords = feature.center;
        let distance = 0;
        let duration = 0;
        
        try {
          const directionsResponse = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${userLocation[0]},${userLocation[1]};${coords[0]},${coords[1]}?access_token=${MAPBOX_TOKEN}`
          );
          
          if (directionsResponse.ok) {
            const directionsData = await directionsResponse.json();
            if (directionsData.routes && directionsData.routes.length > 0) {
              distance = directionsData.routes[0].distance / 1000; // en km
              duration = Math.round(directionsData.routes[0].duration / 60); // en minutes
            }
          }
        } catch (error) {
          console.error('Erreur lors du calcul de distance:', error);
          // Fallback: calcul de distance approximatif
          const R = 6371; // Rayon de la Terre en km
          const dLat = (coords[1] - userLocation[1]) * Math.PI / 180;
          const dLon = (coords[0] - userLocation[0]) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(userLocation[1] * Math.PI / 180) * Math.cos(coords[1] * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          distance = R * c;
          duration = Math.round(distance / 50 * 60); // Estimation basée sur 50 km/h
        }
        
        // Déterminer la catégorie en fonction des propriétés du point d'intérêt
        let category = 'autre';
        let color = 'blue';
        
        if (feature.properties && feature.properties.category) {
          category = feature.properties.category;
        } else if (feature.place_type && feature.place_type.length > 0) {
          const placeType = feature.place_type[0];
          if (placeType === 'poi') {
            // Essayer de déduire la catégorie à partir du contexte ou du nom
            const name = feature.text.toLowerCase();
            if (name.includes('restaurant') || name.includes('café') || name.includes('bar')) {
              category = 'restaurants';
              color = 'orange';
            } else if (name.includes('hotel') || name.includes('auberge')) {
              category = 'hébergements';
              color = 'purple';
            } else if (name.includes('magasin') || name.includes('boutique') || name.includes('store')) {
              category = 'commerces';
              color = 'green';
            }
          }
        }
        
        return {
          id: feature.id,
          name: feature.text || 'Lieu inconnu',
          address: feature.place_name || '',
          distance: distance,
          duration: duration,
          category: category,
          color: color,
          latitude: coords[1],
          longitude: coords[0],
          description: feature.properties?.description || '',
        };
      }));
      
      return results;
    } catch (error) {
      console.error('Erreur de recherche via Mapbox:', error);
      toast.error('Erreur lors de la recherche de lieux');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    console.log(`Recherche pour: ${searchQuery}`);
    console.log(`Filtres: Catégorie: ${selectedCategory}, Distance: ${selectedDistance}${distanceUnit}, Durée: ${selectedDuration}min, Transport: ${transportMode}`);
    console.log(`Position: ${userLocation}`);
    
    // Enable route display when search is performed
    setShowRoutes(true);
    setSearchPerformed(true);
    
    try {
      // Si la recherche n'est pas vide, utiliser l'API Mapbox pour des résultats réels
      if (searchQuery.trim()) {
        const mapboxResults = await searchPlacesNearLocation();
        
        if (mapboxResults) {
          // Filtrer les résultats selon les critères sélectionnés
          const filteredResults = mapboxResults.filter(result => {
            const matchesCategory = !selectedCategory || result.category === selectedCategory;
            const matchesDistance = !selectedDistance || result.distance <= selectedDistance;
            const matchesDuration = !selectedDuration || result.duration <= selectedDuration;
            return matchesCategory && matchesDistance && matchesDuration;
          });
          
          setSearchResults(filteredResults);
          
          if (filteredResults.length === 0) {
            toast.info('Aucun résultat ne correspond à vos critères. Essayez d\'ajuster vos filtres.');
          } else {
            toast.success(`${filteredResults.length} résultat${filteredResults.length > 1 ? 's' : ''} trouvé${filteredResults.length > 1 ? 's' : ''}`);
          }
          setLoading(false);
          return;
        }
      }
      
      // Fallback aux données mockées si l'API échoue ou si la recherche est vide
      setTimeout(() => {
        try {
          const mockResults = generateFilteredMockResults(
            searchQuery,
            userLocation,
            {
              category: selectedCategory || undefined,
              radius: selectedDistance,
              radiusUnit: distanceUnit,
              duration: selectedDuration,
              transportMode
            },
            resultsCount
          );
          
          setSearchResults(mockResults);
          
          if (mockResults.length === 0) {
            toast.info('Aucun résultat ne correspond à vos critères. Essayez d\'ajuster vos filtres.');
          } else {
            toast.success(`${mockResults.length} résultat${mockResults.length > 1 ? 's' : ''} trouvé${mockResults.length > 1 ? 's' : ''}`);
          }
        } catch (error) {
          console.error('Erreur lors de la recherche avec les données mockées:', error);
          toast.error('Une erreur s\'est produite lors de la recherche');
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      }, 1000);
    } catch (error) {
      console.error('Erreur globale de recherche:', error);
      toast.error('Une erreur s\'est produite lors de la recherche');
      setSearchResults([]);
      setLoading(false);
    }
  };

  // Initialize search results
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions && navigator.permissions.query({name: 'geolocation'})
        .then(permission => {
          if (permission.state === 'granted') {
            toast.info('Accès à la géolocalisation accordé');
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setUserLocation([position.coords.longitude, position.coords.latitude]);
                setIsLocationActive(true);
              },
              (error) => {
                console.error('Error getting location:', error);
              }
            );
          } else if (permission.state === 'prompt') {
            toast.info('Cliquez sur "Ma position" pour activer la géolocalisation');
          } else if (permission.state === 'denied') {
            toast.error('Accès à la géolocalisation refusé. Veuillez l\'activer dans vos paramètres');
          }
          
          permission.addEventListener('change', () => {
            if (permission.state === 'granted') {
              toast.success('Accès à la géolocalisation accordé');
            } else if (permission.state === 'denied') {
              toast.error('Accès à la géolocalisation refusé');
              setIsLocationActive(false);
            }
          });
        })
        .catch(error => {
          console.error('Error checking geolocation permission:', error);
        });
    }
    
    const initialResults = generateFilteredMockResults('', userLocation, {}, resultsCount);
    setSearchResults(initialResults);
  }, []);

  return {
    handleSearchPress,
    handleSearch
  };
};

export default useSearchOperations;
