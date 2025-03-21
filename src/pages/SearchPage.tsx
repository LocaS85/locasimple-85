
import React, { useState, useEffect } from 'react';
import { SearchInput } from '@/components/search/SearchInput';
import MapDisplay from '@/components/search/MapDisplay';
import { toast } from 'sonner';
import { MAPBOX_TOKEN, API_URL } from '@/config/environment';
import axios from 'axios';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLocationActive, setIsLocationActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transportMode, setTransportMode] = useState('driving');
  const [resultsCount, setResultsCount] = useState(5);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]);
  const [viewport, setViewport] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 12
  });
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [popupInfo, setPopupInfo] = useState<any | null>(null);

  // Convertir les résultats de recherche en format compatible avec la carte
  const places = searchResults.map((result: any) => ({
    id: result.id || `place-${Math.random().toString(36).substr(2, 9)}`,
    name: result.name,
    lat: result.lat,
    lon: result.lon,
    distance: result.distance,
    duration: result.duration,
    address: result.place_name,
    category: result.category
  }));

  // Gérer le clic sur le bouton de localisation
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
      }
    );
  };

  // Gérer le clic sur le bouton du microphone
  const handleMicClick = () => {
    setIsRecording(!isRecording);
    // Logique d'enregistrement vocal à implémenter
  };

  // Effectuer une recherche
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      toast.error('Veuillez entrer un terme de recherche');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/search`, {
        params: {
          query,
          mode: transportMode,
          lat: userLocation[1],
          lon: userLocation[0],
          limit: resultsCount
        }
      });

      if (response.data && response.data.length > 0) {
        setSearchResults(response.data);
        
        // Centrer la carte sur le premier résultat
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
    } finally {
      setLoading(false);
    }
  };

  // Gérer le clic sur un résultat
  const handleResultClick = (place: any) => {
    setSelectedPlaceId(place.id);
    setPopupInfo(place);
    setViewport({
      latitude: place.lat,
      longitude: place.lon,
      zoom: 14
    });
  };

  // Générer un PDF avec les résultats
  const generatePDF = async () => {
    if (searchResults.length === 0) {
      toast.error('Aucun résultat à exporter');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/generate_pdf`, { 
        places: searchResults 
      });
      
      if (response.data.success) {
        window.open(`${API_URL}${response.data.url}`, '_blank');
        toast.success('PDF généré avec succès');
      } else {
        throw new Error(response.data.error || 'Erreur lors de la génération du PDF');
      }
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si le serveur Flask est en cours d'exécution
  useEffect(() => {
    const checkFlaskServer = async () => {
      try {
        await axios.get(`${API_URL}/health`, { timeout: 2000 });
        console.log('Serveur Flask connecté');
      } catch (error) {
        console.warn('Serveur Flask non connecté:', error);
        toast.warning('Le serveur Flask n\'est pas démarré. Certaines fonctionnalités peuvent ne pas fonctionner.');
      }
    };
    
    checkFlaskServer();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="relative flex-grow">
        <MapDisplay 
          viewport={viewport}
          setViewport={setViewport}
          places={places}
          resultsCount={resultsCount}
          selectedPlaceId={selectedPlaceId}
          popupInfo={popupInfo}
          setPopupInfo={setPopupInfo}
          handleResultClick={handleResultClick}
          isLocationActive={isLocationActive}
          userLocation={userLocation}
          loading={loading}
          handleLocationClick={handleLocationClick}
          transportMode={transportMode}
        />
        
        {/* Contrôles de recherche */}
        <div className="absolute top-4 left-0 right-0 z-10 flex justify-center">
          <SearchInput 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isRecording={isRecording}
            onMicClick={handleMicClick}
            isLocationActive={isLocationActive}
            onLocationClick={handleLocationClick}
            loading={loading}
            onSearch={() => performSearch(searchQuery)}
            transportMode={transportMode}
            onTransportModeChange={setTransportMode}
          />
        </div>
        
        {/* Résultats de recherche */}
        {searchResults.length > 0 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-10 px-4">
            <div className="bg-white rounded-lg shadow-lg p-2 max-h-60 overflow-y-auto">
              <div className="flex justify-between items-center px-3 py-1">
                <h3 className="text-sm font-medium">Résultats</h3>
                <button 
                  onClick={generatePDF}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Exporter PDF
                </button>
              </div>
              <ul className="divide-y divide-gray-100">
                {searchResults.map((result: any, index: number) => (
                  <li 
                    key={result.id || index} 
                    className={`px-3 py-2 hover:bg-gray-50 cursor-pointer ${
                      selectedPlaceId === (result.id || `place-${index}`) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleResultClick({
                      id: result.id || `place-${index}`,
                      name: result.name,
                      lat: result.lat,
                      lon: result.lon,
                      distance: result.distance,
                      duration: result.duration,
                      category: result.category
                    })}
                  >
                    <div className="font-medium">{result.name}</div>
                    <div className="flex text-sm text-gray-500 justify-between">
                      <span>{result.distance} km</span>
                      <span>{result.duration} min</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
