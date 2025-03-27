
import React, { useState, useEffect } from 'react';
import { useSearchPageState } from '@/hooks/useSearchPageState';
import SearchHeader from '@/components/search/SearchHeader';
import { SearchPanel } from '@/components/search/SearchPanel';
import MapSection from '@/components/search/MapSection';
import axios from 'axios';
import { toast } from 'sonner';
import { MAPBOX_TOKEN } from '@/config/environment';
import { Printer, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Result } from '@/components/ResultsList';

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
  const [showRoutes, setShowRoutes] = useState(true);
  
  // Convert search results to places format for the map
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
      
      // Fallback to use Mapbox API directly if Flask server is not running
      try {
        await searchWithMapbox(query);
      } catch (mapboxError) {
        console.error('Erreur lors de la recherche avec Mapbox:', mapboxError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fallback search method using Mapbox directly
  const searchWithMapbox = async (query: string) => {
    if (!MAPBOX_TOKEN) {
      toast.error('Token Mapbox manquant');
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
        // Transform mapbox results to match our format
        const formattedResults = response.data.features.map((feature: any) => ({
          id: feature.id,
          name: feature.text,
          lat: feature.center[1],
          lon: feature.center[0],
          place_name: feature.place_name,
          category: feature.properties?.category || '',
          distance: 0, // Would need to calculate
          duration: 0  // Would need to calculate
        }));

        setSearchResults(formattedResults);
        
        // Center map on first result
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

  // Toggle route display
  const toggleRoutes = () => {
    setShowRoutes(!showRoutes);
  };

  // Check if Flask server is running on component mount
  useEffect(() => {
    const checkFlaskServer = async () => {
      try {
        await axios.get('http://127.0.0.1:5000/search', { 
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
    
    // Attempt to get user location on mount
    handleLocationClick();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      <SearchHeader 
        resultsCount={resultsCount}
        setResultsCount={setResultsCount}
      />
      
      <div className="flex-grow relative">
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
          selectedCategory={null}
          onCategorySelect={() => {}}
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
        
        {/* Control buttons */}
        <div className="absolute top-4 right-4 flex space-x-2 z-20">
          <Button variant="outline" size="sm" onClick={generatePDF} className="bg-white">
            <Printer className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleRoutes} 
            className={`${showRoutes ? 'bg-blue-100' : 'bg-white'}`}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        
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
