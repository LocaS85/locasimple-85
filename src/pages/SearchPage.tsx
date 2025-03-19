
import React, { useState, useEffect } from 'react';
import { useSearchPageState } from '@/hooks/useSearchPageState';
import SearchHeader from '@/components/search/SearchHeader';
import { SearchPanel } from '@/components/search/SearchPanel';
import MapDisplay from '@/components/search/MapDisplay';
import axios from 'axios';
import { toast } from 'sonner';
import { MAPBOX_TOKEN } from '@/config/environment';

const SearchPage = () => {
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
  
  // Convert search results to places format for the map
  const places = searchResults.map((result: any) => ({
    id: result.id || `place-${Math.random().toString(36).substr(2, 9)}`,
    name: result.name,
    lat: result.lat,
    lon: result.lon,
    distance: result.distance,
    duration: result.duration
  }));

  // Handle location button click
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

  // Handle search submission
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      toast.error('Veuillez entrer un terme de recherche');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/search`, {
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
        
        // Center map on first result
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

  // Handle clicking on a search result
  const handleResultClick = (place: any) => {
    setSelectedPlaceId(place.id);
    setPopupInfo(place);
    setViewport({
      latitude: place.lat,
      longitude: place.lon,
      zoom: 14
    });
  };

  // Generate PDF with current results
  const generatePDF = async () => {
    if (places.length === 0) {
      toast.error('Aucun résultat à exporter');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:5000/generate_pdf', { places });
      toast.success('PDF généré avec succès');
      
      // Open the PDF in a new window/tab
      window.open('resultats.pdf');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <SearchHeader 
        resultsCount={resultsCount}
        setResultsCount={setResultsCount}
      />
      
      <div className="flex-grow relative">
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
        
        {/* Search Panel overlay */}
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
        
        {/* Results list */}
        {searchResults.length > 0 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-10 px-4">
            <div className="bg-white rounded-lg shadow-lg p-2 max-h-60 overflow-y-auto">
              <h3 className="text-sm font-medium px-3 py-1">Résultats</h3>
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
                      lon: result.lon
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
