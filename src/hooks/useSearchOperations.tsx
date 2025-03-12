
// This component is 310 lines long, so I will only update the critical parts to fix loading errors

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
      try {
        await locationOperations.searchAddress(searchQuery);
      } catch (error) {
        console.error("Error during address search:", error);
        toast.error("Erreur lors de la recherche d'adresse");
      } finally {
        setLoading(false);
      }
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
      
      // Transform results with proper error handling
      const results: Result[] = await Promise.all(
        data.features.map(async (feature: any, index: number) => {
          // Default values to ensure we always return a valid Result
          const defaultResult: Result = {
            id: feature.id || `result-${index}`,
            name: feature.text || feature.place_name?.split(',')[0] || 'Lieu inconnu',
            address: feature.place_name || '',
            distance: 0,
            duration: 0,
            category: 'autre',
            color: 'blue',
            latitude: feature.center[1],
            longitude: feature.center[0],
            description: feature.properties?.description || '',
          };
          
          try {
            // Calculate distance and duration if possible
            if (userLocation && feature.center) {
              const [lon, lat] = feature.center;
              
              try {
                const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${userLocation[0]},${userLocation[1]};${lon},${lat}?access_token=${MAPBOX_TOKEN}`;
                const directionsResponse = await fetch(directionsUrl);
                
                if (directionsResponse.ok) {
                  const directionsData = await directionsResponse.json();
                  if (directionsData.routes && directionsData.routes.length > 0) {
                    defaultResult.distance = (directionsData.routes[0].distance / 1000) || 0; // km
                    defaultResult.duration = Math.round(directionsData.routes[0].duration / 60) || 0; // minutes
                  }
                }
              } catch (directionError) {
                console.error('Direction calculation error:', directionError);
                // Fallback to approximate calculation
                const R = 6371; // Earth radius in km
                const dLat = (lat - userLocation[1]) * Math.PI / 180;
                const dLon = (lon - userLocation[0]) * Math.PI / 180;
                const a = 
                  Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(userLocation[1] * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                defaultResult.distance = R * c;
                defaultResult.duration = Math.round(defaultResult.distance / 50 * 60); // Estimate based on 50 km/h
              }
            }

            // Determine category and color
            if (feature.properties && feature.properties.category) {
              defaultResult.category = feature.properties.category;
            } else {
              // Try to infer category from name
              const name = defaultResult.name.toLowerCase();
              if (name.includes('restaurant') || name.includes('café') || name.includes('bar')) {
                defaultResult.category = 'restaurants';
                defaultResult.color = 'orange';
              } else if (name.includes('hotel') || name.includes('auberge')) {
                defaultResult.category = 'hébergements';
                defaultResult.color = 'purple';
              } else if (name.includes('magasin') || name.includes('boutique') || name.includes('store')) {
                defaultResult.category = 'commerces';
                defaultResult.color = 'green';
              }
            }
            
            return defaultResult;
          } catch (error) {
            console.error('Error processing search result:', error);
            return defaultResult;
          }
        })
      );
      
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
      // Handle empty search query gracefully
      if (!searchQuery.trim()) {
        toast.info('Veuillez saisir un terme de recherche');
        setLoading(false);
        return;
      }

      // Use Mapbox for real results
      const mapboxResults = await searchPlacesNearLocation();
      
      if (mapboxResults) {
        // Filter results according to selected criteria
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
      
      // Fallback to mock data if Mapbox fails
      toast.info('Utilisation de données simulées (API indisponible)');
      
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
            toast.info('Aucun résultat ne correspond à vos critères.');
          } else {
            toast.success(`${mockResults.length} résultat${mockResults.length > 1 ? 's' : ''} trouvé${mockResults.length > 1 ? 's' : ''}`);
          }
        } catch (error) {
          console.error('Erreur avec les données simulées:', error);
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
