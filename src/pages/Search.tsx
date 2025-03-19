
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Search as SearchIcon, MapPin, Navigation, X, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MAPBOX_TOKEN } from '@/config/environment';

// Configuration de l'API Mapbox
mapboxgl.accessToken = MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN';

const Search = () => {
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const suggestionListRef = useRef(null);
  const searchInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['restaurant', 'grocery', 'pharmacy']);
  const [userLocation, setUserLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialisation de la carte et récupération de la position de l'utilisateur
  useEffect(() => {
    // Récupération de la position de l'utilisateur
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error('Erreur de géolocalisation:', error);
            setErrorMessage('Impossible d\'accéder à votre position. Veuillez l\'activer dans les paramètres de votre navigateur.');
            // Coordonnées par défaut (Paris)
            setUserLocation({ lat: 48.8566, lng: 2.3522 });
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        setErrorMessage('La géolocalisation n\'est pas prise en charge par ce navigateur.');
        // Coordonnées par défaut (Paris)
        setUserLocation({ lat: 48.8566, lng: 2.3522 });
      }
    };

    getUserLocation();
  }, []);

  // Initialisation de la carte une fois que la position de l'utilisateur est disponible
  useEffect(() => {
    if (userLocation && !map.current) {
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [userLocation.lng, userLocation.lat],
          zoom: 13
        });

        // Ajout des contrôles de navigation
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Ajout d'un marqueur pour la position de l'utilisateur
        new mapboxgl.Marker({ color: '#3898FF' })
          .setLngLat([userLocation.lng, userLocation.lat])
          .addTo(map.current);

        map.current.on('load', () => {
          setMapLoaded(true);
        });

        // Gestion des erreurs de chargement de la carte
        map.current.on('error', (e) => {
          console.error('Erreur Mapbox:', e);
          setErrorMessage('Erreur de chargement de la carte. Veuillez réessayer plus tard.');
        });
      } catch (error) {
        console.error('Erreur d\'initialisation de la carte:', error);
        setErrorMessage('Erreur d\'initialisation de la carte. Veuillez vérifier votre connexion internet.');
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [userLocation]);

  // Fonction pour rechercher des suggestions basées sur la saisie de l'utilisateur
  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Utilisation de l'API Geocoding de Mapbox pour obtenir des suggestions
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` + 
        `proximity=${userLocation.lng},${userLocation.lat}&` +
        `types=address,poi,place&` +
        `access_token=${MAPBOX_TOKEN}&` +
        `language=fr`
      );

      if (!response.ok) {
        throw new Error(`Erreur de l'API: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error('Erreur de recherche:', error);
      setErrorMessage('Erreur lors de la recherche. Veuillez réessayer.');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Débounce pour limiter les appels API pendant la saisie
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        fetchSuggestions(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Gestion du clic en dehors de la liste de suggestions pour la fermer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionListRef.current && !suggestionListRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Recherche des lieux à proximité
  const searchNearbyPlaces = async (location) => {
    if (!location || !mapLoaded) return;

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Supprimer les anciens marqueurs du résultat précédent
      const existingMarkers = document.querySelectorAll('.result-marker');
      existingMarkers.forEach(marker => marker.remove());

      // Créer un tableau de promesses pour les requêtes de chaque catégorie
      const categoryPromises = selectedCategories.map(async (category) => {
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(category)}.json?` +
            `proximity=${location.lng},${location.lat}&` +
            `limit=5&` +
            `access_token=${MAPBOX_TOKEN}&` +
            `language=fr`
          );

          if (!response.ok) {
            throw new Error(`Erreur de l'API pour ${category}: ${response.status}`);
          }

          const data = await response.json();
          return data.features.map(feature => ({
            ...feature,
            category
          }));
        } catch (error) {
          console.error(`Erreur pour la catégorie ${category}:`, error);
          return [];
        }
      });

      // Attendre que toutes les requêtes soient terminées
      const resultsArray = await Promise.all(categoryPromises);
      
      // Aplatir le tableau de résultats
      const flatResults = resultsArray.flat();
      
      // Mise à jour des résultats
      setSearchResults(flatResults);

      // Ajouter des marqueurs pour chaque résultat
      flatResults.forEach((result, index) => {
        // Créer un élément div pour le marqueur
        const markerEl = document.createElement('div');
        markerEl.className = 'result-marker';
        markerEl.style.width = '30px';
        markerEl.style.height = '30px';
        markerEl.style.borderRadius = '50%';
        markerEl.style.backgroundColor = getCategoryColor(result.category);
        markerEl.style.display = 'flex';
        markerEl.style.justifyContent = 'center';
        markerEl.style.alignItems = 'center';
        markerEl.style.color = 'white';
        markerEl.style.fontWeight = 'bold';
        markerEl.textContent = (index + 1).toString();
        markerEl.style.border = '2px solid white';
        markerEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        // Ajouter le marqueur à la carte
        new mapboxgl.Marker(markerEl)
          .setLngLat(result.geometry.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<strong>${result.text}</strong><p>${result.place_name}</p><p>Catégorie: ${result.category}</p>`
          ))
          .addTo(map.current);
      });

      // Ajuster la vue de la carte si des résultats ont été trouvés
      if (flatResults.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        flatResults.forEach(result => {
          bounds.extend(result.geometry.coordinates);
        });
        bounds.extend([location.lng, location.lat]); // Inclure aussi la position de l'utilisateur
        
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
          duration: 1000
        });
      }
    } catch (error) {
      console.error('Erreur lors de la recherche des lieux à proximité:', error);
      setErrorMessage('Erreur lors de la recherche des lieux à proximité. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour obtenir une couleur en fonction de la catégorie
  const getCategoryColor = (category) => {
    const colors = {
      restaurant: '#FF5733',
      grocery: '#33FF57',
      pharmacy: '#3357FF',
      cafe: '#FF33A8',
      hotel: '#33A8FF',
      default: '#888888'
    };
    return colors[category] || colors.default;
  };

  // Gestion de la sélection d'une suggestion
  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion.place_name);
    setShowSuggestions(false);
    
    // Mise à jour de la carte
    if (map.current && suggestion.geometry && suggestion.geometry.coordinates) {
      const [lng, lat] = suggestion.geometry.coordinates;
      
      map.current.flyTo({
        center: [lng, lat],
        zoom: 15,
        essential: true
      });

      // Rechercher des lieux à proximité
      searchNearbyPlaces({ lng, lat });
    }
  };

  // Gestion de la soumission du formulaire de recherche
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    if (searchQuery && suggestions.length > 0) {
      handleSuggestionSelect(suggestions[0]);
    } else if (userLocation) {
      // Si aucune suggestion n'est sélectionnée, rechercher autour de la position actuelle
      searchNearbyPlaces(userLocation);
    }
  };

  // Gestion du changement de catégories
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Réinitialisation de la recherche
  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setSearchResults([]);
    
    if (map.current && userLocation) {
      map.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 13,
        essential: true
      });
      
      // Supprimer les marqueurs de résultats
      const existingMarkers = document.querySelectorAll('.result-marker');
      existingMarkers.forEach(marker => marker.remove());
    }
    
    // Focus sur l'input de recherche
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Fonction pour calculer la distance entre deux points (formule de Haversine)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold flex-1">Rechercher</h1>
      </header>

      {/* Barre de recherche */}
      <div className="p-4 bg-white shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="flex items-center relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Rechercher un lieu..."
              className="pl-10 pr-10 py-2 w-full"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Liste des suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <Card 
              ref={suggestionListRef}
              className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto shadow-lg"
            >
              <ul className="py-1">
                {suggestions.map((suggestion) => (
                  <li 
                    key={suggestion.id} 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-start"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    <MapPin className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0 text-gray-400" />
                    <div>
                      <div className="font-medium">{suggestion.text}</div>
                      <div className="text-sm text-gray-500 truncate">{suggestion.place_name}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Indicateur de chargement */}
          {isLoading && showSuggestions && (
            <Card className="absolute z-10 mt-1 w-full shadow-lg p-2">
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-full" />
              </div>
            </Card>
          )}
        </form>

        {/* Filtres de catégories */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedCategories.includes('restaurant') ? 'default' : 'outline'}
            className={selectedCategories.includes('restaurant') ? 'bg-red-500 hover:bg-red-600' : ''}
            onClick={() => handleCategoryChange('restaurant')}
          >
            Restaurants
          </Button>
          <Button
            size="sm"
            variant={selectedCategories.includes('grocery') ? 'default' : 'outline'}
            className={selectedCategories.includes('grocery') ? 'bg-green-500 hover:bg-green-600' : ''}
            onClick={() => handleCategoryChange('grocery')}
          >
            Épiceries
          </Button>
          <Button
            size="sm"
            variant={selectedCategories.includes('pharmacy') ? 'default' : 'outline'}
            className={selectedCategories.includes('pharmacy') ? 'bg-blue-500 hover:bg-blue-600' : ''}
            onClick={() => handleCategoryChange('pharmacy')}
          >
            Pharmacies
          </Button>
          <Button
            size="sm"
            variant={selectedCategories.includes('cafe') ? 'default' : 'outline'}
            className={selectedCategories.includes('cafe') ? 'bg-pink-500 hover:bg-pink-600' : ''}
            onClick={() => handleCategoryChange('cafe')}
          >
            Cafés
          </Button>
          <Button
            size="sm"
            variant={selectedCategories.includes('hotel') ? 'default' : 'outline'}
            className={selectedCategories.includes('hotel') ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
            onClick={() => handleCategoryChange('hotel')}
          >
            Hôtels
          </Button>
        </div>
      </div>

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="mx-4 mt-2 p-3 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="map">Carte</TabsTrigger>
          </TabsList>
          
          {/* Vue liste */}
          <TabsContent value="list" className="flex-1 overflow-auto p-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-5 w-4/5 mb-2" />
                    <Skeleton className="h-4 w-3/5 mb-1" />
                    <Skeleton className="h-4 w-2/5" />
                  </Card>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((result, index) => {
                  // Calculer la distance si userLocation est disponible
                  let distance = null;
                  if (userLocation && result.geometry && result.geometry.coordinates) {
                    const [lng, lat] = result.geometry.coordinates;
                    distance = calculateDistance(
                      userLocation.lat, 
                      userLocation.lng, 
                      lat, 
                      lng
                    );
                  }

                  return (
                    <Card 
                      key={`${result.id}-${index}`} 
                      className="p-4 hover:shadow-md transition-shadow"
                      onClick={() => {
                        if (map.current && result.geometry && result.geometry.coordinates) {
                          map.current.flyTo({
                            center: result.geometry.coordinates,
                            zoom: 16,
                            essential: true
                          });
                          
                          setActiveTab('map');
                        }
                      }}
                    >
                      <div className="flex items-start">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3 mt-1"
                          style={{ backgroundColor: getCategoryColor(result.category) }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{result.text}</h3>
                          <p className="text-sm text-gray-500 mb-1">{result.place_name}</p>
                          {distance !== null && (
                            <p className="text-sm flex items-center text-gray-500">
                              <Navigation className="h-3 w-3 mr-1" />
                              {distance < 1 
                                ? `${Math.round(distance * 1000)} m` 
                                : `${distance.toFixed(1)} km`}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery 
                    ? "Aucun résultat trouvé. Essayez de modifier votre recherche." 
                    : "Commencez par rechercher un lieu ou sélectionnez des catégories."}
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Vue carte */}
          <TabsContent value="map" className="flex-1 relative">
            <div 
              ref={mapContainer} 
              className="absolute inset-0"
            />
            
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                <div className="space-y-2 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-700">Chargement...</p>
                </div>
              </div>
            )}
            
            {/* Bouton pour recentrer sur la position de l'utilisateur */}
            <Button
              className="absolute bottom-6 right-4 bg-white shadow-lg"
              size="icon"
              onClick={() => {
                if (map.current && userLocation) {
                  map.current.flyTo({
                    center: [userLocation.lng, userLocation.lat],
                    zoom: 15,
                    essential: true
                  });
                }
              }}
            >
              <Navigation className="h-5 w-5" />
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Search;
