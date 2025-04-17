
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, ArrowLeft } from 'lucide-react';
import SearchBox from '@/components/search/SearchBox';
import { MAPBOX_TOKEN } from '@/config/environment';
import SubcategoryScroller from '@/components/search/SubcategoryScroller';
import FlaskServerStatus from '@/components/search/FlaskServerStatus';
import { FEATURES } from '@/config/environment';
import '../styles/search.css';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]);
  const [categoryInfo, setCategoryInfo] = useState({
    icon: '🍽️',
    title: 'Restaurants',
    color: '#0d6efd'
  });
  
  // Filtres
  const [transportMode, setTransportMode] = useState('driving');
  const [distance, setDistance] = useState(10);
  const [resultCount, setResultCount] = useState(5);
  
  // Sous-catégories (exemple)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<string[]>([
    'Restaurants', 'Bars', 'Cafés', 'Boulangeries', 'Supermarchés'
  ]);

  useEffect(() => {
    // Récupérer les paramètres d'URL
    const params = new URLSearchParams(window.location.search);
    const icon = params.get("icon") || "🍽️";
    const color = params.get("color") || "#0d6efd";
    const title = params.get("title") || "Résultats";
    
    setCategoryInfo({
      icon,
      title,
      color
    });
    
    // Simuler un chargement initial
    setSearchQuery(title);
  }, []);

  useEffect(() => {
    // Initialiser la carte après le rendu du composant
    if (!mapInstance && document.getElementById('map')) {
      initializeMap();
    }
  }, [mapInstance]);

  const initializeMap = () => {
    if (!window.mapboxgl) {
      console.error('Mapbox GL JS is not loaded');
      return;
    }

    window.mapboxgl.accessToken = MAPBOX_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN';
    
    const map = new window.mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: userLocation,
      zoom: 12
    });

    map.on('load', () => {
      setMapInstance(map);
    });

    // Ajouter les contrôles de zoom
    document.getElementById('zoom-in')?.addEventListener('click', () => map.zoomIn());
    document.getElementById('zoom-out')?.addEventListener('click', () => map.zoomOut());
    document.getElementById('my-location')?.addEventListener('click', handleLocationClick);
  };

  const handleLocationClick = () => {
    if (!mapInstance) return;
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
        
        mapInstance.flyTo({
          center: [longitude, latitude],
          zoom: 14,
          essential: true
        });
        
        setLoading(false);
        fetchPlaces(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLoading(false);
      }
    );
  };

  const fetchPlaces = (lat = userLocation[1], lng = userLocation[0]) => {
    setLoading(true);
    
    // Construire l'URL de l'API avec les filtres
    let url = '';
    
    if (FEATURES.USE_FLASK_SERVER) {
      // Utiliser le serveur Flask
      url = `/api/search?query=${encodeURIComponent(searchQuery)}&lat=${lat}&lon=${lng}&limit=${resultCount}&mode=${transportMode}`;
    } else {
      // Utiliser directement Mapbox
      url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?proximity=${lng},${lat}&limit=${resultCount}&access_token=${MAPBOX_TOKEN}`;
    }
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        // Traitement des résultats en fonction de la source
        let processedResults = [];
        
        if (FEATURES.USE_FLASK_SERVER) {
          // Format du serveur Flask
          processedResults = data;
        } else {
          // Format Mapbox
          processedResults = data.features.map((feature: any) => ({
            id: feature.id,
            name: feature.text,
            address: feature.place_name,
            latitude: feature.center[1],
            longitude: feature.center[0],
            distance: `~${Math.round(Math.random() * distance)} km`,
            duration: `~${Math.round(Math.random() * 30)} min`
          }));
        }
        
        setResults(processedResults);
        
        // Effacer les marqueurs existants
        if (mapInstance) {
          const markers = document.querySelectorAll('.mapboxgl-marker');
          markers.forEach(marker => marker.remove());
          
          // Ajouter de nouveaux marqueurs
          processedResults.forEach((place: any) => {
            const popup = new window.mapboxgl.Popup({ offset: 25 })
              .setHTML(`<strong>${place.name}</strong><br>${place.address || ''}`);
            
            new window.mapboxgl.Marker()
              .setLngLat([place.longitude, place.latitude])
              .setPopup(popup)
              .addTo(mapInstance);
          });
        }
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching places:', error);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    fetchPlaces();
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(prevSubcategory => 
      prevSubcategory === subcategory ? null : subcategory
    );
    
    if (subcategory) {
      setSearchQuery(subcategory);
      fetchPlaces();
    }
  };

  return (
    <div className="container py-4">
      {/* Bouton retour */}
      <div className="flex items-center gap-2 mb-3">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/categories')}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={18} />
          <span>Retour aux catégories</span>
        </Button>
      </div>
      
      {/* Information de catégorie */}
      <div className="category-info">
        <div 
          className="category-icon" 
          style={{ backgroundColor: categoryInfo.color }}
        >
          {categoryInfo.icon}
        </div>
        <h2 className="text-xl font-semibold">{categoryInfo.title}</h2>
      </div>
      
      {/* Barre de recherche */}
      <div className="mb-4">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          onLocationClick={handleLocationClick}
          isLocationActive={false}
          loading={loading}
          isRecording={false}
          onMicClick={() => {}}
          placeholder={`Rechercher un ${categoryInfo.title.toLowerCase()}...`}
        />
      </div>
      
      {/* Sous-catégories */}
      <SubcategoryScroller
        subcategories={subcategories}
        selectedSubcategory={selectedSubcategory}
        onSubcategorySelect={handleSubcategorySelect}
      />
      
      {/* Filtres */}
      <div className="filters my-4">
        <div className="form-group">
          <label className="filter-label block mb-2">Transport</label>
          <select 
            id="transport-mode" 
            className="w-full p-2 rounded-lg border border-gray-300"
            value={transportMode}
            onChange={(e) => {
              setTransportMode(e.target.value);
              fetchPlaces();
            }}
          >
            <option value="driving">🚘 Voiture</option>
            <option value="walking">🚶 Marche</option>
            <option value="cycling">🚲 Vélo</option>
            <option value="transit">🚍 Transport</option>
            <option value="train">🚆 Train</option>
            <option value="ship">⛴️ Bateau</option>
            <option value="plane">✈️ Avion</option>
            <option value="carpool">👥 Co-voiturage</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="filter-label block mb-2">Distance max (km)</label>
          <div className="flex items-center gap-2">
            <Slider
              value={[distance]}
              min={1}
              max={50}
              step={1}
              onValueChange={(values) => {
                setDistance(values[0]);
                fetchPlaces();
              }}
            />
            <span className="font-semibold w-8 text-center">{distance}</span>
          </div>
        </div>
        
        <div className="form-group">
          <label className="filter-label block mb-2">Résultats</label>
          <Input
            type="number"
            min={1}
            max={10}
            value={resultCount}
            className="w-full"
            onChange={(e) => {
              setResultCount(parseInt(e.target.value) || 5);
              fetchPlaces();
            }}
          />
        </div>
      </div>
      
      {/* Carte */}
      <div id="map" className="relative">
        <div id="zoom-in" className="map-control">+</div>
        <div id="zoom-out" className="map-control">−</div>
        <div id="my-location" className="map-control">📍</div>
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
      
      {/* Résultats */}
      <div id="results" className="mt-4">
        {results.map((place) => (
          <div key={place.id} className="result-card">
            <h5 className="font-semibold">{place.name}</h5>
            <p className="text-sm text-gray-600">{place.address}</p>
            <div className="flex justify-between mt-2 text-sm">
              <span className="flex items-center">
                <MapPin size={14} className="mr-1" />
                {place.distance}
              </span>
              {place.duration && (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {place.duration}
                </span>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 w-full flex items-center justify-center"
              onClick={() => {
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}&travelmode=${transportMode}`, '_blank');
              }}
            >
              <Navigation size={14} className="mr-2" />
              Itinéraire
            </Button>
          </div>
        ))}
        
        {results.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun résultat trouvé.</p>
            <p className="text-sm mt-2">Essayez d'ajuster vos filtres ou votre recherche.</p>
          </div>
        )}
      </div>
      
      {/* Indicateur de statut du serveur Flask */}
      <FlaskServerStatus className="mt-4" />
    </div>
  );
};

export default SearchPage;
