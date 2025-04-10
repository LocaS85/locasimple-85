
import React, { useState } from 'react';
import { Search, Mic, MapPin, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  
  const handleSearch = () => {
    if (!searchValue.trim()) return;
    
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
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative flex items-center w-full">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-10 pl-4 py-2 rounded-md border border-gray-300 w-full"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
          {enableVoice && (
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-gray-600"
              onClick={() => console.log('Voice search activated')}
            >
              <Mic size={18} />
            </Button>
          )}
        </div>
      </div>
      
      <Button 
        variant="default"
        className="ml-2"
        onClick={handleSearch}
      >
        <Search size={18} className="mr-2" />
        Rechercher
      </Button>
      
      {modes.includes('current_location') && (
        <Button 
          variant="outline"
          size="icon"
          className="ml-2"
          onClick={() => {
            onResult({
              name: "Position actuelle",
              coordinates: [2.3522, 48.8566], // Fake coordinates
              type: 'current_location'
            });
          }}
        >
          <MapPin size={18} />
        </Button>
      )}
      
      {modes.includes('saved_places') && (
        <Button 
          variant="outline"
          size="icon"
          className="ml-2"
          onClick={() => console.log('Saved places')}
        >
          <Home size={18} />
        </Button>
      )}
    </div>
  );
};

export default GeoSearcher;
