
import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon, MapPinIcon, ClockIcon, XCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useGeolocation } from '@/hooks/useGeolocation';
import useVoiceRecording from '@/hooks/useVoiceRecording';
import SearchBar from '@/components/SearchBar';

interface GeoSearcherProps {
  modes: ('address' | 'current_location' | 'saved_places')[];
  onResult: (result: any) => void;
  placeholder?: string;
  enableVoice?: boolean;
}

const GeoSearcher: React.FC<GeoSearcherProps> = ({
  modes = ['address'],
  onResult,
  placeholder = "Rechercher un lieu...",
  enableVoice = false
}) => {
  const [activeMode, setActiveMode] = useState<string>(modes[0]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<any[]>([]);
  
  const { getCurrentPosition, loading: geoLoading } = useGeolocation();
  const { 
    startRecording, 
    stopRecording, 
    isRecording, 
    transcript, 
    resetTranscript 
  } = useVoiceRecording();
  
  // Load search history and saved places from local storage
  useEffect(() => {
    try {
      const history = localStorage.getItem('search_history');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
      
      const saved = localStorage.getItem('saved_places');
      if (saved) {
        setSavedPlaces(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);
  
  const handleLocationClick = async () => {
    try {
      const position = await getCurrentPosition();
      
      if (position) {
        const result = {
          type: 'current_location',
          name: 'Ma position',
          coordinates: [position.coords.longitude, position.coords.latitude]
        };
        
        onResult(result);
        toast.success('Position actuelle définie');
      }
    } catch (error) {
      toast.error('Impossible d\'obtenir votre position');
      console.error('Geolocation error:', error);
    }
  };
  
  const handleSearchResult = (result: any) => {
    // Add to search history
    const newHistory = [result.place_name, ...searchHistory.filter(item => item !== result.place_name)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
    
    // Format result and pass to parent
    onResult({
      type: 'address',
      name: result.place_name,
      coordinates: result.center,
      properties: result.properties
    });
    
    setIsHistoryOpen(false);
  };
  
  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
      if (transcript) {
        // Use transcript as search query
        // In a real implementation, you would pass this to a search function
        toast.info(`Recherche vocale: "${transcript}"`);
      }
    } else {
      resetTranscript();
      startRecording();
      toast.info('Dictez votre recherche...');
    }
  };
  
  const handleSavedPlaceSelect = (place: any) => {
    onResult(place);
    setIsHistoryOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Main search component */}
        <div className="flex-1">
          <SearchBar 
            onSearch={(query) => console.log("Search query:", query)}
            onSelectLocation={handleSearchResult}
          />
        </div>
        
        {/* Mode toggles */}
        <div className="flex gap-1">
          {modes.includes('current_location') && (
            <button
              onClick={handleLocationClick}
              disabled={geoLoading}
              className={`p-2 rounded-full ${geoLoading ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
              title="Utiliser ma position"
            >
              <MapPinIcon size={20} />
              <span className="sr-only">Ma position</span>
            </button>
          )}
          
          {modes.includes('saved_places') && (
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
              title="Historique et lieux sauvegardés"
            >
              <ClockIcon size={20} />
              <span className="sr-only">Historique</span>
            </button>
          )}
          
          {enableVoice && (
            <button
              onClick={handleVoiceToggle}
              className={`p-2 rounded-full ${isRecording ? 'bg-red-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
              title={isRecording ? 'Arrêter l\'enregistrement' : 'Recherche vocale'}
            >
              <MicrophoneIcon size={20} />
              <span className="sr-only">
                {isRecording ? 'Arrêter l\'enregistrement' : 'Recherche vocale'}
              </span>
            </button>
          )}
        </div>
      </div>
      
      {/* Voice recording feedback */}
      {isRecording && (
        <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span>{transcript || 'Enregistrement en cours...'}</span>
          </div>
          <button onClick={stopRecording}>
            <XCircleIcon size={20} />
          </button>
        </div>
      )}
      
      {/* History and saved places dropdown */}
      {isHistoryOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
          {(searchHistory.length === 0 && savedPlaces.length === 0) ? (
            <div className="p-3 text-center text-gray-500">
              Aucun historique de recherche
            </div>
          ) : (
            <div>
              {savedPlaces.length > 0 && (
                <div>
                  <h3 className="px-3 py-2 text-sm font-medium text-gray-500 bg-gray-50">Lieux enregistrés</h3>
                  {savedPlaces.map((place, index) => (
                    <button
                      key={`saved-${index}`}
                      className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center gap-2"
                      onClick={() => handleSavedPlaceSelect(place)}
                    >
                      <MapPinIcon size={16} className="text-blue-500" />
                      <span>{place.name}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {searchHistory.length > 0 && (
                <div>
                  <h3 className="px-3 py-2 text-sm font-medium text-gray-500 bg-gray-50">Recherches récentes</h3>
                  {searchHistory.map((item, index) => (
                    <button
                      key={`history-${index}`}
                      className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center gap-2"
                      onClick={() => {
                        // In a real implementation, you would perform a search with this history item
                        toast.info(`Recherche: "${item}"`);
                        setIsHistoryOpen(false);
                      }}
                    >
                      <ClockIcon size={16} className="text-gray-400" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GeoSearcher;
