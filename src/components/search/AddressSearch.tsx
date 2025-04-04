
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, X } from 'lucide-react';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

interface AddressSearchProps {
  onAddressSelect: (location: {
    name: string;
    longitude: number;
    latitude: number;
  }) => void;
  placeholder?: string;
  userLocation?: [number, number];
}

interface Suggestion {
  id: string;
  place_name: string;
  center: [number, number];
}

const AddressSearch: React.FC<AddressSearchProps> = ({
  onAddressSelect,
  placeholder = "Rechercher une adresse...",
  userLocation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch suggestions from Mapbox API
  useEffect(() => {
    if (!searchQuery.trim() || !MAPBOX_TOKEN || searchQuery.length < 3) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        // Create the proximity parameter if user location is available
        const proximityParam = userLocation
          ? `&proximity=${userLocation[0]},${userLocation[1]}`
          : '';

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&limit=5${proximityParam}`
        );

        if (!response.ok) throw new Error('Failed to fetch suggestions');

        const data = await response.json();
        setSuggestions(data.features);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        toast.error("Impossible de récupérer les suggestions d'adresses");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, userLocation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchQuery(suggestion.place_name);
    setShowSuggestions(false);
    onAddressSelect({
      name: suggestion.place_name,
      longitude: suggestion.center[0],
      latitude: suggestion.center[1]
    });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-500" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-10"
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md overflow-auto border border-gray-200"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-start"
            >
              <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium">{suggestion.place_name.split(',')[0]}</div>
                <div className="text-xs text-gray-500">
                  {suggestion.place_name.substring(suggestion.place_name.indexOf(',') + 1).trim()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressSearch;
