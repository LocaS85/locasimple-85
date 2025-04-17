
import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

interface AddressSearchProps {
  onAddressSelect: (location: any) => void;
  placeholder: string;
}

const AddressSearch: React.FC<AddressSearchProps> = ({
  onAddressSelect,
  placeholder
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add click outside listener to close results dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Don't search on empty query
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchAddress = async () => {
      if (!MAPBOX_TOKEN) {
        console.error("Mapbox token is missing");
        toast.error("Configuration manquante pour la recherche d'adresse");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=5&country=fr`
        );
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const mappedResults = data.features.map((feature: any) => ({
            id: feature.id,
            name: feature.place_name,
            latitude: feature.center[1],
            longitude: feature.center[0],
            type: feature.place_type[0]
          }));
          setResults(mappedResults);
          setShowResults(true);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Error searching address:', error);
        toast.error("Erreur lors de la recherche d'adresse");
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      searchAddress();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleSelectLocation = (location: any) => {
    setQuery(location.name);
    setShowResults(false);
    onAddressSelect(location);
  };

  const handleClearInput = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pr-20 pl-10 py-2 w-full"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={handleClearInput}
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg overflow-hidden border border-gray-200">
          <ul className="max-h-60 overflow-y-auto">
            {results.map((result) => (
              <li
                key={result.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectLocation(result)}
              >
                <div className="text-sm">{result.name}</div>
                <div className="text-xs text-gray-500">{result.type}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isLoading && (
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default AddressSearch;
