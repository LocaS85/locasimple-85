
import React, { useState } from 'react';
import { Search, Mic, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface GeoSearcherProps {
  modes?: string[];
  placeholder?: string;
  enableVoice?: boolean;
  onResult?: (result: any) => void;
}

const GeoSearcher: React.FC<GeoSearcherProps> = ({
  modes = ['address'],
  placeholder = 'Rechercher...',
  enableVoice = false,
  onResult
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate a search result
    setTimeout(() => {
      setIsLoading(false);
      if (onResult) {
        onResult({
          name: query,
          coordinates: [2.3522, 48.8566]
        });
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleMicClick = () => {
    if (!enableVoice) return;
    
    // Toggle recording state
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      toast.info('Enregistrement vocal démarré');
    } else {
      toast.success('Enregistrement vocal terminé');
      // In a real implementation, we would process the voice recording here
    }
  };

  const handleLocationClick = () => {
    setIsLoading(true);
    
    toast.info('Recherche de votre position...');
    
    // Simulate geolocation
    setTimeout(() => {
      setIsLoading(false);
      if (onResult) {
        onResult({
          name: 'Ma position',
          coordinates: [2.3522, 48.8566]
        });
      }
    }, 1000);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          className="w-full px-4 py-2 pl-10 pr-16 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        
        <Search className="absolute left-3 text-gray-400" size={18} />
        
        <div className="absolute right-3 flex space-x-2">
          {enableVoice && (
            <button
              className={`p-1 rounded-full ${isRecording ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
              onClick={handleMicClick}
            >
              <Mic size={18} />
            </button>
          )}
          
          {modes.includes('current_location') && (
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={handleLocationClick}
            >
              <MapPin size={18} />
            </button>
          )}
        </div>
      </div>
      
      {isLoading && (
        <div className="absolute top-12 left-0 right-0 bg-white z-10 p-3 rounded-lg shadow-lg text-center">
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2"></div>
            <span>Recherche en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeoSearcher;
