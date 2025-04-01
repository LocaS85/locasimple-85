import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { ChevronLeft, Moon, Sun, Save, Bookmark, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import L from 'leaflet';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import 'leaflet/dist/leaflet.css';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';
import CategoryGrid from '@/components/categories/CategoryGrid';

// Correction pour les icônes Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface RoutePoint {
  lat: number;
  lng: number;
  name: string;
}

interface RouteCategory {
  color: string;
  visible: boolean;
  points: RoutePoint[];
}

interface Routes {
  [key: string]: RouteCategory;
}

interface SearchSuggestion {
  id: string;
  place_name: string;
  center: [number, number];
  text: string;
}

const Categories = () => {
  const [showSimpleUI, setShowSimpleUI] = useState(false);
  const [routes, setRoutes] = useState<Routes>(() => {
    // Charger depuis localStorage si disponible
    const savedRoutes = localStorage.getItem('savedRoutes');
    if (savedRoutes) {
      try {
        return JSON.parse(savedRoutes);
      } catch (e) {
        console.error('Erreur lors du chargement des routes sauvegardées:', e);
      }
    }
    // Valeurs par défaut
    return {
      famille: { color: 'red', visible: true, points: [] },
      travail: { color: 'blue', visible: true, points: [] },
      ecole: { color: 'green', visible: true, points: [] },
      divers: { color: 'purple', visible: true, points: [] }
    };
  });
  
  const [newPlace, setNewPlace] = useState({
    name: '',
    category: 'famille'
  });
  
  const [filters, setFilters] = useState({
    distance: 'km',
    transport: 'voiture',
    duree: '30'
  });
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isLocationActive, setIsLocationActive] = useState(false);
  
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Sauvegarder les routes dans localStorage quand elles changent
  useEffect(() => {
    localStorage.setItem('savedRoutes', JSON.stringify(routes));
  }, [routes]);

  // Géolocalisation de l'utilisateur
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
        setIsLocationActive(true);
        
        // Centrer la carte sur la position de l'utilisateur
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 14);
        }
        
        toast.success("Position actuelle détectée");
        setIsLocating(false);
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
        
        let errorMessage = "Erreur lors de la géolocalisation";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Vous avez refusé l'accès à votre position";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Votre position n'est pas disponible";
            break;
          case error.TIMEOUT:
            errorMessage = "La demande de géolocalisation a expiré";
            break;
        }
        
        toast.error(errorMessage);
        setIsLocating(false);
        setIsLocationActive(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // Fonction pour rechercher un lieu avec Mapbox Places API
  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Construire la requête avec la proximité si l'utilisateur est localisé
      let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}`;
      
      // Ajouter les coordonnées de l'utilisateur pour obtenir des résultats à proximité
      if (userLocation) {
        url += `&proximity=${userLocation[0]},${userLocation[1]}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }
      
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        setSearchSuggestions(data.features);
        setShowSuggestions(true);
      } else {
        toast.error('Aucun résultat trouvé');
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast.error('Erreur lors de la recherche');
    } finally {
      setIsSearching(false);
    }
  };

  // Effectuer la recherche après délai pour éviter trop de requêtes
  useEffect(() => {
    if (searchQuery.length > 2) {
      const timer = setTimeout(() => {
        searchLocation();
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, userLocation]);

  // Fonction pour ajouter un lieu depuis les suggestions
  const addSuggestionToMap = (suggestion: SearchSuggestion) => {
    if (!suggestion || !suggestion.center) return;
    
    const [lng, lat] = suggestion.center;
    
    setRoutes(prev => ({
      ...prev,
      [newPlace.category]: {
        ...prev[newPlace.category],
        points: [
          ...prev[newPlace.category].points,
          { lat, lng, name: suggestion.text || suggestion.place_name }
        ]
      }
    }));
    
    // Fermer les suggestions et réinitialiser le champ
    setShowSuggestions(false);
    setSearchQuery('');
    
    // Ajuster la carte pour montrer le nouveau point
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 14);
    }
    
    toast.success(`Point ajouté à la catégorie ${newPlace.category}`);
  };

  // Fonction pour basculer la visibilité d'une catégorie
  const toggleCategory = (category: string) => {
    setRoutes(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        visible: !prev[category].visible
      }
    }));
  };

  // Fonction pour ajouter un nouveau lieu manuellement
  const addPlace = () => {
    if (!newPlace.name.trim()) {
      toast.error('Veuillez entrer un nom pour le lieu');
      return;
    }
    
    // Générer des coordonnées aléatoires autour de Paris pour la démo
    const lat = 48.8566 + (Math.random() - 0.5) * 0.1;
    const lng = 2.3522 + (Math.random() - 0.5) * 0.1;
    
    setRoutes(prev => ({
      ...prev,
      [newPlace.category]: {
        ...prev[newPlace.category],
        points: [...prev[newPlace.category].points, { lat, lng, name: newPlace.name }]
      }
    }));
    
    setNewPlace({
      name: '',
      category: 'famille'
    });
    
    toast.success(`Point ajouté à la catégorie ${newPlace.category}`);
  };

  // Fonction pour basculer le thème clair/sombre
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Fonction pour filtrer les résultats
  const filterResults = () => {
    toast.success("Filtrage appliqué !");
    console.log("Filtres appliqués:", filters);
  };

  // Fonction pour centrer la carte sur un point spécifique
  const centerOnPoint = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 14);
    }
  };

  // Fonction pour générer un PDF avec capture de la carte
  const generatePDF = async () => {
    if (!mapContainerRef.current) return;
    
    toast.info("Génération du PDF en cours...");
    
    try {
      // Capturer la carte avec html2canvas
      const canvas = await html2canvas(mapContainerRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      // Créer le PDF
      const doc = new jsPDF();
      doc.text("Carte et Descriptif des Trajets", 10, 10);
      
      // Ajouter l'image de la carte
      doc.addImage(imgData, 'PNG', 10, 20, 180, 100);
      
      // Ajouter les descriptifs textuels
      let y = 130;
      Object.entries(routes).forEach(([category, data]) => {
        if (data.visible) {
          // Utilisation d'une couleur approximative pour le texte
          doc.setTextColor(data.color === 'red' ? '#FF0000' : 
                         data.color === 'blue' ? '#0000FF' :
                         data.color === 'green' ? '#008000' : '#800080');
                         
          doc.text(`${category.toUpperCase()} : ${data.points.length} points`, 10, y);
          y += 10;
          
          data.points.forEach((point, index) => {
            doc.text(`  - ${point.name}`, 20, y);
            y += 7;
            if (y > 280) {
              doc.addPage();
              y = 20;
            }
          });
        }
      });
      
      doc.save("geolocalisation.pdf");
      toast.success("PDF généré avec succès !");
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };
  
  // Composant pour capturer la référence de la carte
  const MapReference = () => {
    const map = useMap();
    mapRef.current = map;
    return null;
  };

  // Fonction pour sauvegarder l'état actuel comme favori
  const saveAsFavorite = () => {
    const name = prompt("Donnez un nom à ce favori:");
    if (!name) return;
    
    const favorites = JSON.parse(localStorage.getItem('mapFavorites') || '{}');
    favorites[name] = routes;
    localStorage.setItem('mapFavorites', JSON.stringify(favorites));
    
    toast.success(`Configuration sauvegardée sous "${name}"`);
  };

  // Fonction pour charger un favori
  const loadFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('mapFavorites') || '{}');
    const names = Object.keys(favorites);
    
    if (names.length === 0) {
      toast.error("Aucun favori enregistré");
      return;
    }
    
    const name = prompt(`Choisissez un favori parmi: ${names.join(', ')}`);
    if (!name || !favorites[name]) return;
    
    setRoutes(favorites[name]);
    toast.success(`Configuration "${name}" chargée`);
  };

  const handleCategorySelect = (categoryId: string) => {
    // Toggle visibility of selected category
    toggleCategory(categoryId);
    
    // Switch to advanced UI
    setShowSimpleUI(false);
    
    // Show toast notification
    toast.success(`Catégorie ${categoryId} sélectionnée`);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-sm`}>
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} mr-4`}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">Catégories et Trajets</h1>
          <div className="ml-auto flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSimpleUI(!showSimpleUI)}
            >
              {showSimpleUI ? 'Vue Avancée' : 'Vue Simple'}
            </Button>
            <Button variant="outline" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="outline" size="icon" onClick={saveAsFavorite}>
              <Save className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={loadFavorite}>
              <Bookmark className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      {showSimpleUI ? (
        <CategoryGrid onCategorySelect={handleCategorySelect} />
      ) : (
        <div className="container mx-auto px-4 py-6">
          {/* Barre de recherche avec autocomplétion */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md mb-6`}>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Rechercher un lieu..."
                  className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className={`absolute z-10 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border`}>
                    {searchSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className={`px-4 py-2 cursor-pointer ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                        onClick={() => addSuggestionToMap(suggestion)}
                      >
                        <div className="font-medium">{suggestion.text}</div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{suggestion.place_name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={searchLocation} disabled={isSearching}>
                <Search className="h-5 w-5 mr-1" />
                {isSearching ? 'Recherche...' : 'Rechercher'}
              </Button>
              {/* Bouton de géolocalisation */}
              <Button 
                onClick={getUserLocation} 
                variant={isLocationActive ? "default" : "outline"}
                disabled={isLocating}
                className={isLocationActive ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                <MapPin className="h-5 w-5 mr-1" />
                {isLocating ? 'Localisation...' : 'Ma position'}
              </Button>
            </div>
          </div>
          
          {/* Interface en deux colonnes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colonne de gauche: Liste des trajets et contrôles */}
            <div className="md:col-span-1 space-y-6">
              {/* Contrôles des catégories */}
              <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-lg shadow-md`}>
                <h3 className="text-lg font-semibold mb-4">Catégories</h3>
                <div className="flex flex-col gap-3">
                  <Button 
                    variant={routes.famille.visible ? "default" : "outline"}
                    onClick={() => toggleCategory('famille')}
                    className={routes.famille.visible ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    Famille ON/OFF
                  </Button>
                  
                  <Button 
                    variant={routes.travail.visible ? "default" : "outline"}
                    onClick={() => toggleCategory('travail')}
                    className={routes.travail.visible ? "bg-blue-500 hover:bg-blue-600" : ""}
                  >
                    Travail ON/OFF
                  </Button>
                  
                  <Button 
                    variant={routes.ecole.visible ? "default" : "outline"}
                    onClick={() => toggleCategory('ecole')}
                    className={routes.ecole.visible ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    École ON/OFF
                  </Button>
                  
                  <Button 
                    variant={routes.divers.visible ? "default" : "outline"}
                    onClick={() => toggleCategory('divers')}
                    className={routes.divers.visible ? "bg-purple-500 hover:bg-purple-600" : ""}
                  >
                    Divers ON/OFF
                  </Button>
                </div>
              </div>
              
              {/* Liste interactive des points */}
              <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-lg shadow-md`}>
                <h3 className="text-lg font-semibold mb-4">Liste des points</h3>
                <div className="space-y-4">
                  {Object.entries(routes).map(([category, data]) => 
                    data.visible && data.points.length > 0 && (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium" style={{ color: data.color }}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h4>
                        <ul className={`space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {data.points.map((point, index) => (
                            <li 
                              key={index}
                              className="flex items-center py-1 px-2 rounded cursor-pointer hover:bg-opacity-10 hover:bg-gray-500"
                              onClick={() => centerOnPoint(point.lat, point.lng)}
                            >
                              <span className="w-6 h-6 flex items-center justify-center rounded-full mr-2 text-xs" style={{ backgroundColor: data.color, color: 'white' }}>
                                {index + 1}
                              </span>
                              {point.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                  
                  {Object.values(routes).every(cat => cat.points.length === 0 || !cat.visible) && (
                    <p className={`italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Aucun point visible pour le moment
                    </p>
                  )}
                </div>
                
                <div className="mt-4">
                  <Button onClick={generatePDF} className="w-full">
                    📄 Exporter en PDF
                  </Button>
                </div>
              </div>
              
              {/* Formulaire d'ajout */}
              <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-lg shadow-md`}>
                <h3 className="text-lg font-semibold mb-4">Ajouter un Lieu (manuel)</h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom du lieu</label>
                    <input 
                      type="text" 
                      className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                      placeholder="Nom du lieu"
                      value={newPlace.name}
                      onChange={(e) => setNewPlace({...newPlace, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Catégorie</label>
                    <select 
                      className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                      value={newPlace.category}
                      onChange={(e) => setNewPlace({...newPlace, category: e.target.value})}
                    >
                      <option value="famille">Famille</option>
                      <option value="travail">Travail</option>
                      <option value="ecole">École</option>
                      <option value="divers">Divers</option>
                    </select>
                  </div>
                  
                  <Button onClick={addPlace}>
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Colonne de droite: Carte et filtres */}
            <div className="md:col-span-2 space-y-6">
              {/* Carte */}
              <div className={`border rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'border-gray-700' : ''}`} style={{ height: "500px" }} ref={mapContainerRef}>
                <MapContainer 
                  center={[48.8566, 2.3522]} 
                  zoom={12} 
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={`https://api.mapbox.com/styles/v1/mapbox/${isDarkMode ? 'dark-v10' : 'streets-v11'}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
                  />
                  <MapReference />
                  
                  {/* Afficher les polylines pour chaque catégorie */}
                  {Object.entries(routes).map(([category, data]) => 
                    data.visible && data.points.length > 0 && (
                      <Polyline 
                        key={category} 
                        positions={data.points.map(p => [p.lat, p.lng])} 
                        color={data.color} 
                      />
                    )
                  )}
                  
                  {/* Afficher les marqueurs pour chaque point */}
                  {Object.entries(routes).map(([category, data]) => 
                    data.visible && data.points.map((point, index) => (
                      <Marker 
                        key={`${category}-${index}`} 
                        position={[point.lat, point.lng]} 
                        title={point.name}
                      />
                    ))
                  )}
                  
                  {/* Marqueur pour la position de l'utilisateur */}
                  {isLocationActive && userLocation && (
                    <Marker 
                      position={[userLocation[1], userLocation[0]]} 
                      title="Ma position"
                      icon={L.icon({
                        iconUrl: 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4" width="36px" height="36px"><circle cx="12" cy="12" r="8" fill-opacity=".25"/><circle cx="12" cy="12" r="3"/></svg>',
                        iconSize: [36, 36],
                        iconAnchor: [18, 18]
                      })}
                    />
                  )}
                </MapContainer>
              </div>
              
              {/* Filtres */}
              <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-lg shadow-md`}>
                <h3 className="text-lg font-semibold mb-4">Filtres</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <select 
                    className={`px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                    value={filters.distance}
                    onChange={(e) => setFilters({...filters, distance: e.target.value})}
                  >
                    <option value="km">Distance en Km</option>
                    <option value="miles">Distance en Miles</option>
                  </select>
                  
                  <select 
                    className={`px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                    value={filters.transport}
                    onChange={(e) => setFilters({...filters, transport: e.target.value})}
                  >
                    <option value="voiture">Voiture</option>
                    <option value="train">Train</option>
                    <option value="velo">Vélo</option>
                    <option value="pied">À pied</option>
                  </select>
                  
                  <select 
                    className={`px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                    value={filters.duree}
                    onChange={(e) => setFilters({...filters, duree: e.target.value})}
                  >
                    <option value="10">Moins de 10 min</option>
                    <option value="30">Moins de 30 min</option>
                    <option value="60">Moins de 1 heure</option>
                  </select>
                  
                  <Button onClick={filterResults}>
                    Filtrer
                  </Button>
                </div>
              </div>
              
              {/* Légende */}
              <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-lg shadow-md`}>
                <h3 className="text-lg font-semibold mb-4">Légende</h3>
                <div className="flex flex-wrap gap-3">
                  <div className="px-3 py-2 rounded-md bg-red-500 text-white">🔴 Famille</div>
                  <div className="px-3 py-2 rounded-md bg-blue-500 text-white">🔵 Travail</div>
                  <div className="px-3 py-2 rounded-md bg-green-500 text-white">🟢 École</div>
                  <div className="px-3 py-2 rounded-md bg-purple-500 text-white">🟣 Divers</div>
                  {isLocationActive && (
                    <div className="px-3 py-2 rounded-md bg-blue-100 text-blue-800 border border-blue-300">📍 Ma position</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
