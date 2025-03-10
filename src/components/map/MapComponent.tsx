
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Navigation, MapPin, Info, Phone, Map, Check, 
  List, Filter, Clock, Users, X, ChevronLeft, Share, Star, 
  Menu, Plus, Minus, Compass, Layers
} from 'lucide-react';

const MapComponent = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtres
  const [filters, setFilters] = useState({
    distance: 5, // km
    duration: 30, // minutes
    count: 10,   // nombre de résultats
    categories: []
  });

  // Catégories disponibles
  const categories = [
    { id: 'restaurant', name: 'Restaurants', icon: '🍽️' },
    { id: 'hotel', name: 'Hôtels', icon: '🏨' },
    { id: 'activity', name: 'Activités', icon: '🏄‍♂️' },
    { id: 'museum', name: 'Musées', icon: '🏛️' },
    { id: 'transport', name: 'Transports', icon: '🚆' },
    { id: 'pharmacy', name: 'Pharmacies', icon: '💊' },
    { id: 'atm', name: 'Distributeurs', icon: '💰' }
  ];

  // Applications de navigation disponibles
  const navigationApps = [
    { id: 'internal', name: 'LocaSimple', icon: '📍' },
    { id: 'google', name: 'Google Maps', icon: '🌐' },
    { id: 'waze', name: 'Waze', icon: '🚗' },
    { id: 'apple', name: 'Plans (Apple)', icon: '🍎' }
  ];

  // Initialisation de la carte
  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const mapOptions = {
      center: { lat: 46.603354, lng: 1.888334 }, // Centre de la France par défaut
      zoom: 10,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: false,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);
    
    // Récupération de la position de l'utilisateur
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setUserLocation(userPos);
        newMap.setCenter(userPos);
        
        // Marqueur pour la position de l'utilisateur
        new window.google.maps.Marker({
          position: userPos,
          map: newMap,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2
          },
          title: 'Votre position'
        });
        
        setIsLoading(false);
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, [mapRef.current, window.google]);

  // Fonction de recherche
  const handleSearch = () => {
    if (!map || !userLocation || !searchQuery) return;
    
    setIsLoading(true);
    
    // Simulation de recherche (à remplacer par une API réelle)
    setTimeout(() => {
      const mockPlaces = Array.from({ length: filters.count }, (_, i) => ({
        id: `place-${i}`,
        name: `${searchQuery} ${i + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)].id,
        rating: (3 + Math.random() * 2).toFixed(1),
        address: `${Math.floor(Math.random() * 100)} rue de Paris, 75000 Paris`,
        distance: (Math.random() * filters.distance).toFixed(1),
        duration: Math.floor(Math.random() * filters.duration),
        position: {
          lat: userLocation.lat + (Math.random() - 0.5) * 0.05,
          lng: userLocation.lng + (Math.random() - 0.5) * 0.05
        }
      }));
      
      setPlaces(mockPlaces);
      
      // Ajout des marqueurs sur la carte
      mockPlaces.forEach(place => {
        const marker = new window.google.maps.Marker({
          position: place.position,
          map: map,
          title: place.name
        });
        
        marker.addListener('click', () => {
          setSelectedPlace(place);
        });
      });
      
      setIsLoading(false);
    }, 1000);
  };

  // Fonction pour obtenir un itinéraire
  const getDirections = (destination, navigationApp = 'internal') => {
    if (!userLocation) return;
    
    const startLat = userLocation.lat;
    const startLng = userLocation.lng;
    const destLat = destination.position.lat;
    const destLng = destination.position.lng;
    
    switch (navigationApp) {
      case 'google':
        window.open(`https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${destLat},${destLng}&travelmode=driving`, '_blank');
        break;
      case 'waze':
        window.open(`https://www.waze.com/ul?ll=${destLat},${destLng}&navigate=yes`, '_blank');
        break;
      case 'apple':
        window.open(`maps://maps.apple.com/?daddr=${destLat},${destLng}&saddr=${startLat},${startLng}`, '_blank');
        break;
      case 'internal':
      default:
        // Simulation d'une navigation interne
        if (map && userLocation && destination) {
          const directionsService = new window.google.maps.DirectionsService();
          const directionsRenderer = new window.google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true
          });
          
          directionsService.route(
            {
              origin: userLocation,
              destination: destination.position,
              travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
              }
            }
          );
        }
    }
  };

  // Fonction pour zoomer sur la carte
  const handleZoom = (zoomIn) => {
    if (!map) return;
    const currentZoom = map.getZoom();
    map.setZoom(zoomIn ? currentZoom + 1 : currentZoom - 1);
  };

  // Fonction pour recentrer la carte sur la position de l'utilisateur
  const centerOnUser = () => {
    if (!map || !userLocation) return;
    map.setCenter(userLocation);
    map.setZoom(15);
  };

  // Fonction pour mettre à jour les filtres
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Gestion des catégories sélectionnées
  const toggleCategory = (categoryId) => {
    setFilters(prev => {
      const categories = [...prev.categories];
      if (categories.includes(categoryId)) {
        return { ...prev, categories: categories.filter(id => id !== categoryId) };
      } else {
        return { ...prev, categories: [...categories, categoryId] };
      }
    });
  };

  return (
    <div className="relative h-screen w-full bg-gray-100 overflow-hidden">
      {/* Barre de recherche supérieure */}
      <div className="absolute top-4 left-0 right-0 z-10 px-4">
        <div className="bg-white rounded-lg shadow-md flex items-center p-2 mx-auto max-w-3xl">
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex-1 mx-2">
            <Input
              type="text"
              placeholder="Rechercher un lieu, une adresse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none shadow-none focus-visible:ring-0"
            />
          </div>
          <button 
            onClick={handleSearch}
            className="bg-primary text-white p-2 rounded-full hover:bg-primary/90"
          >
            <Search className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-full ml-1 ${showFilters ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
        
        {/* Panneau de filtres */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-4 mt-2 mx-auto max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filtres</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Distance maximale
                  </label>
                  <span className="text-sm">{filters.distance} km</span>
                </div>
                <Slider
                  value={[filters.distance]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={([value]) => updateFilter('distance', value)}
                  className="mb-4"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Durée maximale
                  </label>
                  <span className="text-sm">{filters.duration} min</span>
                </div>
                <Slider
                  value={[filters.duration]}
                  min={5}
                  max={120}
                  step={5}
                  onValueChange={([value]) => updateFilter('duration', value)}
                  className="mb-4"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Nombre de résultats
                  </label>
                  <span className="text-sm">{filters.count}</span>
                </div>
                <Slider
                  value={[filters.count]}
                  min={3}
                  max={25}
                  step={1}
                  onValueChange={([value]) => updateFilter('count', value)}
                  className="mb-4"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Catégories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`px-3 py-1 rounded-full text-sm flex items-center ${
                        filters.categories.includes(category.id)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSearch} className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Appliquer les filtres
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Carte */}
      <div 
        ref={mapRef} 
        className="h-full w-full"
      ></div>
      
      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="font-medium">Chargement...</p>
          </div>
        </div>
      )}
      
      {/* Panneau latéral */}
      {showSidebar && (
        <div className="absolute top-0 left-0 h-full w-80 bg-white shadow-lg z-20 overflow-y-auto transform transition-transform">
          <div className="p-4 bg-primary text-white flex items-center justify-between">
            <h2 className="font-bold text-lg flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              LocaSimple
            </h2>
            <button onClick={() => setShowSidebar(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {places.length > 0 ? (
            <div>
              <div className="p-3 bg-gray-100 border-b">
                <p className="font-medium">{places.length} résultats trouvés</p>
              </div>
              <div className="divide-y">
                {places.map(place => (
                  <div 
                    key={place.id} 
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      selectedPlace?.id === place.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedPlace(place)}
                  >
                    <h3 className="font-medium">{place.name}</h3>
                    <p className="text-sm text-gray-600">{place.address}</p>
                    <div className="flex mt-2 text-sm">
                      <span className="flex items-center mr-3">
                        <MapPin className="h-3 w-3 mr-1 text-primary" />
                        {place.distance} km
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-primary" />
                        {place.duration} min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">
                Recherchez des lieux à proximité pour afficher les résultats
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Détails d'un lieu sélectionné */}
      {selectedPlace && (
        <div className="absolute bottom-4 left-0 right-0 mx-4 z-10">
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{selectedPlace.name}</h3>
                  <p className="text-sm text-gray-600">{selectedPlace.address}</p>
                  
                  <div className="flex mt-2 text-sm">
                    <span className="flex items-center mr-3">
                      <MapPin className="h-3 w-3 mr-1 text-primary" />
                      {selectedPlace.distance} km
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-primary" />
                      {selectedPlace.duration} min
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedPlace(null)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              
              <div className="mt-4">
                <Tabs defaultValue="directions">
                  <TabsList className="w-full">
                    <TabsTrigger value="directions" className="flex-1">
                      <Navigation className="h-4 w-4 mr-2" />
                      Y aller
                    </TabsTrigger>
                    <TabsTrigger value="share" className="flex-1">
                      <Share className="h-4 w-4 mr-2" />
                      Partager
                    </TabsTrigger>
                    <TabsTrigger value="save" className="flex-1">
                      <Star className="h-4 w-4 mr-2" />
                      Enregistrer
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="directions" className="pt-4">
                    <p className="text-sm font-medium mb-2">Choisir une application</p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {navigationApps.map(app => (
                        <Button
                          key={app.id}
                          variant="outline"
                          className="whitespace-nowrap"
                          onClick={() => getDirections(selectedPlace, app.id)}
                        >
                          <span className="mr-1">{app.icon}</span>
                          {app.name}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="share" className="pt-4">
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Copier le lien
                      </Button>
                      <Button variant="outline" className="flex-1">
                        WhatsApp
                      </Button>
                      <Button variant="outline" className="flex-1">
                        E-mail
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="save" className="pt-4">
                    <Button className="w-full">
                      <Star className="h-4 w-4 mr-2" />
                      Ajouter aux favoris
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Boutons de contrôle de la carte */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
        <div className="bg-white rounded-lg shadow-md p-1 flex flex-col">
          <button
            onClick={() => handleZoom(true)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Plus className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={() => handleZoom(false)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Minus className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={centerOnUser}
            className="p-2 hover:bg-gray-100 rounded mt-2"
          >
            <Compass className="h-5 w-5 text-gray-700" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded mt-2"
          >
            <Layers className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
