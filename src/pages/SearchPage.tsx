
import React, { useState, useEffect } from 'react';
import { useSearchPageState } from '@/hooks/useSearchPageState';
import SearchHeader from '@/components/search/SearchHeader';
import { SearchPanel } from '@/components/search/SearchPanel';
import MapSection from '@/components/search/MapSection';
import axios from 'axios';
import { toast } from 'sonner';
import { MAPBOX_TOKEN, API_BASE_URL } from '@/config/environment';
import { Printer, Settings, ArrowLeft, Filter, X, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Result } from '@/components/ResultsList';
import SearchFooter from '@/components/search/SearchFooter';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [resultsCount, setResultsCount] = useState(3);
  const [searchResults, setSearchResults] = useState([]);
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
  
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 20 
      }
    }
  };
  
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

  const handleLocationClick = () => {
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
  };

  const handleCategoryToggle = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      toast.error('Veuillez entrer un terme de recherche');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: {
          query,
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
  };

  const searchWithMapbox = async (query: string) => {
    if (!MAPBOX_TOKEN) {
      toast.error('Token Mapbox manquant');
      setShowNoMapboxTokenWarning(true);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
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
          category: feature.properties?.category || '',
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
  };

  const handleResultClick = (place: any) => {
    setSelectedPlaceId(place.id);
    setPopupInfo(place);
    setViewport({
      latitude: place.lat,
      longitude: place.lon,
      zoom: 14
    });
  };

  const generatePDF = async () => {
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
  };

  const toggleRoutes = () => {
    setShowRoutes(!showRoutes);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    toast.info('Tous les filtres ont été effacés');
  };

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
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="bg-white py-3 px-4 shadow-sm flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-app-dark">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">Recherche</h1>
      </div>
      
      <div className="bg-white px-3 py-2 flex space-x-2 overflow-x-auto scrollbar-hide border-b border-gray-100">
        {['restaurants', 'shopping', 'entertainment', 'culture', 'sports'].map((category) => (
          <motion.div
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full text-xs py-1 px-3 h-auto ${
                selectedCategory === category 
                  ? `bg-app-${category === 'restaurants' ? 'secondary' : category === 'shopping' ? 'primary' : 'gray'}`
                  : "border-gray-200 text-gray-600"
              }`}
              onClick={() => handleCategoryToggle(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          </motion.div>
        ))}
        
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-xs py-1 px-2 h-auto text-gray-500 flex items-center"
              onClick={clearFilters}
            >
              Effacer <X className="ml-1 h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </div>
      
      <div className="flex-grow relative">
        {/* Avertissement Mapbox Token manquant */}
        <AnimatePresence>
          {showNoMapboxTokenWarning && (
            <motion.div 
              className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md p-4 max-w-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Token Mapbox manquant</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Vous devez définir un token Mapbox pour utiliser la carte. 
                      Ajoutez <strong>VITE_MAPBOX_TOKEN</strong> dans votre fichier .env
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-yellow-800 bg-yellow-100 hover:bg-yellow-200 border-yellow-300"
                      onClick={() => setShowNoMapboxTokenWarning(false)}
                    >
                      Compris
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <MapSection 
          results={places}
          center={userLocation}
          transportMode={transportMode}
          isLocationActive={isLocationActive}
          loading={loading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isRecording={false}
          onMicClick={() => {}}
          onLocationClick={handleLocationClick}
          showRoutes={showRoutes}
          onSearch={() => performSearch(searchQuery)}
          selectedResultId={selectedPlaceId}
          onResultClick={handleResultClick}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          searchHistory={[]}
          savedSearches={[]}
          onHistoryItemClick={() => {}}
          onSaveSearch={() => {}}
          onRemoveSavedSearch={() => {}}
          resetSearch={() => {
            setSearchQuery('');
            setSearchResults([]);
          }}
          onTransportModeChange={setTransportMode}
          userLocation={userLocation}
          radius={5}
          radiusUnit="km"
          radiusType="distance"
          duration={15}
          timeUnit="minutes"
        />
        
        <SearchPanel 
          query={searchQuery}
          setQuery={setSearchQuery}
          search={performSearch}
          isLocationActive={isLocationActive}
          onLocationClick={handleLocationClick}
          loading={loading}
          transportMode={transportMode}
          onTransportModeChange={setTransportMode}
          userLocation={userLocation}
          generatePDF={generatePDF}
          limit={resultsCount}
          setLimit={setResultsCount}
        />
        
        <SearchFooter 
          generatePDF={generatePDF}
          toggleRoutes={toggleRoutes}
          showRoutes={showRoutes}
        />
        
        {searchResults.length > 0 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-10 px-4">
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-2 max-h-60 overflow-y-auto"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-sm font-medium px-3 py-1">Résultats</h3>
              <ul className="divide-y divide-gray-100">
                {searchResults.map((result: any, index: number) => (
                  <motion.li 
                    key={result.id || index}
                    variants={itemVariants}
                    className={`px-3 py-2 hover:bg-gray-50 cursor-pointer ${
                      selectedPlaceId === (result.id || `place-${index}`) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleResultClick({
                      id: result.id || `place-${index}`,
                      name: result.name,
                      lat: result.lat,
                      lon: result.lon
                    })}
                  >
                    <div className="font-medium">{result.name}</div>
                    <div className="flex text-sm text-gray-500 justify-between">
                      <span>{result.distance} km</span>
                      <span>{result.duration} min</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
        
        {searchResults.length === 0 && !loading && searchQuery.trim() !== '' && (
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center py-10 text-gray-500 bg-white/80 rounded-lg p-6 shadow-sm z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm">Aucun résultat trouvé</p>
            <p className="text-xs mt-1">Essayez de modifier votre recherche ou vos filtres</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3" 
              onClick={() => {
                setSearchQuery('');
                clearFilters();
              }}
            >
              Réinitialiser
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
