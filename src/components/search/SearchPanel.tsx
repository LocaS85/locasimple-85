
import React, { useState } from 'react';
import { Search, Mic, MapPin, Printer, Settings, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FlaskServerStatus from './FlaskServerStatus';

interface SearchPanelProps {
  query: string;
  setQuery: (query: string) => void;
  search: (query: string) => void;
  isLocationActive: boolean;
  onLocationClick: () => void;
  loading: boolean;
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
  userLocation: [number, number];
  generatePDF: () => void;
  limit?: number;
  setLimit?: (limit: number) => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  query,
  setQuery,
  search,
  isLocationActive,
  onLocationClick,
  loading,
  transportMode,
  onTransportModeChange,
  userLocation,
  generatePDF,
  limit = 5,
  setLimit
}) => {
  const [showModes, setShowModes] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      search(query);
    }
  };
  
  const modes = [
    { id: 'driving', name: 'Voiture', icon: '🚗' },
    { id: 'walking', name: 'Marche', icon: '🚶' },
    { id: 'cycling', name: 'Vélo', icon: '🚴' },
    { id: 'transit', name: 'Transport', icon: '🚇' }
  ];
  
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm shadow-md">
      <form onSubmit={handleSubmit} className="p-2 flex items-center gap-2">
        <div className="relative flex-grow">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher (restaurants, parcs, etc.)"
            className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {query && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setQuery('')}
            >
              ×
            </button>
          )}
        </div>
        
        <Button 
          type="submit" 
          size="icon"
          disabled={loading || !query.trim()}
          className={`rounded-full ${loading ? 'animate-pulse' : ''}`}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
        
        <Button
          type="button"
          variant={isLocationActive ? "default" : "outline"}
          size="icon"
          onClick={onLocationClick}
          className="rounded-full"
        >
          <MapPin className="w-4 h-4" />
        </Button>
        
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowModes(!showModes)}
            className="rounded-full flex items-center gap-1"
          >
            <span>
              {modes.find(m => m.id === transportMode)?.icon || '🚗'}
            </span>
            <span className="hidden sm:inline text-xs">{modes.find(m => m.id === transportMode)?.name}</span>
          </Button>
          
          {showModes && (
            <div className="absolute top-full mt-1 right-0 bg-white shadow-lg rounded-lg p-2 z-20">
              <div className="grid grid-cols-1 gap-1">
                {modes.map(mode => (
                  <Button
                    key={mode.id}
                    variant={transportMode === mode.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      onTransportModeChange(mode.id);
                      setShowModes(false);
                    }}
                    className="justify-start"
                  >
                    <span className="mr-2">{mode.icon}</span>
                    <span>{mode.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={generatePDF}
          className="rounded-full"
          title="Générer PDF"
        >
          <Printer className="w-4 h-4" />
        </Button>
        
        <FlaskServerStatus className="ml-auto" />
      </form>
    </div>
  );
};

export default SearchPanel;
