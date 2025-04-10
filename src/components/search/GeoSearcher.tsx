
import React, { useState } from 'react';
import { Search, Mic, MapPin, Home, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface GeoSearcherProps {
  modes: string[];
  onResult: (result: any) => void;
  placeholder: string;
  enableVoice?: boolean;
}

const GeoSearcher: React.FC<GeoSearcherProps> = ({
  modes,
  onResult,
  placeholder,
  enableVoice = false
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSearch = () => {
    if (!searchValue.trim()) {
      toast.warning("Veuillez entrer une adresse ou un lieu");
      return;
    }
    
    // Simulate a geosearch result
    const mockResult = {
      name: searchValue,
      coordinates: [2.3522, 48.8566], // Paris coordinates as fallback
      type: 'address',
      properties: {
        address: searchValue
      }
    };
    
    onResult(mockResult);
    toast.success(`Recherche: ${searchValue}`);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleMicClick = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info("Dictez votre recherche...");
      // Simulate voice recognition
      setTimeout(() => {
        setIsRecording(false);
        setSearchValue("Paris, France");
        toast.success("Texte reconnu: Paris, France");
      }, 2000);
    } else {
      toast.info("Enregistrement arrêté");
    }
  };
  
  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onResult({
          name: "Position actuelle",
          coordinates: [longitude, latitude],
          type: 'current_location'
        });
        toast.success("Votre position a été définie");
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Impossible d'obtenir votre position actuelle");
        // Fallback to Paris
        onResult({
          name: "Position par défaut (Paris)",
          coordinates: [2.3522, 48.8566],
          type: 'current_location'
        });
      }
    );
  };

  return (
    <div className="relative flex flex-col sm:flex-row items-center w-full gap-2">
      <div className="relative flex-1 w-full">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-10 pl-4 py-2 rounded-md border border-gray-300 w-full shadow-sm"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
          {enableVoice && (
            <Button 
              variant="ghost" 
              size="icon"
              className={`h-8 w-8 ${isRecording ? 'text-red-500' : 'text-gray-400'} hover:text-gray-600 transition-colors`}
              onClick={handleMicClick}
            >
              <Mic size={18} className={isRecording ? 'animate-pulse' : ''} />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History size={18} />
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-2 w-full sm:w-auto">
        <Button 
          variant="default"
          className="w-full sm:w-auto"
          onClick={handleSearch}
        >
          <Search size={18} className="mr-2" />
          Rechercher
        </Button>
        
        {modes.includes('current_location') && (
          <Button 
            variant="outline"
            size="icon"
            className="flex-shrink-0"
            onClick={handleCurrentLocation}
          >
            <MapPin size={18} />
          </Button>
        )}
        
        {modes.includes('saved_places') && (
          <Button 
            variant="outline"
            size="icon"
            className="flex-shrink-0"
            onClick={() => toast.info("Fonctionnalité à venir: Lieux sauvegardés")}
          >
            <Home size={18} />
          </Button>
        )}
      </div>
      
      {/* Simple history dropdown */}
      {showHistory && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-2 text-sm font-medium text-gray-700 bg-gray-50 border-b">Recherches récentes</div>
          <div className="p-0">
            {["Paris, France", "Lyon, France", "Marseille, France"].map((item, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
                onClick={() => {
                  setSearchValue(item);
                  setShowHistory(false);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeoSearcher;
